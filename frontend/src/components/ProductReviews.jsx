import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaUserCircle, FaTrash, FaEdit } from 'react-icons/fa';

const ProductReviews = ({ product, onReviewChange }) => {
  const { user } = useContext(AuthContext);
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [myReviewExists, setMyReviewExists] = useState(false);

  useEffect(() => {
    if (user && product.reviews) {
      const existingReview = product.reviews.find(r => r.user === user._id);
      if (existingReview) {
        setMyReviewExists(true);
        setRating(existingReview.rating);
        setComment(existingReview.comment);
      } else {
        setMyReviewExists(false);
        setRating(0);
        setComment('');
      }
    }
  }, [user, product.reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Veuillez sélectionner une note');
      return;
    }
    if (!comment.trim()) {
      toast.error('Veuillez écrire un commentaire');
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.post(`/api/products/${product._id}/reviews`, { rating, comment }, config);
      toast.success(isEditing || myReviewExists ? 'Avis modifié avec succès' : 'Avis ajouté avec succès', { icon: '✨' });
      setIsEditing(false);
      onReviewChange(); // trigger parent refresh
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet avis ?')) return;
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      await axios.delete(`/api/products/${product._id}/reviews`, config);
      toast.success('Avis supprimé');
      setMyReviewExists(false);
      setRating(0);
      setComment('');
      setIsEditing(false);
      onReviewChange();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalReviews = product.reviews?.length || 0;
  const avgRating = product.rating || 0;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = product.reviews?.filter(r => r.rating === stars).length || 0;
    const percentage = totalReviews === 0 ? 0 : Math.round((count / totalReviews) * 100);
    return { stars, count, percentage };
  });

  const renderStars = (val, setFunc, hoverFunc) => (
    <div className="d-flex gap-1" onMouseLeave={() => hoverFunc && hoverFunc(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ cursor: setFunc ? 'pointer' : 'default', color: '#F4B942', fontSize: setFunc ? '2rem' : '1.2rem', transition: 'transform 0.2s' }}
          onClick={() => setFunc && setFunc(star)}
          onMouseEnter={() => hoverFunc && hoverFunc(star)}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {star <= (hoverRating || val) ? <FaStar /> : <FaRegStar />}
        </span>
      ))}
    </div>
  );

  return (
    <div className="mt-5 pt-5 border-top">
      <h3 className="fw-bold font-serif mb-5" style={{ color: 'var(--text-dark)' }}>Avis Clientes</h3>
      
      <div className="row g-5">
        {/* Statistics Column */}
        <div className="col-lg-5">
          <div className="p-4 rounded-4" style={{ backgroundColor: 'var(--secondary)' }}>
            <h4 className="fw-bold mb-4">Statistiques</h4>
            <div className="d-flex align-items-center gap-4 mb-4">
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
                {avgRating.toFixed(1)}
              </div>
              <div>
                {renderStars(Math.round(avgRating))}
                <div className="text-muted mt-1">{totalReviews} avis au total</div>
              </div>
            </div>

            <div className="d-flex flex-column gap-3 mt-4">
              {ratingDistribution.map(({ stars, percentage }) => (
                <div key={stars} className="d-flex align-items-center gap-3">
                  <div className="text-muted" style={{ width: 60, fontSize: '0.9rem' }}>{stars} étoiles</div>
                  <div className="progress flex-grow-1" style={{ height: 8, backgroundColor: 'rgba(0,0,0,0.05)' }}>
                    <motion.div 
                      className="progress-bar" 
                      style={{ backgroundColor: 'var(--accent)' }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="text-muted text-end" style={{ width: 45, fontSize: '0.85rem' }}>{percentage}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="mt-5">
            <h5 className="fw-bold mb-4">{myReviewExists && !isEditing ? 'Votre avis' : 'Donner votre avis'}</h5>
            
            {!user ? (
              <div className="alert alert-secondary border-0" style={{ backgroundColor: 'var(--bg-light)' }}>
                Veuillez vous <a href="/login" className="text-accent fw-bold text-decoration-none">connecter</a> pour laisser un avis.
              </div>
            ) : myReviewExists && !isEditing ? (
              <div className="p-4 rounded-4 bg-white border shadow-sm">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  {renderStars(rating)}
                  <div className="d-flex gap-2">
                    <button onClick={() => setIsEditing(true)} className="btn btn-sm btn-outline-secondary" title="Modifier"><FaEdit /></button>
                    <button onClick={handleDelete} className="btn btn-sm btn-outline-danger" title="Supprimer" disabled={loading}><FaTrash /></button>
                  </div>
                </div>
                <p className="mb-0 text-muted" style={{ lineHeight: 1.8 }}>{comment}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-4 rounded-4 bg-white border shadow-sm">
                <div className="mb-4">
                  <label className="form-label fw-semibold mb-2">Votre note globale</label>
                  {renderStars(rating, setRating, setHoverRating)}
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Votre commentaire</label>
                  <textarea 
                    className="form-control bg-light border-0" 
                    rows="4" 
                    placeholder="Qu'avez-vous pensé de ce produit ?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>
                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-primary-custom flex-grow-1" disabled={loading}>
                    {loading ? 'Envoi...' : (myReviewExists ? 'Modifier mon avis' : 'Publier mon avis')}
                  </button>
                  {myReviewExists && (
                    <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline-secondary">Annuler</button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="col-lg-7">
          <h4 className="fw-bold mb-4">Tous les avis</h4>
          {totalReviews === 0 ? (
            <div className="text-center p-5 rounded-4 bg-light text-muted border border-dashed">
              Soyez la première à donner votre avis sur ce produit !
            </div>
          ) : (
            <div className="d-flex flex-column gap-4">
              {product.reviews.map((r, index) => (
                <motion.div 
                  key={r._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-4 rounded-4 bg-white border shadow-sm"
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ fontSize: '2.5rem', color: '#e0e0e0' }}><FaUserCircle /></div>
                      <div>
                        <div className="fw-semibold text-dark">{r.name}</div>
                        <div className="text-muted small">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Récemment'}
                        </div>
                      </div>
                    </div>
                    {renderStars(r.rating)}
                  </div>
                  <p className="mb-0 text-muted" style={{ lineHeight: 1.8 }}>{r.comment}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
