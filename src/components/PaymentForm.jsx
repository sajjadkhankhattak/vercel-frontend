import React, { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import '../styles/StripePayment.css';

const PaymentForm = ({ 
  clientSecret,
  amount, 
  onSuccess, 
  onError, 
  buttonText = "Pay Now"
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Submit the form to validate and collect payment data
      const { error: submitError } = await elements.submit();

      if (submitError) {
        setMessage(submitError.message);
        if (onError) onError(submitError.message);
        setIsLoading(false);
        return;
      }

      // Confirm payment with Stripe
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (stripeError) {
        setMessage(stripeError.message);
        if (onError) onError(stripeError.message);
      } else {
        setMessage('Payment succeeded!');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err);
      setMessage('An unexpected error occurred.');
      if (onError) onError('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs"
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="stripe-form">
      <div className="payment-header">
        <h3>Complete Your Payment</h3>
        <p className="amount">${amount.toFixed(2)} USD</p>
      </div>
      
      <PaymentElement 
        id="payment-element" 
        options={paymentElementOptions}
      />
      
      <button 
        disabled={isLoading || !stripe || !elements} 
        id="submit"
        className="stripe-button"
      >
        <span id="button-text">
          {isLoading ? (
            <div className="spinner">
              Processing
              <div className="loading-dots">
                <span className="dot1"></span>
                <span className="dot2"></span>
                <span className="dot3"></span>
              </div>
            </div>
          ) : (
            buttonText
          )}
        </span>
      </button>
      
      {message && (
        <div 
          id="payment-message" 
          className={`message ${message.includes('succeeded') ? 'success' : 'error'}`}
        >
          {message}
        </div>
      )}
    </form>
  );
};

export default PaymentForm;