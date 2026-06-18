import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useContext(AuthContext);

  // Load wishlist from MongoDB when user logs in
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/wishlist', config);
      setWishlist(data);
    } catch (error) {
      console.error('Erreur chargement favoris:', error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  const toggleWishlist = async (product) => {
    if (!user) {
      toast.error('Connectez-vous pour ajouter aux favoris 💖');
      return;
    }

    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      if (isInWishlist(product._id)) {
        const { data } = await axios.delete(`/api/wishlist/${product._id}`, config);
        setWishlist(data);
        toast('Retiré des favoris', { icon: '🤍' });
      } else {
        const { data } = await axios.post(`/api/wishlist/${product._id}`, {}, config);
        setWishlist(data);
        toast.success(`${product.name} ajouté aux favoris !`, { icon: '❤️' });
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
