import { motion } from 'framer-motion';
import ProductCard from './ProductCard.jsx';
import { useTranslation } from 'react-i18next';

const ProductCarousel = ({ title, products }) => {
  const { t } = useTranslation();

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-5">
      <h4 className="fw-bold mb-4 font-serif" style={{ color: 'var(--text-dark)' }}>{title}</h4>
      <motion.div 
        className="row g-4 flex-nowrap overflow-auto pb-4" 
        style={{ scrollbarWidth: 'thin' }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
      >
        {products.map((product) => (
          <motion.div 
            key={product._id} 
            className="col-10 col-sm-6 col-md-4 col-lg-3"
            variants={{
              hidden: { opacity: 0, x: 20 },
              show: { opacity: 1, x: 0, transition: { duration: 0.4 } }
            }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductCarousel;
