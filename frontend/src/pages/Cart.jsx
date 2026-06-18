import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaTrash } from 'react-icons/fa';
import { assets } from '../assets/assets.js';
import { useTranslation } from 'react-i18next';

const Cart = () => {
  const { cartItems, updateCartItemQty, removeFromCart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const checkoutHandler = () => {
    navigate('/login?redirect=/checkout');
  };

  return (
    <div className="container py-5 min-vh-75">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0" style={{ color: 'var(--text-dark)' }}>{t('cart.title')}</h2>
        {cartItems.length > 0 && (
          <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
            {t('cart.emptyCart')}
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="alert alert-info glass text-center py-5 rounded-0 border-0 shadow-sm">
          {t('cart.isEmpty')} <Link to="/catalog" className="fw-bold ms-2 text-gold">{t('cart.returnToShop')}</Link>
        </div>
      ) : (
        <div className="row g-5">
          <div className="col-md-8">
            <div className="card border-0 shadow-sm rounded-0 overflow-hidden">
              <div className="card-body p-0">
                <ul className="list-group list-group-flush">
                  {cartItems.map(item => (
                    <li key={item.product} className="list-group-item p-4 border-bottom-0 bg-white" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <div className="row align-items-center">
                        <div className="col-md-2 mb-3 mb-md-0">
                          <img src={assets[item.image] || item.image || '/images/placeholder.jpg'} alt={item.name} className="img-fluid rounded-0" />
                        </div>
                        <div className="col-md-3 mb-3 mb-md-0">
                          <Link to={`/product/${item.product}`} className="text-decoration-none fw-semibold text-dark">
                            {item.name}
                          </Link>
                        </div>
                        <div className="col-md-2 text-gold fw-bold mb-3 mb-md-0">
                          {item.price} MAD
                        </div>
                        <div className="col-md-3 mb-3 mb-md-0">
                          <select 
                            className="form-select form-control-custom w-100 rounded-0"
                            value={item.qty}
                            onChange={(e) => updateCartItemQty(item.product, Number(e.target.value))}
                          >
                            {[...Array(10).keys()].map(x => (
                              <option key={x + 1} value={x + 1}>{x + 1}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-2 text-end">
                          <button className="btn btn-outline-danger rounded-0" onClick={() => removeFromCart(item.product)}>
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-0 p-4 bg-white">
              <div className="card-body p-0">
                <h4 className="fw-bold border-bottom pb-3 mb-4 font-serif">{t('cart.summary')}</h4>
                
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">{t('cart.totalItems')}</span>
                  <span className="fw-semibold">{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-4">
                  <span className="text-muted">{t('cart.subtotal')}</span>
                  <span className="fw-bold fs-5 text-gold">{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)} MAD</span>
                </div>
                
                <button 
                  type="button" 
                  className="btn btn-primary-custom w-100 mt-2" 
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  {t('cart.checkout')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
