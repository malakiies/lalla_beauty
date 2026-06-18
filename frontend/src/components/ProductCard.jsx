import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { CompareContext } from '../context/CompareContext';
import { assets } from '../assets/assets.js';
import { FaBalanceScale } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToCompare, removeFromCompare, isInCompare } = useContext(CompareContext);
  const inWishlist = isInWishlist(product._id);
  const inCompare = isInCompare(product._id);

  return (
    <div className="card product-card h-100" style={{ position: 'relative' }}>
      {/* Animated Heart Button */}
      <button
        onClick={() => toggleWishlist(product)}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          background: 'rgba(255,255,255,0.9)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(4px)'
        }}
        title={inWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={inWishlist ? 'filled' : 'empty'}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
            style={{ fontSize: '18px', lineHeight: 1 }}
          >
            {inWishlist ? '❤️' : '🤍'}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Compare Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          inCompare ? removeFromCompare(product._id) : addToCompare(product);
        }}
        style={{
          position: 'absolute',
          top: '56px',
          right: '12px',
          zIndex: 10,
          background: inCompare ? 'var(--accent)' : 'rgba(255,255,255,0.9)',
          color: inCompare ? '#fff' : 'var(--text-dark)',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(4px)',
          transition: 'all 0.3s'
        }}
        title={inCompare ? 'Retirer du comparateur' : 'Comparer'}
      >
        <FaBalanceScale size={16} />
      </button>

      <div className="product-img-wrapper">
        <Link to={`/product/${product._id}`}>
          <img src={assets[product.image] || product.image || '/images/placeholder.jpg'} className="product-img" alt={product.name} />
        </Link>
      </div>
      <div className="product-body d-flex flex-column">
        <div className="mb-2 text-muted small">{product.category?.name || 'Cosmétique'}</div>
        <Link to={`/product/${product._id}`} className="product-title mb-2">
          {product.name}
        </Link>
        <div className="mt-auto pt-3 border-top position-relative">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="product-price fs-5">{product.price} MAD</span>
          </div>
          <div className="add-to-cart-wrapper">
            <button 
              className="btn btn-primary-custom w-100" 
              onClick={() => {
                addToCart(product, 1);
                import('react-hot-toast').then(module => {
                  module.default.success(`1x ${product.name} ajouté au panier`, { icon: '✨' });
                });
              }}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
