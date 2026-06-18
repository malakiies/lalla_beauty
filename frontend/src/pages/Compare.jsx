import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CompareContext } from '../context/CompareContext';
import { CartContext } from '../context/CartContext';
import { assets } from '../assets/assets.js';
import toast from 'react-hot-toast';

const Compare = () => {
  const { compareItems, removeFromCompare, clearCompare } = useContext(CompareContext);
  const { addToCart } = useContext(CartContext);

  if (compareItems.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⚖️</div>
          <h2 className="fw-bold mb-3" style={{ color: 'var(--text-dark)' }}>Le comparateur est vide</h2>
          <p className="text-muted mb-4">Ajoutez jusqu'à 3 produits pour les comparer côte à côte.</p>
          <Link to="/catalog" className="btn btn-primary-custom">Découvrir les produits</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ minHeight: '75vh' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
          <div>
            <p className="section-label mb-2">Analyse Détaillée</p>
            <h2 className="fw-bold mb-0" style={{ color: 'var(--text-dark)', fontFamily: 'var(--font-serif)' }}>
              Comparateur de Produits
            </h2>
          </div>
          <button onClick={clearCompare} className="btn btn-outline-danger btn-sm px-4">
            Tout effacer
          </button>
        </div>

        <div className="table-responsive bg-white rounded-4 shadow-sm border" style={{ borderColor: 'rgba(193,154,107,0.1)' }}>
          <table className="table table-bordered mb-0 align-middle" style={{ minWidth: '800px', tableLayout: 'fixed' }}>
            <thead className="bg-light">
              <tr>
                <th style={{ width: '18%' }} className="p-4 border-end-0 border-bottom-0 text-muted align-bottom">
                  Critères
                </th>
                <AnimatePresence>
                  {compareItems.map(product => (
                    <motion.th 
                      key={product._id} 
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      style={{ width: '27.33%' }} 
                      className="text-center p-4 border-end-0 border-bottom-0 position-relative"
                    >
                      <button 
                        onClick={() => removeFromCompare(product._id)}
                        className="btn btn-sm btn-light position-absolute top-0 end-0 m-2 rounded-circle"
                        style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                        title="Retirer"
                      >
                        ✕
                      </button>
                      <div className="mb-3 d-flex justify-content-center">
                        <img 
                          src={assets[product.image] || product.image || '/images/placeholder.jpg'} 
                          alt={product.name} 
                          style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                        />
                      </div>
                      <Link to={`/product/${product._id}`} className="text-decoration-none text-dark d-block mb-2">
                        <h5 className="fw-bold font-serif" style={{ fontSize: '1.1rem' }}>{product.name}</h5>
                      </Link>
                      <button 
                        className="btn btn-primary-custom btn-sm w-100"
                        onClick={() => {
                          addToCart(product, 1);
                          toast.success(`${product.name} ajouté au panier`, { icon: '✨' });
                        }}
                      >
                        Ajouter au panier
                      </button>
                    </motion.th>
                  ))}
                </AnimatePresence>
                {/* Empty columns filler if < 3 items */}
                {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                  <th key={`empty-${i}`} style={{ width: '27.33%' }} className="p-4 border-end-0 border-bottom-0 text-center bg-light align-middle">
                    <div className="text-muted" style={{ border: '2px dashed #ddd', padding: '2rem 1rem', borderRadius: 8 }}>
                      <p className="mb-2" style={{ fontSize: '1.5rem' }}>+</p>
                      <span className="small">Ajouter un produit</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Prix */}
              <tr>
                <td className="fw-semibold text-muted bg-light p-3">Prix</td>
                {compareItems.map(p => (
                  <td key={`price-${p._id}`} className="text-center p-3 fs-5" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                    {p.price} MAD
                  </td>
                ))}
                {Array.from({ length: 3 - compareItems.length }).map((_, i) => <td key={`ep-${i}`} className="bg-light"></td>)}
              </tr>
              
              {/* Catégorie */}
              <tr>
                <td className="fw-semibold text-muted bg-light p-3">Catégorie</td>
                {compareItems.map(p => (
                  <td key={`cat-${p._id}`} className="text-center p-3">
                    <span className="badge bg-light text-dark border px-3 py-2 rounded-pill">
                      {p.category?.name || p.catName || 'Soins'}
                    </span>
                  </td>
                ))}
                {Array.from({ length: 3 - compareItems.length }).map((_, i) => <td key={`ec-${i}`} className="bg-light"></td>)}
              </tr>

              {/* Note Moyenne */}
              <tr>
                <td className="fw-semibold text-muted bg-light p-3">Note Moyenne</td>
                {compareItems.map(p => (
                  <td key={`rating-${p._id}`} className="text-center p-3">
                    <div style={{ color: '#F4B942', fontSize: '1.2rem', marginBottom: 4 }}>
                      {'★'.repeat(Math.round(p.rating || 0))}{'☆'.repeat(5 - Math.round(p.rating || 0))}
                    </div>
                    <div className="small text-muted">{p.rating || 0}/5 ({p.numReviews || 0} avis)</div>
                  </td>
                ))}
                {Array.from({ length: 3 - compareItems.length }).map((_, i) => <td key={`er-${i}`} className="bg-light"></td>)}
              </tr>

              {/* Ingrédients */}
              <tr>
                <td className="fw-semibold text-muted bg-light p-3 align-middle">Ingrédients Clés</td>
                {compareItems.map(p => (
                  <td key={`ing-${p._id}`} className="p-4" style={{ fontSize: '0.9rem' }}>
                    {p.ingredients && p.ingredients.length > 0 ? (
                      <ul className="mb-0 ps-3" style={{ color: 'var(--text-light)', lineHeight: 1.8 }}>
                        {p.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
                      </ul>
                    ) : (
                      <span className="text-muted fst-italic">Non spécifié</span>
                    )}
                  </td>
                ))}
                {Array.from({ length: 3 - compareItems.length }).map((_, i) => <td key={`ei-${i}`} className="bg-light"></td>)}
              </tr>

              {/* Bienfaits */}
              <tr>
                <td className="fw-semibold text-muted bg-light p-3 align-middle">Bienfaits</td>
                {compareItems.map(p => (
                  <td key={`ben-${p._id}`} className="p-4" style={{ fontSize: '0.9rem' }}>
                    {p.benefits && p.benefits.length > 0 ? (
                      <ul className="mb-0 ps-3" style={{ color: 'var(--text-dark)', lineHeight: 1.8 }}>
                        {p.benefits.map((ben, idx) => (
                          <li key={idx} className="mb-1">
                            <span style={{ color: 'var(--accent)', marginRight: 6 }}>✓</span>
                            {ben}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted fst-italic">Non spécifié</span>
                    )}
                  </td>
                ))}
                {Array.from({ length: 3 - compareItems.length }).map((_, i) => <td key={`eb-${i}`} className="bg-light"></td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Compare;
