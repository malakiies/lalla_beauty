import { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard.jsx';
import SkeletonProduct from '../components/SkeletonProduct.jsx';
import { FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Catalog = () => {
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get('/api/products');
      return data;
    }
  });

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axios.get('/api/categories');
      return data;
    }
  });

  const loading = loadingProducts || loadingCategories;

  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtering & Sorting Logic
  let filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(p => 
      p.category === selectedCategory || (p.category && p.category._id === selectedCategory)
    );
  }
  
  if (sortOrder === 'asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="container py-5">
      <div className="row mb-5 align-items-center">
        <div className="col-12 mb-5 text-center">
          <h2 className="fw-medium mb-3" style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'var(--text-dark)' }}>{t('catalog.title')}</h2>
          <p className="text-muted fw-light mx-auto" style={{ maxWidth: 500 }}>{t('catalog.subtitle')}</p>
        </div>
        
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted" style={{ border: '1px solid rgba(0,0,0,0.1)', borderRight: 'none', borderRadius: '4px 0 0 4px' }}><FaSearch /></span>
            <input 
              type="text" 
              className="form-control form-control-custom border-start-0 ps-0" 
              placeholder={t('catalog.searchPlaceholder')} 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{ borderRadius: '0 4px 4px 0', boxShadow: 'none' }}
            />
          </div>
        </div>
        
        <div className="col-md-4 mb-3 mb-md-0">
          <select 
            className="form-select form-control-custom"
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            style={{ boxShadow: 'none' }}
          >
            <option value="">{t('catalog.allCategories')}</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
        
        <div className="col-md-4">
          <select 
            className="form-select form-control-custom"
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
            style={{ boxShadow: 'none' }}
          >
            <option value="">{t('catalog.sortBy')}</option>
            <option value="asc">{t('catalog.priceAsc')}</option>
            <option value="desc">{t('catalog.priceDesc')}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="row g-4 fade-in-up">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="col-sm-6 col-md-4 col-lg-3">
              <SkeletonProduct />
            </div>
          ))}
        </div>
      ) : (
        <>
          <motion.div 
            className="row g-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {currentProducts.map(product => (
              <motion.div 
                key={product._id} 
                className="col-sm-6 col-md-4 col-lg-3"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
            {currentProducts.length === 0 && (
               <div className="col-12 text-center py-5 my-5">
                 <h4 className="text-muted">{t('catalog.noProducts')}</h4>
               </div>
            )}
          </motion.div>
          
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5 pt-4 border-top">
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link shadow-sm border-0 mx-1" style={{ color: 'var(--text-dark)' }} onClick={() => setCurrentPage(c => c - 1)}>{t('catalog.prev')}</button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button 
                        className="page-link shadow-sm border-0 mx-1" 
                        style={currentPage === i + 1 ? {backgroundColor: 'var(--accent)', color: '#fff'} : {color: 'var(--text-dark)'}} 
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link shadow-sm border-0 mx-1" style={{ color: 'var(--text-dark)' }} onClick={() => setCurrentPage(c => c + 1)}>{t('catalog.next')}</button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Catalog;
