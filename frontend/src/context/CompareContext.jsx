import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('compareItems');
    if (saved) {
      setCompareItems(JSON.parse(saved));
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('compareItems', JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product) => {
    if (compareItems.find((item) => item._id === product._id)) {
      toast.error('Produit déjà dans le comparateur');
      return;
    }

    if (compareItems.length >= 3) {
      toast.error('Vous ne pouvez comparer que 3 produits maximum', { icon: '⚖️' });
      return;
    }

    setCompareItems([...compareItems, product]);
    toast.success('Produit ajouté au comparateur', { icon: '⚖️' });
  };

  const removeFromCompare = (productId) => {
    setCompareItems(compareItems.filter((item) => item._id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId) => {
    return compareItems.some(item => item._id === productId);
  };

  return (
    <CompareContext.Provider
      value={{ compareItems, addToCompare, removeFromCompare, clearCompare, isInCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
};
