import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Home from '../pages/Home.jsx';
import Catalog from '../pages/Catalog.jsx';
import ProductDetail from '../pages/ProductDetail.jsx';
import Cart from '../pages/Cart.jsx';
import Checkout from '../pages/Checkout.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import Profile from '../pages/Profile.jsx';
import AdminDashboard from '../pages/AdminDashboard.jsx';
import Contact from '../pages/Contact.jsx';
import About from '../pages/About.jsx';
import AdminLogin from '../pages/AdminLogin.jsx';
import Wishlist from '../pages/Wishlist.jsx';
import Compare from '../pages/Compare.jsx';
import NotFound from '../pages/NotFound.jsx';
import Maintenance from '../pages/Maintenance.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminRoute from './AdminRoute.jsx';

// Composant wrapper pour l'animation de page
const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/catalog" element={<PageWrapper><Catalog /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/compare" element={<PageWrapper><Compare /></PageWrapper>} />
        <Route path="/product/:id" element={<PageWrapper><ProductDetail /></PageWrapper>} />
        <Route path="/cart" element={<PageWrapper><Cart /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/maintenance" element={<PageWrapper><Maintenance /></PageWrapper>} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
          <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
          <Route path="/wishlist" element={<PageWrapper><Wishlist /></PageWrapper>} />
        </Route>
        
        <Route path="/admin/login" element={<PageWrapper><AdminLogin /></PageWrapper>} />
        
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
        </Route>
        
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
