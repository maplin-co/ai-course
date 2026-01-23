# LearnFlow - AI-Powered Education Business Platform

LearnFlow is a production-ready, all-in-one platform for building and scaling online education businesses. Built with AI-powered course creation, integrated payment processing, and a beautiful modern UI.

## 🚀 Features

### Core Platform

- **AI Course Builder**: Generate complete course outlines, scripts, and quizzes in seconds
- **Site Builder**: Create branded websites with professional templates
- **Student Management**: Track student progress, engagement, and completion rates
- **Payment Processing**: Integrated Stripe payment gateway for subscriptions and one-time payments
- **Mobile App Ready**: White-label mobile app support for enterprise customers

### Payment Features

- ✅ Stripe Integration (Credit Cards, Apple Pay, Google Pay)
- ✅ Subscription Management
- ✅ One-time Payments
- ✅ 7-day Free Trials
- ✅ Secure Checkout Flow
- ✅ Webhook Support for Payment Events
- ✅ Multiple Pricing Tiers

### Tech Stack

- **Frontend**: React, TailwindCSS, HTML5
- **Backend**: FastAPI (Python), MongoDB
- **Payments**: Stripe API
- **Authentication**: JWT tokens
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (local or Atlas)
- Stripe Account (for payments)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-course-1
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
# Edit backend/.env with your credentials:
# - MONGO_URL: Your MongoDB connection string
# - SECRET_KEY: Your JWT secret key
# - STRIPE_SECRET_KEY: Your Stripe secret key (from Stripe Dashboard)
# - STRIPE_PUBLISHABLE_KEY: Your Stripe publishable key
# - STRIPE_WEBHOOK_SECRET: Your Stripe webhook secret

# Run the backend server
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### 4. Stripe Configuration

1. **Get your Stripe Keys**:
   - Go to <https://dashboard.stripe.com/test/apikeys>
   - Copy your Publishable Key and Secret Key
   - Add them to `backend/.env`

2. **Update Checkout Page**:
   - Open `checkout.html`
   - Replace `pk_test_your_publishable_key_here` with your actual Stripe Publishable Key (line 358)

3. **Create Products & Prices in Stripe**:

   ```bash
   # In Stripe Dashboard, create products for:
   # - Starter Plan ($29/month)
   # - Professional Plan ($79/month)
   # - Enterprise Plan ($199/month)
   
   # Copy the Price IDs and update checkout.html:
   # - data-price-id="price_starter" (line 142)
   # - data-price-id="price_professional" (line 165)
   # - data-price-id="price_enterprise" (line 208)
   ```

4. **Setup Webhooks** (for production):
   - Go to <https://dashboard.stripe.com/test/webhooks>
   - Add endpoint: `https://yourdomain.com/api/payments/webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
   - Copy webhook secret to `backend/.env`

## 🌐 Deployment

### Backend (Railway/Render/Heroku)

```bash
# Set environment variables in your hosting platform
# Deploy backend with:
uvicorn server:app --host 0.0.0.0 --port $PORT
```

### Frontend (Vercel/Netlify)

```bash
# Build the frontend
cd frontend
npm run build

# Deploy the build folder
# Or connect your Git repository to Vercel/Netlify
```

## 📁 Project Structure

```
ai-course-1/
├── backend/
│   ├── routers/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── resources.py     # Resource management
│   │   └── payments.py      # Stripe payment integration
│   ├── models.py            # Database models
│   ├── server.py            # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
├── frontend/
│   ├── public/              # Static HTML pages
│   ├── src/                 # React components
│   └── package.json         # Node dependencies
├── checkout.html            # Checkout page with Stripe
├── success.html             # Payment success page
├── pricing.html             # Pricing page
├── preview.html             # Landing page
├── dashboard.html           # User dashboard
└── README.md               # This file
```

## 🔑 Key Pages

- **`preview.html`**: Main landing page
- **`pricing.html`**: Pricing plans with monthly/yearly toggle
- **`checkout.html`**: Stripe checkout integration
- **`success.html`**: Post-payment success page
- **`dashboard.html`**: User dashboard after login
- **`frontend/public/course-builder.html`**: AI course builder
- **`frontend/public/site-builder.html`**: Website builder

## 💳 Payment Flow

1. User selects a plan on `pricing.html`
2. Redirects to `checkout.html` with plan details
3. User enters email and clicks "Start Free Trial"
4. Backend creates Stripe Checkout Session
5. User completes payment on Stripe-hosted page
6. Stripe redirects to `success.html?session_id={CHECKOUT_SESSION_ID}`
7. Webhook notifies backend of successful payment
8. User gains access to dashboard

## 🔒 Security Features

- JWT-based authentication
- Secure password hashing with bcrypt
- CORS protection
- Stripe webhook signature verification
- Environment variable protection
- SQL injection prevention with MongoDB

## 📊 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Payments

- `POST /api/payments/create-checkout-session` - Create one-time payment
- `POST /api/payments/create-subscription-checkout` - Create subscription
- `POST /api/payments/create-payment-intent` - Create payment intent
- `GET /api/payments/subscription-status/{id}` - Get subscription status
- `POST /api/payments/cancel-subscription/{id}` - Cancel subscription
- `POST /api/payments/webhook` - Stripe webhook handler
- `GET /api/payments/prices` - Get all pricing plans

## 🎨 Customization

### Branding

- Update logo in header (all HTML files)
- Modify color scheme in TailwindCSS classes
- Change gradient colors in CSS (`.gradient-text`, `.gradient-border`)

### Pricing

- Edit prices in `pricing.html` and `checkout.html`
- Update Stripe Product/Price IDs
- Modify plan features in pricing cards

## 🐛 Troubleshooting

### Stripe Integration Issues

- Verify API keys are correct in `.env` and `checkout.html`
- Check browser console for JavaScript errors
- Ensure backend is running and accessible
- Verify CORS settings allow frontend domain

### Payment Not Processing

- Check Stripe Dashboard for error logs
- Verify webhook endpoint is accessible
- Ensure Price IDs match Stripe products
- Test with Stripe test cards: `4242 4242 4242 4242`

## 📝 Environment Variables

### Backend (.env)

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=ai_course_db
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

## 🚦 Testing

### Test Cards (Stripe)

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0027 6000 3184

Use any future expiry date and any 3-digit CVC.

## 📞 Support

For issues or questions:

- Check the documentation
- Review Stripe API docs: <https://stripe.com/docs/api>
- Contact support (if applicable)

## 📄 License

This project is proprietary. All rights reserved.

## 🎯 Next Steps

1. ✅ Set up Stripe account and get API keys
2. ✅ Configure environment variables
3. ✅ Test payment flow with test cards
4. ✅ Create products in Stripe Dashboard
5. ✅ Set up webhooks for production
6. ✅ Deploy backend and frontend
7. ✅ Update checkout.html with production keys
8. ✅ Test end-to-end payment flow

---

**Built with ❤️ for education entrepreneurs**
