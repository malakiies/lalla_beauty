import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { country: 'Maroc' }
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  
  const { cartItems, clearCart, appliedCoupon, applyCoupon, removeCoupon } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    }
  }, [user, navigate]);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discountAmount = (itemsPrice * appliedCoupon.discountValue) / 100;
    } else if (appliedCoupon.discountType === 'FIXED') {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const itemsPriceAfterDiscount = Math.max(0, itemsPrice - discountAmount);
  const shippingPrice = itemsPriceAfterDiscount > 500 ? 0 : 50;
  const totalPrice = itemsPriceAfterDiscount + shippingPrice;

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/coupons/validate', { code: promoCode }, config);
      applyCoupon(data);
      toast.success('Code promo appliqué ! ✨');
      setPromoCode('');
    } catch (error) {
      setPromoError(error.response?.data?.message || 'Code invalide');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    removeCoupon();
    toast.success('Code promo retiré');
  };

  const placeOrderHandler = async (data) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data: orderData } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress: { address: data.address, city: data.city, postalCode: data.postalCode, country: data.country },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
        },
        config
      );

      clearCart();
      toast.success('Commande créée avec succès ! ✨', { duration: 4000 });
      navigate(`/order/${orderData._id}`); // Redirect to order details to pay
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la commande. Veuillez réessayer.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 p-5" style={{ borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
            <h2 className="text-center mb-5" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-dark)' }}>Passer la commande</h2>
            
            <form id="checkout-form" onSubmit={handleSubmit(placeOrderHandler)}>
              <h4 className="fw-bold mb-4">Adresse de livraison</h4>
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">Adresse postale</label>
                <input type="text" className={`form-control form-control-custom ${errors.address ? 'is-invalid' : ''}`} {...register('address', { required: true })} />
              </div>
              <div className="row mb-4">
                <div className="col-md-4 mb-3 mb-md-0">
                  <label className="form-label text-muted fw-semibold">Ville</label>
                  <input type="text" className={`form-control form-control-custom ${errors.city ? 'is-invalid' : ''}`} {...register('city', { required: true })} />
                </div>
                <div className="col-md-4 mb-3 mb-md-0">
                  <label className="form-label text-muted fw-semibold">Code postal</label>
                  <input type="text" className={`form-control form-control-custom ${errors.postalCode ? 'is-invalid' : ''}`} {...register('postalCode', { required: true })} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted fw-semibold">Pays</label>
                  <input type="text" className={`form-control form-control-custom ${errors.country ? 'is-invalid' : ''}`} {...register('country', { required: true })} />
                </div>
              </div>

              <h4 className="fw-medium mb-4 mt-5" style={{ fontFamily: 'var(--font-serif)' }}>Méthode de paiement</h4>
              <div className="mb-5 d-flex flex-column gap-3">
                <div className="p-3 border w-100" style={{ cursor: 'pointer', borderRadius: '4px', backgroundColor: paymentMethod === 'COD' ? 'var(--secondary)' : 'transparent', borderColor: paymentMethod === 'COD' ? 'var(--accent)' : 'rgba(0,0,0,0.1)' }} onClick={() => setPaymentMethod('COD')}>
                  <div className="form-check m-0 d-flex align-items-center">
                    <input className="form-check-input me-3" type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} readOnly style={{ cursor: 'pointer' }} />
                    <label className="form-check-label fw-medium" style={{ cursor: 'pointer' }}>
                      Paiement à la livraison (Cash on Delivery)
                    </label>
                  </div>
                </div>

                <div className="p-3 border w-100" style={{ cursor: 'pointer', borderRadius: '4px', backgroundColor: paymentMethod === 'STRIPE' ? 'var(--secondary)' : 'transparent', borderColor: paymentMethod === 'STRIPE' ? 'var(--accent)' : 'rgba(0,0,0,0.1)' }} onClick={() => setPaymentMethod('STRIPE')}>
                  <div className="form-check m-0 d-flex align-items-center">
                    <input className="form-check-input me-3" type="radio" name="paymentMethod" value="STRIPE" checked={paymentMethod === 'STRIPE'} readOnly style={{ cursor: 'pointer' }} />
                    <label className="form-check-label fw-medium d-flex align-items-center gap-2" style={{ cursor: 'pointer', width: '100%' }}>
                      Carte Bancaire Internationale
                      <span className="badge ms-auto" style={{ backgroundColor: 'var(--text-dark)', color: 'var(--white)', fontWeight: 400 }}>Sécurisé par Stripe</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-light p-4 rounded-4 mb-4">
                <h5 className="fw-bold mb-3 border-bottom pb-2">Récapitulatif</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Articles:</span>
                  <span className="fw-semibold">{itemsPrice.toFixed(2)} MAD</span>
                </div>
                
                {appliedCoupon && (
                  <div className="d-flex justify-content-between mb-2 align-items-center">
                    <span className="text-success d-flex align-items-center">
                      Réduction ({appliedCoupon.code})
                      <button type="button" className="btn btn-sm btn-link text-danger p-0 ms-2" onClick={handleRemovePromo} style={{fontSize: '0.8rem'}}>Retirer</button>
                    </span>
                    <span className="fw-semibold text-success">-{discountAmount.toFixed(2)} MAD</span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Livraison:</span>
                  <span className="fw-semibold">{shippingPrice.toFixed(2)} MAD</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mt-3">
                  <span className="fw-bold fs-5">Total à payer:</span>
                  <span className="fw-bold fs-5 text-primary">{totalPrice.toFixed(2)} MAD</span>
                </div>
              </div>

              {!appliedCoupon && (
                <div className="bg-light p-4 rounded-4 mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">Code promo</h5>
                  <div className="input-group mb-2">
                    <input 
                      type="text" 
                      className="form-control form-control-custom" 
                      placeholder="Saisissez votre code" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button 
                      className="btn btn-dark" 
                      type="button" 
                      onClick={handleApplyPromo}
                      disabled={promoLoading || !promoCode}
                    >
                      {promoLoading ? '...' : 'Appliquer'}
                    </button>
                  </div>
                  {promoError && <small className="text-danger">{promoError}</small>}
                </div>
              )}

              <button 
                type="submit" 
                form="checkout-form"
                className="btn btn-primary-custom btn-lg w-100"
                disabled={cartItems.length === 0}
              >
                Confirmer la commande
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
