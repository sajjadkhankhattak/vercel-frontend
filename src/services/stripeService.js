const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

class StripeService {
  static async createPaymentIntent(amount, metadata = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          amount,
          metadata
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  static async confirmPayment(paymentIntentId, userId, quizId, planType) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stripe/confirm-payment`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          payment_intent_id: paymentIntentId,
          user_id: userId,
          quiz_id: quizId,
          plan_type: planType
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  static async createSubscription(customerEmail, priceId, metadata = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stripe/create-subscription`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          customer_email: customerEmail,
          price_id: priceId,
          metadata
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  static async getPaymentMethods(customerId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stripe/payment-methods/${customerId}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }
}

export default StripeService;