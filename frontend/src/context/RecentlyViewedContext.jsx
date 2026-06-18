import { createContext, useState, useEffect } from 'react';

export const RecentlyViewedContext = createContext();

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentlyViewed');
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing recently viewed products from localStorage');
      }
    }
  }, []);

  const addRecentlyViewed = (product) => {
    setRecentlyViewed((prev) => {
      // Remove if it already exists
      const filtered = prev.filter((p) => p._id !== product._id);
      
      // Add to beginning, keep max 8 items
      const updated = [product, ...filtered].slice(0, 8);
      
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};
