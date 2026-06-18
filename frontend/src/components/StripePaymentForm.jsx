import { useState, useContext } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaLock } from 'react-icons/fa';

const StripePaymentForm = ({ order, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // 1. Obtenir le client secret
      const { data: { clientSecret } } = await axios.post(
        '/api/payment/stripe/create-intent',
        { amount: order.totalPrice },
        config
      );

      // 2. Confirmer le paiement avec Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.name,
            email: user.email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        toast.error(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // 3. Mettre à jour la commande sur notre backend
          const { data: updatedOrder } = await axios.put(
            `/api/orders/${order._id}/pay`,
            {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
              update_time: new Date().toISOString(),
              email_address: user.email,
              gateway: 'STRIPE'
            },
            config
          );
          
          toast.success('Paiement réussi ! 🎉');
          onSuccess(updatedOrder);
        }
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      setError(errMsg);
      toast.error(`Erreur : ${errMsg}`);
      setProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': { color: '#aab7c4' }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="p-3 border rounded-3 mb-3 bg-white shadow-sm">
        <CardElement options={cardStyle} />
      </div>
      
      {error && <div className="alert alert-danger p-2 text-sm mb-3">{error}</div>}
      
      <button 
        type="submit" 
        disabled={!stripe || processing} 
        className="btn btn-dark w-100 d-flex justify-content-center align-items-center gap-2 py-2 fw-bold"
      >
        <FaLock />
        {processing ? 'Traitement en cours...' : `Payer ${order.totalPrice.toFixed(2)} MAD`}
      </button>
    </form>
  );
};

export default StripePaymentForm;
