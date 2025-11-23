import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../context/StripeContext';
import { useAuth } from '../context/AuthContext';
import PaymentForm from '../components/PaymentForm';
import StripeService from '../services/stripeService';
import '../styles/CheckoutPage.css';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get checkout data from navigation state or default values
  const checkoutData = location.state || {
    amount: 9.99,
    itemName: 'Premium Quiz Access',
    description: 'Access to premium quizzes and features'
  };

  useEffect(() => {
    // Check if user is authenticated before allowing payment
    if (!isAuthenticated()) {
      navigate('/login', { 
        state: { 
          returnTo: '/checkout',
          checkoutData: checkoutData,
          message: 'Please log in to make a purchase' 
        }
      });
      return;
    }

    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const response = await StripeService.createPaymentIntent(
          checkoutData.amount,
          {
            item_name: checkoutData.itemName,
            user_id: user?.id
          }
        );
        
        if (response.client_secret) {
          setClientSecret(response.client_secret);
        } else {
          throw new Error('No client secret received');
        }
      } catch (err) {
        console.error('Failed to create payment intent:', err);
        setError(err.message || 'Failed to initialize payment');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [checkoutData.amount, checkoutData.itemName, isAuthenticated, user]);

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    setTimeout(() => {
      navigate('/', { 
        state: { 
          message: 'Payment successful! You now have premium access.' 
        }
      });
    }, 2000);
  };

  const handlePaymentError = (error) => {
    setPaymentStatus('error');
    console.error('Payment error:', error);
  };

  if (isLoading) {
    return (
      <div className="checkout-container">
        <div className="loading-message">
          <h2>Preparing your checkout...</h2>
          <div className="loading-spinner">
            <div className="loading-dots">
              <span className="dot1"></span>
              <span className="dot2"></span>
              <span className="dot3"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-container">
        <div className="error-message">
          <h2>❌ Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="checkout-container">
        <div className="success-message">
          <h2>🎉 Payment Successful!</h2>
          <p>Thank you for your purchase. Redirecting...</p>
        </div>
      </div>
    );
  }

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-summary">
          <h2>Purchase Summary</h2>
          <div className="item-details">
            <h3>{checkoutData.itemName}</h3>
            <p>{checkoutData.description}</p>
            <div className="price">
              <span className="currency">$</span>
              <span className="amount">{checkoutData.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="payment-section">
          {clientSecret && (
            <Elements stripe={stripePromise} options={stripeOptions}>
              <PaymentForm
                clientSecret={clientSecret}
                amount={checkoutData.amount}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                buttonText={`Pay $${checkoutData.amount.toFixed(2)}`}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;