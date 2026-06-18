import { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { CompareContext } from '../context/CompareContext';
import { RecentlyViewedContext } from '../context/RecentlyViewedContext';
import ProductReviews from '../components/ProductReviews.jsx';
import ProductCarousel from '../components/ProductCarousel.jsx';
import { assets } from '../assets/assets.js';
import toast from 'react-hot-toast';
import { FaBalanceScale, FaLeaf, FaStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const ProductDetail = () => {
  const [product, setProduct] = useState({});
  const [recommendations, setRecommendations] = useState({ similar: [], popular: [], complementary: [] });
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { addToCompare, removeFromCompare, isInCompare } = useContext(CompareContext);
  const { recentlyViewed, addRecentlyViewed } = useContext(RecentlyViewedContext);
  const { t } = useTranslation();

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      addRecentlyViewed(data);

      const { data: recData } = await axios.get(`/api/products/${id}/recommendations`);
      setRecommendations(recData);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    addToCart(product, qty);
    toast.success(`${qty}x ${product.name} ajouté au panier`, {
      icon: '✨',
    });
    navigate('/cart');
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link className="btn btn-outline-custom" to="/catalog">
          Retour au catalogue
        </Link>
        {product && (
          <button
            className={`btn ${isInCompare(product._id) ? 'btn-accent' : 'btn-outline-custom'}`}
            onClick={() => isInCompare(product._id) ? removeFromCompare(product._id) : addToCompare(product)}
            style={isInCompare(product._id) ? { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' } : {}}
          >
            <FaBalanceScale className="me-2" />
            {isInCompare(product._id) ? 'Retirer du comparateur' : 'Comparer'}
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center">
           <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="rounded-4 overflow-hidden shadow-sm" style={{ aspectRatio: '1', background: '#fff' }}>
              <img src={assets[product.image] || product.image || '/images/placeholder.jpg'} alt={product.name} className="img-fluid w-100 h-100" style={{ objectFit: 'cover' }} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="glass p-4 rounded-4 h-100 d-flex flex-column">
              <div className="mb-2 text-muted text-uppercase small tracking-wide">{product.category?.name || product.catName || 'Cosmétique'}</div>
              <h2 className="fw-bold mb-2" style={{ color: 'var(--text-dark)' }}>{product.name}</h2>
              <div className="mb-3 d-flex align-items-center gap-2">
                <div style={{ color: '#F4B942', fontSize: '1.1rem' }}>
                  {'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}
                </div>
                <span className="small text-muted">({product.numReviews || 0} avis)</span>
              </div>
              <h3 className="text-gold fw-bold mb-4">{product.price} MAD</h3>
              
              <div className="mb-4">
                <h5 className="fw-semibold font-serif">Description</h5>
                <p className="text-muted" style={{ lineHeight: '1.8' }}>{product.description}</p>
              </div>

              {product.benefits && product.benefits.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-semibold font-serif d-flex align-items-center gap-2"><FaStar color="var(--accent)" /> Bienfaits</h6>
                  <ul className="text-muted ps-4 mb-0" style={{ lineHeight: '1.8' }}>
                    {product.benefits.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              )}

              {product.ingredients && product.ingredients.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-semibold font-serif d-flex align-items-center gap-2"><FaLeaf color="#4CAF50" /> Ingrédients clés</h6>
                  <ul className="text-muted ps-4 mb-0" style={{ lineHeight: '1.8' }}>
                    {product.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                  </ul>
                </div>
              )}

              <div className="mt-auto">
                {product.stock > 0 ? (
                  <div className="row align-items-center bg-white border rounded-0 p-3 mb-3 shadow-sm">
                    <div className="col-6 fw-semibold text-muted">Statut:</div>
                    <div className="col-6 text-end text-success fw-bold">En stock</div>
                  </div>
                ) : (
                  <div className="row align-items-center bg-white border rounded-0 p-3 mb-3 shadow-sm">
                    <div className="col-6 fw-semibold text-muted">Statut:</div>
                    <div className="col-6 text-end text-danger fw-bold">Rupture de stock</div>
                  </div>
                )}

                {product.stock > 0 && (
                  <div className="row align-items-center bg-white border rounded-0 p-3 mb-4 shadow-sm">
                    <div className="col-6 fw-semibold text-muted">Quantité:</div>
                    <div className="col-6 text-end">
                      <select 
                        className="form-select w-100 form-control-custom border-0 bg-light"
                        value={qty} 
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(Math.min(product.stock, 10)).keys()].map(x => (
                          <option key={x + 1} value={x + 1}>{x + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <button 
                  className="btn btn-primary-custom w-100 btn-lg rounded-0" 
                  disabled={product.stock === 0}
                  onClick={addToCartHandler}
                >
                  Ajouter au Panier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && product && (
        <ProductReviews product={product} onReviewChange={fetchProduct} />
      )}

      {/* Recommandations */}
      {!loading && (
        <div className="mt-5 pt-5 border-top border-light">
          <ProductCarousel title={t('recommendations.similar')} products={recommendations.similar} />
          <ProductCarousel title={t('recommendations.popular')} products={recommendations.popular} />
          <ProductCarousel title={t('recommendations.complementary')} products={recommendations.complementary} />
          <ProductCarousel title={t('recommendations.recentlyViewed')} products={recentlyViewed.filter(p => p._id !== product._id)} />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
