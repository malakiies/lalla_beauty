import { motion } from 'framer-motion';

const Maintenance = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container py-5 min-vh-100 d-flex flex-column justify-content-center align-items-center text-center"
      style={{ backgroundColor: 'var(--bg-light)' }}
    >
      <div className="mb-5">
        <h1 className="font-serif fw-bold" style={{ color: 'var(--text-dark)', letterSpacing: '4px', fontSize: '3rem' }}>
          LALLA BEAUTY
        </h1>
        <div className="mt-3 mx-auto" style={{ width: '50px', height: '2px', backgroundColor: 'var(--accent)' }}></div>
      </div>
      
      <h2 className="font-serif fw-bold mb-4" style={{ color: 'var(--text-dark)' }}>Site en Maintenance</h2>
      <p className="text-muted font-sans" style={{ maxWidth: '600px', lineHeight: '1.8' }}>
        Nous mettons actuellement à jour notre boutique pour vous offrir une expérience encore plus luxueuse. 
        <br />
        Merci de votre patience, nous serons de retour très prochainement.
      </p>
    </motion.div>
  );
};

export default Maintenance;
