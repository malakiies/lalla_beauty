import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaCheckCircle, FaBox, FaCreditCard, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../components/StripePaymentForm.jsx';

const OrderScreen = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stripePromise, setStripePromise] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchConfigAndOrder = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // Obtenir la commande
        const { data: orderData } = await axios.get(`/api/orders/${id}`, config);
        setOrder(orderData);

        // Si Stripe est choisi, charger la clé publique
        if (orderData.paymentMethod === 'STRIPE' && !orderData.isPaid) {
          const { data: stripeConfig } = await axios.get('/api/payment/stripe/config');
          if (stripeConfig.publishableKey) {
            setStripePromise(loadStripe(stripeConfig.publishableKey));
          }
        }
      } catch (error) {
        toast.error('Erreur lors du chargement de la commande');
      } finally {
        setLoading(false);
      }
    };

    fetchConfigAndOrder();
  }, [id, user, navigate]);

  const handlePaymentSuccess = (updatedOrder) => {
    setOrder(updatedOrder);
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  if (!order) return <div className="text-center py-5">Commande introuvable</div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 font-serif text-dark">Commande #{order._id.substring(0, 8).toUpperCase()}</h2>
      
      <div className="row g-4">
        {/* Détails */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 mb-4 glass">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 border-bottom pb-2">Expédition</h5>
              <p className="mb-1"><strong>Nom:</strong> {order.user.name}</p>
              <p className="mb-1"><strong>Email:</strong> {order.user.email}</p>
              <p className="mb-3">
                <strong>Adresse:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <div className="alert alert-success d-flex align-items-center mb-0 py-2"><FaCheckCircle className="me-2"/> Livrée le {new Date(order.deliveredAt).toLocaleDateString()}</div>
              ) : (
                <div className="alert alert-warning d-flex align-items-center mb-0 py-2"><FaBox className="me-2"/> Non livrée</div>
              )}
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 mb-4 glass">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 border-bottom pb-2">Articles commandés</h5>
              <div className="list-group list-group-flush">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="list-group-item px-0 py-3 bg-transparent">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <img src={item.image} alt={item.name} className="rounded" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                        <span className="ms-3 fw-semibold">{item.name}</span>
                      </div>
                      <div className="text-end">
                        <span className="text-muted">{item.qty} x {item.price} = </span>
                        <span className="fw-bold">{item.qty * item.price} MAD</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Paiement & Résumé */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 mb-4 glass">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 border-bottom pb-2">Paiement</h5>
              <p className="mb-3">
                <strong>Méthode: </strong> 
                {order.paymentMethod === 'STRIPE' && 'Carte Bancaire (Stripe)'}
                {order.paymentMethod === 'COD' && 'Paiement à la livraison'}
              </p>
              
              {order.isPaid ? (
                <div className="alert alert-success d-flex align-items-center mb-0 py-2"><FaCheckCircle className="me-2"/> Payée le {new Date(order.paidAt).toLocaleDateString()}</div>
              ) : (
                <div className="alert alert-danger d-flex align-items-center mb-0 py-2">Non payée</div>
              )}
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 glass">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 border-bottom pb-2">Récapitulatif</h5>
              <div className="d-flex justify-content-between mb-2"><span className="text-muted">Articles:</span><span className="fw-semibold">{order.itemsPrice.toFixed(2)} MAD</span></div>
              <div className="d-flex justify-content-between mb-2"><span className="text-muted">Livraison:</span><span className="fw-semibold">{order.shippingPrice.toFixed(2)} MAD</span></div>
              <hr />
              <div className="d-flex justify-content-between mb-4"><span className="fw-bold fs-5">Total:</span><span className="fw-bold fs-5 text-primary">{order.totalPrice.toFixed(2)} MAD</span></div>
              
              {!order.isPaid && (
                <div className="mt-4">
                  {order.paymentMethod === 'COD' && (
                    <button className="btn btn-outline-secondary w-100 disabled d-flex align-items-center justify-content-center gap-2">
                      <FaBox /> En attente de livraison
                    </button>
                  )}
                  {order.paymentMethod === 'STRIPE' && stripePromise && (
                    <Elements stripe={stripePromise}>
                      <StripePaymentForm order={order} onSuccess={handlePaymentSuccess} />
                    </Elements>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
