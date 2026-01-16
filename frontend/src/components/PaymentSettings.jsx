import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

// Replace with your actual publishable key
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.log('[error]', error);
            alert(error.message);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            alert("Payment Method Created! (In a real app, this would charge the user)");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border rounded-md">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }} />
            </div>
            <Button type="submit" disabled={!stripe} className="w-full">
                Subscribe - $29/mo
            </Button>
        </form>
    );
};

const PaymentSettings = () => {
    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Pro Plan Upgrade</CardTitle>
                    <CardDescription>Unlock unlimited AI course generation and analytics.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Elements stripe={stripePromise}>
                        <CheckoutForm />
                    </Elements>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentSettings;
