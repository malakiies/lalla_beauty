import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import { assets } from '../assets/assets.js';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { user } = useContext(AuthContext);
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setName(user.name);
      setEmail(user.email);
      
      // Fetch user's orders
      const fetchOrders = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${user.token}` }
          };
          const { data } = await axios.get('/api/orders/myorders', config);
          setOrders(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchOrders();
    }
  }, [navigate, user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage(t('profile.pwdMismatch'));
    } else {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.put('/api/auth/profile', { id: user._id, name, email, password }, config);
        
        // Update local storage
        localStorage.setItem('userInfo', JSON.stringify(data));
        setSuccess(true);
        setMessage(null);
      } catch (error) {
        setMessage(error.response && error.response.data.message ? error.response.data.message : error.message);
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-4 mb-4 mb-md-0">
          <div className="card border-0 shadow-sm rounded-4 glass p-4">
            <h3 className="fw-bold mb-4" style={{ color: 'var(--text-dark)' }}>{t('profile.title')}</h3>
            
            {message && <div className="alert alert-danger">{message}</div>}
            {success && <div className="alert alert-success">{t('profile.updated')}</div>}
            
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">{t('profile.name')}</label>
                <input type="text" className="form-control form-control-custom" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">{t('profile.email')}</label>
                <input type="email" className="form-control form-control-custom" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label text-muted fw-semibold">{t('profile.newPwd')}</label>
                <input type="password" className="form-control form-control-custom" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="form-label text-muted fw-semibold">{t('profile.confirmPwd')}</label>
                <input type="password" className="form-control form-control-custom" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary-custom w-100">{t('profile.updateBtn')}</button>
            </form>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card border-0 shadow-sm rounded-4 glass p-4 h-100">
            <h3 className="fw-bold mb-4" style={{ color: 'var(--text-dark)' }}>{t('profile.orders')}</h3>
            
            {orders.length === 0 ? (
              <div className="alert alert-info border-0 text-center py-4 rounded-3">{t('profile.noOrders')}</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>{t('profile.date')}</th>
                      <th>{t('profile.total')}</th>
                      <th>{t('profile.status')}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td>{order._id.substring(0, 8)}...</td>
                        <td>{order.createdAt.substring(0, 10)}</td>
                        <td className="fw-bold text-primary">{order.totalPrice || order.totalAmount || 0} MAD</td>
                        <td>
                          {order.isDelivered ? (
                            <span className="badge bg-success rounded-pill px-3 py-2">{t('profile.delivered')} {order.deliveredAt.substring(0, 10)}</span>
                          ) : (
                            <span className="badge bg-warning text-dark rounded-pill px-3 py-2">{t('profile.pending')}</span>
                          )}
                        </td>
                        <td>
                          <button 
                            className="btn btn-outline-custom btn-sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            {t('profile.details')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Wishlist Section */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4 glass p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>{t('profile.favs')}</h3>
              <Link to="/wishlist" className="btn btn-outline-custom btn-sm">{t('profile.seeAll')}</Link>
            </div>

            {wishlist.length === 0 ? (
              <div className="text-center py-4">
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤍</div>
                <p className="text-muted mb-3">{t('profile.noFavs')}</p>
                <Link to="/catalog" className="btn btn-primary-custom btn-sm">{t('profile.exploreShop')}</Link>
              </div>
            ) : (
              <div className="row g-3">
                {wishlist.slice(0, 4).map(product => (
                  <div key={product._id} className="col-6 col-md-3">
                    <div className="card border-0 shadow-sm h-100" style={{ position: 'relative', borderRadius: 0 }}>
                      <button
                        onClick={() => toggleWishlist(product)}
                        style={{
                          position: 'absolute', top: '8px', right: '8px', zIndex: 10,
                          background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                          width: '30px', height: '30px', cursor: 'pointer', fontSize: '14px'
                        }}
                      >❤️</button>
                      <Link to={`/product/${product._id}`}>
                        <img
                          src={assets[product.image] || product.image || '/images/placeholder.jpg'}
                          alt={product.name}
                          style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                        />
                      </Link>
                      <div className="p-2">
                        <p className="mb-1 small fw-semibold" style={{ color: 'var(--text-dark)' }}>{product.name}</p>
                        <p className="mb-0 small" style={{ color: 'var(--accent)' }}>{product.price} MAD</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div 
          style={{
            position: 'fixed', inset: 0, zIndex: 1060, display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)'
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="card border-0 shadow-lg rounded-4 overflow-hidden" 
            style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header bg-white border-bottom p-4 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{ fontFamily: 'var(--font-serif)' }}>{t('profile.orderDetails')}</h5>
              <button className="btn-close" onClick={() => setSelectedOrder(null)}></button>
            </div>
            <div className="card-body p-4">
              <div className="mb-4">
                <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>{t('profile.info')}</h6>
                <p className="mb-1"><strong>ID:</strong> {selectedOrder._id}</p>
                <p className="mb-1"><strong>Date:</strong> {selectedOrder.createdAt.substring(0, 10)}</p>
                <p className="mb-0"><strong>Statut:</strong> {selectedOrder.isDelivered ? <span className="text-success fw-bold">{t('profile.delivered')}</span> : <span className="text-warning fw-bold">{t('profile.pending')}</span>}</p>
              </div>

              <div className="mb-4">
                <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>{t('profile.shippingAddr')}</h6>
                <p className="mb-0">
                  {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}
                  <br />
                  {selectedOrder.shippingAddress?.postalCode}, {selectedOrder.shippingAddress?.country}
                </p>
              </div>

              <div>
                <h6 className="text-muted text-uppercase mb-3" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>{t('profile.items')} ({(selectedOrder.orderItems || selectedOrder.items || []).length})</h6>
                {(selectedOrder.orderItems || selectedOrder.items || []).map((item, index) => (
                  <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                    <img src={assets[item.image] || item.image || '/images/placeholder.jpg'} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} className="me-3 shadow-sm" />
                    <div className="flex-grow-1">
                      <Link to={`/product/${item.product}`} className="text-decoration-none text-dark fw-semibold" onClick={() => setSelectedOrder(null)}>
                        {item.name}
                      </Link>
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        <span className="text-muted small">{t('profile.qty')}: {item.qty}</span>
                        <span className="fw-bold" style={{ color: 'var(--accent)' }}>{item.price} MAD</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <h5 className="mb-0 fw-bold text-dark">Total:</h5>
                <h4 className="mb-0 fw-bold" style={{ color: 'var(--accent)' }}>{selectedOrder.totalPrice || selectedOrder.totalAmount || 0} MAD</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
