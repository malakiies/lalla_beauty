import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaShoppingCart, FaUser, FaHeart } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

const BottomNav = () => {
  const { cartItems } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const totalCartItems = cartItems.reduce((a, c) => a + c.qty, 0);

  return (
    <div className="bottom-nav d-lg-none glass-bottom-nav">
      <Link to="/" className={`bottom-nav-item ${isActive('/')}`}>
        <FaHome className="bottom-nav-icon" />
        <span>Accueil</span>
      </Link>
      
      <Link to="/catalog" className={`bottom-nav-item ${isActive('/catalog')}`}>
        <FaSearch className="bottom-nav-icon" />
        <span>Boutique</span>
      </Link>
      
      <Link to="/wishlist" className={`bottom-nav-item ${isActive('/wishlist')} position-relative`}>
        <FaHeart className="bottom-nav-icon" />
        <span>Favoris</span>
        {wishlist.length > 0 && (
          <span className="position-absolute top-0 start-50 translate-middle-x badge rounded-pill badge-accent" style={{ fontSize: '0.6rem', marginTop: '-5px', marginLeft: '10px' }}>
            {wishlist.length}
          </span>
        )}
      </Link>
      
      <Link to="/cart" className={`bottom-nav-item ${isActive('/cart')} position-relative`}>
        <FaShoppingCart className="bottom-nav-icon" />
        <span>Panier</span>
        {totalCartItems > 0 && (
          <span className="position-absolute top-0 start-50 translate-middle-x badge rounded-pill badge-accent" style={{ fontSize: '0.6rem', marginTop: '-5px', marginLeft: '10px' }}>
            {totalCartItems}
          </span>
        )}
      </Link>
      
      <Link to="/profile" className={`bottom-nav-item ${isActive('/profile')}`}>
        <FaUser className="bottom-nav-icon" />
        <span>Profil</span>
      </Link>
    </div>
  );
};

export default BottomNav;
