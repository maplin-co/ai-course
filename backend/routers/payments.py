from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
import stripe
import os
from backend.deps import get_current_user
from backend.models import User

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_your_key_here")

router = APIRouter()

class CheckoutSessionRequest(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str
    customer_email: Optional[EmailStr] = None

class SubscriptionRequest(BaseModel):
    price_id: str
    customer_email: EmailStr

class PaymentIntentRequest(BaseModel):
    amount: int  # Amount in cents
    currency: str = "usd"
    description: Optional[str] = None

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
