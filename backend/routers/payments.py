from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
import stripe
import os
import requests
import base64
from backend.deps import get_current_user
from backend.models import User

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_your_key_here")

# Initialize PayPal
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID", "")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET", "")
PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox")  # sandbox or live
PAYPAL_API_BASE = f"https://api-m.{PAYPAL_MODE}.paypal.com" if PAYPAL_MODE == "sandbox" else "https://api-m.paypal.com"

router = APIRouter()

# Pydantic Models
class CheckoutSessionRequest(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str
    customer_email: Optional[EmailStr] = None
    payment_method: Optional[str] = "stripe"  # stripe or paypal

class SubscriptionRequest(BaseModel):
    price_id: str
    customer_email: EmailStr

class PayPalOrderRequest(BaseModel):
    amount: float
    currency: str = "USD"
    description: Optional[str] = None
    return_url: str
    cancel_url: str

class PaymentIntentRequest(BaseModel):
    amount: int  # Amount in cents
    currency: str = "usd"
    description: Optional[str] = None

# Helper Functions
def get_paypal_access_token():
    """Get PayPal OAuth access token"""
    auth = base64.b64encode(f"{PAYPAL_CLIENT_ID}:{PAYPAL_CLIENT_SECRET}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    response = requests.post(f"{PAYPAL_API_BASE}/v1/oauth2/token", headers=headers, data=data)
    if response.status_code == 200:
        return response.json().get("access_token")
    raise HTTPException(status_code=500, detail="Failed to get PayPal access token")

# ============= STRIPE ENDPOINTS =============

@router.post("/create-checkout-session")
async def create_checkout_session(request: CheckoutSessionRequest):
    """
    Create a Stripe Checkout Session for one-time payments or subscriptions
    """
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': request.price_id,
                'quantity': 1,
            }],
            mode='payment',  # or 'subscription' for recurring payments
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            customer_email=request.customer_email,
        )
        return {"sessionId": session.id, "url": session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/create-subscription-checkout")
async def create_subscription_checkout(request: CheckoutSessionRequest):
    """
    Create a Stripe Checkout Session specifically for subscriptions
    """
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': request.price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            customer_email=request.customer_email,
        )
        return {"sessionId": session.id, "url": session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/create-payment-intent")
async def create_payment_intent(request: PaymentIntentRequest):
    """
    Create a Payment Intent for custom payment flows
    """
    try:
        intent = stripe.PaymentIntent.create(
            amount=request.amount,
            currency=request.currency,
            description=request.description,
            automatic_payment_methods={
                'enabled': True,
            },
        )
        return {
            "clientSecret": intent.client_secret,
            "paymentIntentId": intent.id
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/subscription-status/{subscription_id}")
async def get_subscription_status(subscription_id: str, current_user: User = Depends(get_current_user)):
    """
    Get the status of a subscription
    """
    try:
        subscription = stripe.Subscription.retrieve(subscription_id)
        return {
            "id": subscription.id,
            "status": subscription.status,
            "current_period_end": subscription.current_period_end,
            "cancel_at_period_end": subscription.cancel_at_period_end,
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/cancel-subscription/{subscription_id}")
async def cancel_subscription(subscription_id: str, current_user: User = Depends(get_current_user)):
    """
    Cancel a subscription at the end of the billing period
    """
    try:
        subscription = stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=True
        )
        return {
            "id": subscription.id,
            "status": subscription.status,
            "cancel_at_period_end": subscription.cancel_at_period_end,
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: dict):
    """
    Handle Stripe webhook events
    """
    # In production, verify the webhook signature
    # sig_header = request.headers.get('stripe-signature')
    # event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    
    event_type = request.get('type')
    
    if event_type == 'checkout.session.completed':
        session = request.get('data', {}).get('object', {})
        # Handle successful payment
        # Update user subscription status in database
        pass
    
    elif event_type == 'customer.subscription.deleted':
        subscription = request.get('data', {}).get('object', {})
        # Handle subscription cancellation
        pass
    
    elif event_type == 'invoice.payment_failed':
        invoice = request.get('data', {}).get('object', {})
        # Handle failed payment
        pass
    
    return {"status": "success"}

@router.get("/prices")
async def get_prices():
    """
    Get all available pricing plans
    """
    try:
        prices = stripe.Price.list(active=True, expand=['data.product'])
        return {"prices": prices.data}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))

# ============= PAYPAL ENDPOINTS =============

@router.post("/paypal/create-order")
async def create_paypal_order(request: PayPalOrderRequest):
    """
    Create a PayPal order for payment
    """
    try:
        access_token = get_paypal_access_token()
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        
        order_data = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": request.currency,
                    "value": str(request.amount)
                },
                "description": request.description or "LearnFlow Subscription"
            }],
            "application_context": {
                "return_url": request.return_url,
                "cancel_url": request.cancel_url,
                "brand_name": "LearnFlow",
                "landing_page": "BILLING",
                "user_action": "PAY_NOW"
            }
        }
        
        response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders",
            headers=headers,
            json=order_data
        )
        
        if response.status_code == 201:
            order = response.json()
            # Find the approval URL
            approval_url = next(
                (link["href"] for link in order.get("links", []) if link["rel"] == "approve"),
                None
            )
            return {
                "orderId": order["id"],
                "approvalUrl": approval_url,
                "status": order["status"]
            }
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/paypal/capture-order/{order_id}")
async def capture_paypal_order(order_id: str):
    """
    Capture a PayPal order after customer approval
    """
    try:
        access_token = get_paypal_access_token()
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        
        response = requests.post(
            f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture",
            headers=headers
        )
        
        if response.status_code == 201:
            capture_data = response.json()
            return {
                "orderId": order_id,
                "status": capture_data["status"],
                "captureId": capture_data.get("purchase_units", [{}])[0].get("payments", {}).get("captures", [{}])[0].get("id"),
                "amount": capture_data.get("purchase_units", [{}])[0].get("payments", {}).get("captures", [{}])[0].get("amount")
            }
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/paypal/order-status/{order_id}")
async def get_paypal_order_status(order_id: str):
    """
    Get the status of a PayPal order
    """
    try:
        access_token = get_paypal_access_token()
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        
        response = requests.get(
            f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}",
            headers=headers
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============= PAYOUT INFORMATION =============

@router.get("/payout-info")
async def get_payout_information():
    """
    Get information about how suppliers/course creators receive their funds
    
    This endpoint explains the payment flow and payout schedule for course creators
    """
    return {
        "payout_methods": {
            "stripe": {
                "name": "Stripe Connect",
                "description": "Automated payouts to your bank account",
                "schedule": "Rolling basis (daily, weekly, or monthly)",
                "processing_time": "2-7 business days",
                "fees": "2.9% + $0.30 per transaction",
                "supported_countries": "45+ countries",
                "setup": {
                    "step_1": "Connect your Stripe account in Dashboard → Settings → Payouts",
                    "step_2": "Verify your bank account details",
                    "step_3": "Set your payout schedule (daily, weekly, monthly)",
                    "step_4": "Receive automatic transfers to your bank"
                },
                "minimum_payout": "$1.00 USD",
                "currency_support": "135+ currencies"
            },
            "paypal": {
                "name": "PayPal Payouts",
                "description": "Direct transfers to your PayPal account",
                "schedule": "Instant or scheduled",
                "processing_time": "Instant to 1 business day",
                "fees": "2.9% + $0.30 per transaction",
                "supported_countries": "200+ countries",
                "setup": {
                    "step_1": "Link your PayPal account in Dashboard → Settings → Payouts",
                    "step_2": "Verify your PayPal email",
                    "step_3": "Choose instant or scheduled payouts",
                    "step_4": "Receive funds directly to PayPal balance"
                },
                "minimum_payout": "$1.00 USD",
                "currency_support": "25+ currencies"
            },
            "bank_transfer": {
                "name": "Direct Bank Transfer",
                "description": "ACH/Wire transfer to your bank account",
                "schedule": "Weekly or monthly",
                "processing_time": "3-5 business days (ACH), 1-2 days (Wire)",
                "fees": "No additional fees (included in platform fee)",
                "supported_countries": "US, UK, EU, Canada, Australia",
                "setup": {
                    "step_1": "Add bank account in Dashboard → Settings → Bank Accounts",
                    "step_2": "Verify with micro-deposits",
                    "step_3": "Set payout schedule",
                    "step_4": "Receive automatic transfers"
                },
                "minimum_payout": "$25.00 USD"
            }
        },
        "payment_flow": {
            "step_1": {
                "title": "Student Makes Purchase",
                "description": "Student pays for your course via Stripe or PayPal",
                "timing": "Instant"
            },
            "step_2": {
                "title": "Payment Processing",
                "description": "Payment is processed and verified",
                "timing": "1-2 seconds"
            },
            "step_3": {
                "title": "Platform Fee Deduction",
                "description": "LearnFlow platform fee is deducted (if applicable)",
                "timing": "Instant"
            },
            "step_4": {
                "title": "Funds Held (Optional)",
                "description": "Funds may be held for refund period (7-30 days)",
                "timing": "Configurable"
            },
            "step_5": {
                "title": "Payout Initiated",
                "description": "Funds are transferred to your chosen payout method",
                "timing": "Based on your schedule"
            },
            "step_6": {
                "title": "Funds Received",
                "description": "Money arrives in your bank account or PayPal",
                "timing": "2-7 business days"
            }
        },
        "revenue_tracking": {
            "dashboard": "Real-time revenue tracking in your dashboard",
            "reports": "Detailed transaction reports available",
            "analytics": "Revenue analytics and forecasting",
            "tax_documents": "Automatic 1099-K generation (US) and tax reports"
        },
        "refund_policy": {
            "description": "Refunds are deducted from your next payout",
            "processing": "Automatic refund processing",
            "notification": "Email notification for all refunds"
        },
        "support": {
            "email": "payouts@learnflow.com",
            "documentation": "https://docs.learnflow.com/payouts",
            "live_chat": "Available in dashboard"
        }
    }

@router.get("/my-earnings")
async def get_my_earnings(current_user: User = Depends(get_current_user)):
    """
    Get current user's earnings and payout information
    
    This would typically fetch from database based on user's sales
    """
    # This is a placeholder - in production, fetch from database
    return {
        "user_id": current_user.id if hasattr(current_user, 'id') else "user_123",
        "total_revenue": 0.00,
        "pending_payout": 0.00,
        "next_payout_date": "2026-02-01",
        "payout_method": "stripe",
        "lifetime_earnings": 0.00,
        "currency": "USD",
        "transactions": [],
        "payout_history": []
    }
