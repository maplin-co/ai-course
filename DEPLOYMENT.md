# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Stripe Setup

- [ ] Create Stripe account (<https://dashboard.stripe.com/register>)
- [ ] Get API keys from Dashboard → Developers → API keys
- [ ] Create products and prices in Dashboard → Products
- [ ] Set up webhook endpoint
- [ ] Test with test mode keys first

### 2. Environment Configuration

- [ ] Update all environment variables
- [ ] Replace test keys with production keys
- [ ] Configure MongoDB connection string
- [ ] Set secure SECRET_KEY for JWT
- [ ] Configure CORS_ORIGINS for production domain

### 3. Code Updates

- [ ] Update Stripe publishable key in `checkout.html` (line 358)
- [ ] Update Price IDs in `checkout.html` (lines 142, 165, 208)
- [ ] Update success/cancel URLs in checkout flow
- [ ] Verify all links point to production domain

### 4. Security

- [ ] Enable HTTPS/SSL certificate
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Verify webhook signature validation
- [ ] Review CORS settings

## Stripe Configuration Steps

### Step 1: Create Products

1. Go to Stripe Dashboard → Products
2. Click "Add Product"
3. Create three products:

**Starter Plan**

- Name: LearnFlow Starter
- Description: Perfect for getting started
- Pricing: $29/month (recurring)
- Copy the Price ID (starts with `price_`)

**Professional Plan**

- Name: LearnFlow Professional
- Description: For growing businesses
- Pricing: $79/month (recurring)
- Copy the Price ID

**Enterprise Plan**

- Name: LearnFlow Enterprise
- Description: For large organizations
- Pricing: $199/month (recurring)
- Copy the Price ID

### Step 2: Update Price IDs

Open `checkout.html` and update:

```html
<!-- Line 142 -->
<div class="plan-card" data-price-id="price_XXXXXXXXXXXXX">

<!-- Line 165 -->
<div class="plan-card" data-price-id="price_XXXXXXXXXXXXX">

<!-- Line 208 -->
<div class="plan-card" data-price-id="price_XXXXXXXXXXXXX">
```

### Step 3: Configure Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/payments/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the Webhook Secret (starts with `whsec_`)
6. Add to `backend/.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`

### Step 4: Update Checkout Page

Open `checkout.html` and find line 358:

```javascript
const stripe = Stripe('pk_test_your_publishable_key_here');
```

Replace with your actual publishable key:

```javascript
const stripe = Stripe('pk_live_XXXXXXXXXXXXX'); // For production
// OR
const stripe = Stripe('pk_test_XXXXXXXXXXXXX'); // For testing
```

## Backend Deployment

### Option 1: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables in Railway dashboard
# Deploy
railway up
```

### Option 2: Render

1. Connect GitHub repository
2. Create new Web Service
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in dashboard

### Option 3: Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongodb:sandbox

# Set environment variables
heroku config:set SECRET_KEY=your_secret_key
heroku config:set STRIPE_SECRET_KEY=sk_live_xxx
heroku config:set STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Deploy
git push heroku main
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Or connect GitHub repository in Vercel dashboard
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### Option 3: Static Hosting

For the root HTML files (preview.html, checkout.html, etc.):

1. Upload to any static hosting (Vercel, Netlify, GitHub Pages)
2. Ensure all links are updated to production URLs
3. Update API endpoints to point to production backend

## Post-Deployment

### 1. Test Payment Flow

- [ ] Visit pricing page
- [ ] Select a plan
- [ ] Complete checkout with test card: 4242 4242 4242 4242
- [ ] Verify redirect to success page
- [ ] Check Stripe Dashboard for payment
- [ ] Verify webhook was received

### 2. Monitor

- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Monitor Stripe Dashboard for failed payments
- [ ] Check server logs regularly
- [ ] Set up uptime monitoring

### 3. Go Live

- [ ] Switch from test mode to live mode in Stripe
- [ ] Update all API keys to live keys
- [ ] Test with real payment method
- [ ] Announce launch!

## Environment Variables Reference

### Production Backend (.env)

```env
# Database
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname
DB_NAME=learnflow_production

# Security
SECRET_KEY=generate_a_secure_random_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Stripe (LIVE KEYS)
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXXX
STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXX
```

## Troubleshooting

### Payments Not Working

1. Check Stripe Dashboard → Logs for errors
2. Verify API keys are correct (live vs test)
3. Check browser console for JavaScript errors
4. Ensure backend is accessible from frontend
5. Verify CORS settings

### Webhook Not Receiving Events

1. Check webhook URL is publicly accessible
2. Verify webhook secret matches
3. Check Stripe Dashboard → Webhooks → Events
4. Ensure endpoint returns 200 status
5. Test webhook with Stripe CLI:

   ```bash
   stripe listen --forward-to localhost:8000/api/payments/webhook
   ```

### Database Connection Issues

1. Verify MongoDB connection string
2. Check IP whitelist in MongoDB Atlas
3. Ensure database user has correct permissions
4. Test connection with MongoDB Compass

## Security Best Practices

1. **Never commit sensitive keys to Git**
   - Use `.env` files
   - Add `.env` to `.gitignore`
   - Use environment variables in hosting platform

2. **Implement rate limiting**

   ```python
   from slowapi import Limiter
   limiter = Limiter(key_func=get_remote_address)
   ```

3. **Validate webhook signatures**

   ```python
   sig_header = request.headers.get('stripe-signature')
   event = stripe.Webhook.construct_event(
       payload, sig_header, endpoint_secret
   )
   ```

4. **Use HTTPS everywhere**
   - Enable SSL certificate
   - Redirect HTTP to HTTPS
   - Set secure cookie flags

5. **Sanitize user inputs**
   - Validate all form inputs
   - Use Pydantic models
   - Prevent SQL/NoSQL injection

## Monitoring & Analytics

### Stripe Dashboard

- Monitor payment volume
- Track failed payments
- Review customer disputes
- Analyze revenue metrics

### Application Monitoring

- Set up error tracking (Sentry)
- Monitor API response times
- Track user engagement
- Set up alerts for critical errors

## Backup Strategy

1. **Database Backups**
   - Enable automated backups in MongoDB Atlas
   - Schedule daily backups
   - Test restore process

2. **Code Backups**
   - Use Git version control
   - Push to remote repository regularly
   - Tag releases

3. **Configuration Backups**
   - Document all environment variables
   - Keep secure backup of API keys
   - Store in password manager

## Scaling Considerations

### When to Scale

- Response times > 500ms
- Database queries slow
- High CPU/memory usage
- Increased traffic

### How to Scale

1. **Horizontal Scaling**
   - Add more server instances
   - Use load balancer
   - Implement caching (Redis)

2. **Database Scaling**
   - Upgrade MongoDB tier
   - Add read replicas
   - Implement database indexing

3. **CDN for Static Assets**
   - Use Cloudflare or AWS CloudFront
   - Cache images and static files
   - Reduce server load

## Support & Maintenance

### Regular Tasks

- [ ] Weekly: Review error logs
- [ ] Monthly: Update dependencies
- [ ] Monthly: Review Stripe metrics
- [ ] Quarterly: Security audit
- [ ] Yearly: Renew SSL certificates

### Emergency Contacts

- Stripe Support: <https://support.stripe.com>
- MongoDB Support: <https://support.mongodb.com>
- Hosting Support: Check your provider

---

**Last Updated**: January 2026
**Version**: 1.0.0
