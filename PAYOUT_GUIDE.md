# Payment & Payout System Guide

## Overview

LearnFlow provides a comprehensive payment and payout system that allows course creators (suppliers) to receive funds from student purchases through multiple payment methods.

## Supported Payment Methods

### 1. Stripe (Credit/Debit Cards)

- **What it is**: Industry-leading payment processor
- **Accepts**: Visa, Mastercard, American Express, Discover, Apple Pay, Google Pay
- **Processing Fee**: 2.9% + $0.30 per transaction
- **Settlement Time**: 2-7 business days

### 2. PayPal

- **What it is**: Popular digital wallet and payment platform
- **Accepts**: PayPal balance, linked bank accounts, credit/debit cards
- **Processing Fee**: 2.9% + $0.30 per transaction
- **Settlement Time**: Instant to 1 business day

### 3. Direct Debit/ACH (Coming Soon)

- **What it is**: Bank-to-bank transfers
- **Processing Fee**: Lower fees (typically 0.8%)
- **Settlement Time**: 3-5 business days

---

## How Suppliers Receive Funds

### Payment Flow

```
Student Purchase
      ↓
Payment Processor (Stripe/PayPal)
      ↓
Payment Verification
      ↓
Platform Fee Deduction (if applicable)
      ↓
Funds Held (Optional refund period: 7-30 days)
      ↓
Payout Initiated (based on schedule)
      ↓
Supplier Receives Funds
```

### Detailed Steps

#### Step 1: Student Makes Purchase

- Student selects a course and proceeds to checkout
- Chooses payment method (Stripe or PayPal)
- Completes payment securely
- **Timing**: Instant

#### Step 2: Payment Processing

- Payment is verified and authorized
- Fraud checks are performed
- Transaction is recorded in the system
- **Timing**: 1-2 seconds

#### Step 3: Platform Fee Deduction

- LearnFlow platform fee is deducted (if applicable)
- Standard fee: 0-10% depending on plan
- Professional plan: 5%
- Enterprise plan: 0% (you keep 100%)
- **Timing**: Instant

#### Step 4: Funds Holding Period (Optional)

- Funds may be held for a refund period
- Default: 7 days for new creators, 0 days for established creators
- Protects against chargebacks and refunds
- **Timing**: Configurable (0-30 days)

#### Step 5: Payout Initiated

- Based on your payout schedule:
  - **Daily**: Funds from yesterday
  - **Weekly**: Funds from last week (every Monday)
  - **Monthly**: Funds from last month (1st of month)
- **Timing**: Automatic based on schedule

#### Step 6: Funds Received

- Money arrives in your chosen account
- Stripe: Bank account (2-7 business days)
- PayPal: PayPal balance (instant to 1 day)
- Bank Transfer: ACH (3-5 days) or Wire (1-2 days)

---

## Payout Methods

### Option 1: Stripe Connect (Recommended)

**Setup Process:**

1. Go to Dashboard → Settings → Payouts
2. Click "Connect Stripe Account"
3. Complete Stripe onboarding (verify identity, add bank account)
4. Set payout schedule (daily, weekly, monthly)
5. Receive automatic transfers

**Benefits:**

- ✅ Automatic payouts
- ✅ 135+ currencies supported
- ✅ Available in 45+ countries
- ✅ Real-time balance tracking
- ✅ Detailed transaction reports
- ✅ Tax document generation

**Fees:**

- No additional fees beyond transaction fees
- Minimum payout: $1.00 USD
- No maximum limit

**Processing Time:**

- Standard: 2-7 business days
- Instant Payouts: Available for 1% fee (US only)

---

### Option 2: PayPal Payouts

**Setup Process:**

1. Go to Dashboard → Settings → Payouts
2. Click "Link PayPal Account"
3. Enter your PayPal email address
4. Verify email via confirmation link
5. Choose payout schedule

**Benefits:**

- ✅ Instant payouts available
- ✅ 200+ countries supported
- ✅ 25+ currencies
- ✅ Use funds immediately in PayPal
- ✅ Easy withdrawal to bank

**Fees:**

- No additional fees beyond transaction fees
- Minimum payout: $1.00 USD
- Instant payout: No extra fee

**Processing Time:**

- Instant: Immediate to PayPal balance
- Standard: 1 business day

---

### Option 3: Direct Bank Transfer

**Setup Process:**

1. Go to Dashboard → Settings → Bank Accounts
2. Click "Add Bank Account"
3. Enter routing and account numbers
4. Verify with micro-deposits (2-3 days)
5. Set payout schedule

**Benefits:**

- ✅ No intermediary fees
- ✅ Direct to your bank
- ✅ Secure ACH/Wire transfers
- ✅ Available in US, UK, EU, Canada, Australia

**Fees:**

- ACH: Free
- Wire: $25 per transfer
- Minimum payout: $25.00 USD

**Processing Time:**

- ACH: 3-5 business days
- Wire: 1-2 business days

---

## Payout Schedules

### Daily Payouts

- **Frequency**: Every business day
- **Includes**: Previous day's earnings
- **Best for**: High-volume sellers
- **Minimum**: $25/day

### Weekly Payouts

- **Frequency**: Every Monday
- **Includes**: Previous week's earnings (Monday-Sunday)
- **Best for**: Most creators
- **Minimum**: $50/week

### Monthly Payouts

- **Frequency**: 1st of each month
- **Includes**: Previous month's earnings
- **Best for**: Part-time creators
- **Minimum**: $100/month

---

## Revenue Tracking

### Dashboard Features

- **Real-time Balance**: See your current balance
- **Pending Payouts**: View upcoming payouts
- **Transaction History**: Detailed list of all sales
- **Revenue Analytics**: Charts and insights
- **Refund Tracking**: Monitor refunds

### Reports Available

1. **Transaction Report**: All sales with details
2. **Payout Report**: History of all payouts
3. **Tax Report**: Annual earnings summary
4. **Revenue Forecast**: Projected earnings

### Export Options

- CSV export
- PDF reports
- Excel format
- API access

---

## Fees & Pricing

### Transaction Fees

| Payment Method | Fee | Who Pays |
|---------------|-----|----------|
| Stripe (Card) | 2.9% + $0.30 | Deducted from sale |
| PayPal | 2.9% + $0.30 | Deducted from sale |
| ACH Transfer | 0.8% | Deducted from sale |

### Platform Fees

| Plan | Platform Fee | You Keep |
|------|-------------|----------|
| Starter | 10% | 90% |
| Professional | 5% | 95% |
| Enterprise | 0% | 100% |

### Example Calculation

**Scenario**: Student purchases $100 course

```
Sale Price:           $100.00
Stripe Fee (2.9%):    -$2.90
Stripe Fixed Fee:     -$0.30
Platform Fee (5%):    -$5.00
─────────────────────────────
Your Payout:          $91.80
```

---

## Refunds & Chargebacks

### Refund Process

1. Student requests refund
2. You approve/deny in dashboard
3. If approved, refund is processed
4. Amount is deducted from next payout
5. Transaction fees are not returned

### Chargeback Protection

- Stripe/PayPal handle disputes
- You're notified of chargebacks
- Evidence can be submitted
- Funds held until resolution

---

## Tax Information

### US Creators

- **Form 1099-K**: Issued if earnings > $600/year
- **Available**: By January 31st
- **Access**: Dashboard → Tax Documents

### International Creators

- **Tax Forms**: Varies by country
- **VAT/GST**: Handled automatically where applicable
- **Withholding**: May apply based on tax treaties

### Tax Reporting

- All transactions tracked
- Annual summary provided
- Export for accountant
- Integration with accounting software

---

## Security & Compliance

### PCI Compliance

- LearnFlow is PCI-DSS Level 1 compliant
- We never store card details
- All payments encrypted
- Secure tokenization

### Fraud Prevention

- Machine learning fraud detection
- 3D Secure authentication
- Address verification
- Velocity checks

### Data Protection

- GDPR compliant
- SOC 2 Type II certified
- Bank-level encryption
- Regular security audits

---

## API Endpoints

### Get Payout Information

```bash
GET /api/payments/payout-info
```

Returns comprehensive payout information including methods, schedules, and fees.

### Get My Earnings

```bash
GET /api/payments/my-earnings
```

Returns current user's earnings, pending payouts, and transaction history.

### Create PayPal Order

```bash
POST /api/payments/paypal/create-order
```

Creates a PayPal order for payment processing.

### Capture PayPal Order

```bash
POST /api/payments/paypal/capture-order/{order_id}
```

Captures funds from an approved PayPal order.

---

## Troubleshooting

### Payout Delayed

**Possible Reasons:**

- Bank holiday
- Account verification pending
- Minimum payout not met
- Refund period active

**Solution:**

- Check payout schedule
- Verify bank account
- Contact support

### Payout Failed

**Possible Reasons:**

- Invalid bank account
- Account closed
- Incorrect routing number

**Solution:**

- Update bank details
- Verify account status
- Re-initiate payout

### Missing Funds

**Possible Reasons:**

- Refund processed
- Chargeback occurred
- Platform fee applied

**Solution:**

- Check transaction history
- Review refund log
- Contact support

---

## Best Practices

### For Maximum Earnings

1. ✅ Choose Enterprise plan (0% platform fee)
2. ✅ Set up instant payouts
3. ✅ Monitor refund requests
4. ✅ Maintain good customer service
5. ✅ Keep bank details updated

### For Faster Payouts

1. ✅ Use PayPal for instant access
2. ✅ Enable daily payout schedule
3. ✅ Maintain low refund rate
4. ✅ Complete account verification

### For Better Tracking

1. ✅ Review dashboard daily
2. ✅ Export monthly reports
3. ✅ Set up email notifications
4. ✅ Use revenue analytics

---

## Support

### Contact Options

- **Email**: <payouts@learnflow.com>
- **Live Chat**: Available in dashboard
- **Phone**: +1 (555) 123-4567
- **Documentation**: <https://docs.learnflow.com/payouts>

### Response Times

- Email: 24 hours
- Live Chat: Instant
- Phone: Business hours (9am-5pm EST)

### Escalation

For urgent payout issues, mark ticket as "Urgent" or call support directly.

---

## Frequently Asked Questions

### Q: When will I receive my first payout?

**A:** After your first sale, funds are held for 7 days (for new accounts), then paid according to your schedule.

### Q: Can I change my payout method?

**A:** Yes, anytime in Dashboard → Settings → Payouts.

### Q: What's the minimum payout amount?

**A:** $1 for Stripe/PayPal, $25 for bank transfer.

### Q: Are there payout limits?

**A:** No maximum limit. Minimum depends on method.

### Q: What if a student requests a refund after I've been paid?

**A:** The refund amount is deducted from your next payout.

### Q: Can I have multiple payout methods?

**A:** Yes, you can set primary and backup methods.

### Q: How do I track my earnings?

**A:** Real-time tracking available in your dashboard.

### Q: What happens if my bank account is closed?

**A:** Payout will fail. Update your bank details immediately.

---

**Last Updated**: January 2026  
**Version**: 1.0.0

For the most up-to-date information, visit: <https://docs.learnflow.com/payouts>
