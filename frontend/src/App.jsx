import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar.jsx';
import AnimatedRoutes from './components/AnimatedRoutes.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import BeautyAssistant from './components/BeautyAssistant.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderScreen from './pages/OrderScreen.jsx';
import Profile from './pages/Profile.jsx';
import Cart from './pages/Cart.jsx';
import BottomNav from './components/BottomNav.jsx';

function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // Simulate premium splash screen loading
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: 'var(--bg-light)',
          color: 'var(--text-dark)',
          border: '1px solid rgba(193, 154, 107, 0.2)',
          borderRadius: '0px',
          padding: '16px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
        },
      }} />
      
      {isAppLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Navbar />
          {/* mb-5 on main for mobile to prevent BottomNav overlap */}
          <main className="min-vh-100 pb-5 mb-5 mb-lg-0">
            <Routes>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<AnimatedRoutes />} />
            </Routes>
          </main>
          <BottomNav />
          <ScrollToTop />
          <BeautyAssistant />
        </>
      )}
    </Router>
  );
}

export default App;
