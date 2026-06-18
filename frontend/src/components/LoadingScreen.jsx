import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="vh-100 vw-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: 'var(--bg-light)', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="text-center"
      >
        <h1 className="font-serif fw-bold" style={{ color: 'var(--text-dark)', letterSpacing: '4px', fontSize: '3rem' }}>
          LALLA BEAUTY
        </h1>
        <div className="mt-3 mx-auto" style={{ width: '50px', height: '2px', backgroundColor: 'var(--accent)' }}></div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
