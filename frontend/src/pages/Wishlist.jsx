import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { assets } from '../assets/assets.js';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  return (
    <div className="container py-5" style={{ minHeight: '70vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-5">
          <p className="text-uppercase mb-2" style={{ letterSpacing: '4px', color: 'var(--accent)', fontSize: '0.85rem' }}>Ma Collection</p>
          <h1 className="fw-bold display-5" style={{ color: 'var(--text-dark)' }}>
            ❤️ Mes Favoris
          </h1>
          <p className="text-muted">{wishlist.length} produit{wishlist.length !== 1 ? 's' : ''} dans votre liste de favoris</p>
        </div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-5"
          >
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🤍</div>
            <h4 className="fw-bold mb-3" style={{ color: 'var(--text-dark)' }}>Votre liste de favoris est vide</h4>
            <p className="text-muted mb-4">Explorez notre boutique et ajoutez vos produits préférés à votre liste.</p>
            <Link to="/catalog" className="btn btn-primary-custom">Découvrir la boutique</Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="row g-4">
              {wishlist.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="col-sm-6 col-md-4 col-lg-3"
                >
                  <div className="card product-card h-100" style={{ position: 'relative' }}>
                    {/* Remove heart button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      style={{
                        position: 'absolute', top: '12px', right: '12px', zIndex: 10,
                        background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                        width: '36px', height: '36px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      <motion.span
                        whileTap={{ scale: 1.4 }}
                        style={{ fontSize: '18px' }}
                      >
                        ❤️
                      </motion.span>
                    </button>

                    <div className="product-img-wrapper">
                      <Link to={`/product/${product._id}`}>
                        <img
                          src={assets[product.image] || product.image || '/images/placeholder.jpg'}
                          className="product-img"
                          alt={product.name}
                        />
                      </Link>
                    </div>
                    <div className="product-body d-flex flex-column">
                      <div className="mb-2 text-muted small">{product.category?.name || 'Cosmétique'}</div>
                      <Link to={`/product/${product._id}`} className="product-title mb-2">
                        {product.name}
                      </Link>
                      <div className="mt-auto pt-3 border-top">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="product-price fs-5">{product.price} MAD</span>
                        </div>
                        <button
                          className="btn btn-primary-custom w-100"
                          onClick={() => {
                            addToCart(product, 1);
                            toast.success(`${product.name} ajouté au panier`, { icon: '✨' });
                          }}
                        >
                          Ajouter au panier
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

export default Wishlist;
