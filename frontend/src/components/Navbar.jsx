import { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../context/ThemeContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSearch, FaMoon, FaSun, FaHeart, FaBalanceScale, FaBell } from 'react-icons/fa';
import { WishlistContext } from '../context/WishlistContext';
import { CompareContext } from '../context/CompareContext';
import { NotificationContext } from '../context/NotificationContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { wishlist } = useContext(WishlistContext);
  const { compareItems } = useContext(CompareContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useContext(NotificationContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="bg-dark text-white text-center py-1" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
        LIVRAISON OFFERTE DÈS 300 MAD D'ACHAT ✨
      </div>
      <nav className="navbar navbar-expand-lg navbar-custom">
      <div className="container">
        <button 
          className="navbar-toggler border-0 shadow-none px-0" 
          type="button" 
          data-bs-toggle="offcanvas" 
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <Link className="navbar-brand mx-auto mx-lg-0 fw-bold" to="/">
          <img src={assets.logo} alt="Lalla Beauty Logo" style={{ height: '85px', objectFit: 'contain' }} />
        </Link>
        
        {/* Réservé pour aligner le titre au centre sur mobile */}
        <div className="d-lg-none" style={{ width: '24px' }}></div>
        
        <div className="offcanvas offcanvas-start offcanvas-custom" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          <div className="offcanvas-header border-bottom">
            <h5 className="offcanvas-title font-serif fw-bold" id="offcanvasNavbarLabel">Menu</h5>
            <button type="button" className="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          
          <div className="offcanvas-body">
            <ul className="navbar-nav mx-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">{t('navbar.home')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/catalog">{t('navbar.shop')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">{t('navbar.about')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">{t('navbar.contact')}</Link>
            </li>
            </ul>

            <ul className="navbar-nav ms-auto align-items-lg-center mt-4 mt-lg-0">
              <li className="nav-item ms-lg-2 mb-2 mb-lg-0">
                <select 
                  className="form-select form-select-sm border-0 bg-transparent"
                  style={{ cursor: 'pointer', outline: 'none', boxShadow: 'none', color: 'inherit' }}
                  value={i18n.language || 'fr'}
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                  <option value="fr">FR</option>
                  <option value="en">EN</option>
                  <option value="ar">AR</option>
                </select>
              </li>

              {/* Les icônes suivantes sont cachées sur mobile car elles sont dans la BottomNav */}
              <li className="nav-item ms-2 desktop-only-icon">
                <Link className="nav-link" to="/catalog">
                  <FaSearch size={18} />
                </Link>
              </li>
              
              <li className="nav-item ms-2 desktop-only-icon">
                <Link className="nav-link position-relative" to="/compare">
                <FaBalanceScale size={18} />
                {compareItems.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-accent" style={{ fontSize: '0.7rem' }}>
                    {compareItems.length}
                  </span>
                )}
              </Link>
              </li>
              
              <li className="nav-item ms-2 desktop-only-icon">
                <Link className="nav-link position-relative" to="/wishlist">
                  <FaHeart size={18} />
                  {wishlist.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-accent" style={{ fontSize: '0.7rem' }}>
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              </li>

              <li className="nav-item ms-2 desktop-only-icon">
                <Link className="nav-link position-relative" to="/cart">
                  <FaShoppingCart size={18} />
                  {cartItems.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-accent" style={{ fontSize: '0.7rem' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </span>
                  )}
                </Link>
              </li>

              {user && (
                <li className="nav-item ms-2 position-relative desktop-only-icon" ref={notifRef}>
                <a 
                  className="nav-link d-flex align-items-center" 
                  href="#!" 
                  role="button" 
                  onClick={(e) => { e.preventDefault(); setShowNotifMenu(!showNotifMenu); setShowUserMenu(false); }}
                  style={{ cursor: 'pointer' }}
                >
                  <FaBell size={18} />
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                      {unreadCount}
                    </span>
                  )}
                </a>
                
                {showNotifMenu && (
                  <div 
                    className="dropdown-menu-custom glass shadow-lg rounded-3 p-0" 
                    style={{ 
                      position: 'absolute', 
                      top: '100%', 
                      right: 0, 
                      display: 'block',
                      width: '300px',
                      maxHeight: '400px',
                      overflowY: 'auto',
                      zIndex: 9999,
                      marginTop: '0.5rem'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                      <h6 className="mb-0 fw-bold">{t('notifications.title')}</h6>
                      {unreadCount > 0 && (
                        <button className="btn btn-sm btn-link text-decoration-none p-0" onClick={markAllAsRead} style={{ fontSize: '0.8rem' }}>
                          {t('notifications.markAllRead')}
                        </button>
                      )}
                    </div>
                    
                    <div className="list-group list-group-flush">
                      {notifications.length === 0 ? (
                        <div className="text-center p-4 text-muted">
                          {t('notifications.noNotifications')}
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif._id} 
                            className={`list-group-item list-group-item-action p-3 ${!notif.isRead ? 'bg-light' : ''}`}
                            onClick={() => {
                              if (!notif.isRead) markAsRead(notif._id);
                              setShowNotifMenu(false);
                              if (notif.link) navigate(notif.link);
                            }}
                            style={{ cursor: 'pointer', borderLeft: !notif.isRead ? '3px solid var(--accent)' : '3px solid transparent' }}
                          >
                            <div className="d-flex w-100 justify-content-between mb-1">
                              <h6 className="mb-0 fw-semibold" style={{ fontSize: '0.9rem' }}>
                                {notif.type === 'ORDER_NEW' && '🛍️ '}
                                {notif.type === 'ORDER_SHIPPED' && '📦 '}
                                {notif.type === 'PROMO' && '🎉 '}
                                {notif.type === 'PRODUCT_NEW' && '✨ '}
                                {notif.title}
                              </h6>
                              <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                            <p className="mb-0 text-muted" style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
                </li>
              )}
              
              {user ? (
                <li className="nav-item ms-2 position-relative desktop-only-icon" ref={dropdownRef}>
                  <a 
                    className="nav-link d-flex align-items-center" 
                  href="#!" 
                  role="button" 
                  onClick={(e) => { e.preventDefault(); setShowUserMenu(!showUserMenu); setShowNotifMenu(false); }}
                  style={{ cursor: 'pointer' }}
                >
                  <FaUser size={18} className="me-1" />
                </a>
                
                {showUserMenu && (
                  <ul 
                    className="dropdown-menu-custom glass shadow-lg rounded-3" 
                    style={{ 
                      position: 'absolute', 
                      top: '100%', 
                      right: 0, 
                      display: 'block',
                      minWidth: '200px',
                      padding: '0.5rem 0',
                      listStyle: 'none',
                      zIndex: 9999,
                      marginTop: '0.5rem'
                    }}
                  >
                    <li className="px-3 py-2"><h6 className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>Bonjour, {user.firstName || 'Client'}</h6></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item px-3 py-2" to="/profile" onClick={() => setShowUserMenu(false)}>Mon Profil</Link></li>
                    <li><Link className="dropdown-item px-3 py-2" to="/wishlist" onClick={() => setShowUserMenu(false)}>❤️ Mes Favoris</Link></li>
                    <li><Link className="dropdown-item px-3 py-2" to="/profile" onClick={() => setShowUserMenu(false)}>Mes Commandes</Link></li>
                    {user.role === 'admin' && (
                      <>
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link className="dropdown-item px-3 py-2 text-gold fw-bold" to="/admin/dashboard" onClick={() => setShowUserMenu(false)}>Dashboard Admin</Link></li>
                      </>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item px-3 py-2 text-danger w-100 text-start" onClick={() => { setShowUserMenu(false); handleLogout(); }}>
                        <FaSignOutAlt className="me-2" />Déconnexion
                      </button>
                    </li>
                  </ul>
                )}
                </li>
              ) : (
                <li className="nav-item ms-2 desktop-only-icon">
                  <Link className="nav-link" to="/login" title="Espace Client">
                    <FaUser size={18} />
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;
