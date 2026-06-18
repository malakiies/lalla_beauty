import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container py-5 min-vh-100 d-flex flex-column justify-content-center align-items-center text-center"
    >
      <h1 className="font-serif fw-bold" style={{ fontSize: '6rem', color: 'var(--accent)' }}>404</h1>
      <h2 className="font-serif fw-bold mb-4" style={{ color: 'var(--text-dark)' }}>Page Introuvable</h2>
      <p className="text-muted font-sans mb-5" style={{ maxWidth: '500px' }}>
        Il semblerait que vous vous soyez perdu(e). La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn btn-primary-custom">
        Retour à l'accueil
      </Link>
    </motion.div>
  );
};

export default NotFound;
