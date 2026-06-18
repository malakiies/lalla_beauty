import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaLock, FaUserShield } from 'react-icons/fa';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [navigate, user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await login(email, password);
    
    if (!res.success) {
      toast.error('Identifiants incorrects');
      setLoading(false);
      return;
    }
    
    // Check if the logged in user is actually an admin
    if (res.user && res.user.role !== 'admin') {
      logout(); // logout immediately
      toast.error('Accès refusé : Privilèges administrateur requis.', { icon: '🚫' });
      setLoading(false);
      return;
    }

    toast.success('Authentification réussie. Bienvenue Administrateur.', { icon: '🛡️' });
    navigate('/admin/dashboard');
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ backgroundColor: '#121212', minHeight: 'calc(100vh - 80px)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="col-11 col-md-6 col-lg-4"
      >
        <div className="card border-0 shadow-lg p-4" style={{ backgroundColor: '#1e1e1e', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="text-center mb-3">
            <div className="d-inline-flex justify-content-center align-items-center mb-2" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(244, 185, 66, 0.1)', color: '#F4B942' }}>
              <FaUserShield size={28} />
            </div>
            <h3 className="fw-bold text-white font-serif mb-1">Portail Admin</h3>
            <p className="text-muted small mb-0">Accès restreint au personnel autorisé</p>
          </div>
          
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label className="form-label text-light fw-semibold small text-uppercase letter-spacing-1">Identifiant</label>
              <input 
                type="email" 
                className="form-control" 
                style={{ backgroundColor: '#2a2a2a', border: '1px solid #333', color: '#fff', padding: '12px 15px' }}
                placeholder="admin@lallabeauty.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="mb-4">
              <label className="form-label text-light fw-semibold small text-uppercase letter-spacing-1">Mot de passe</label>
              <div className="input-group">
                <span className="input-group-text" style={{ backgroundColor: '#2a2a2a', border: '1px solid #333', borderRight: 'none', color: '#888' }}>
                  <FaLock />
                </span>
                <input 
                  type="password" 
                  className="form-control" 
                  style={{ backgroundColor: '#2a2a2a', border: '1px solid #333', borderLeft: 'none', color: '#fff', padding: '12px 15px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="btn w-100 fw-bold py-2 text-dark" 
              style={{ backgroundColor: '#F4B942', borderRadius: '8px', transition: 'all 0.3s' }}
              disabled={loading}
            >
              {loading ? 'Vérification...' : 'Connexion Sécurisée'}
            </button>
          </form>
          
          <div className="text-center mt-3">
            <a href="/" className="text-muted text-decoration-none small hover-gold transition-custom">Retour à la boutique</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
