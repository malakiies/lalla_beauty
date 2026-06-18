import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    const storedCoupon = localStorage.getItem('appliedCoupon');
    if (storedCoupon) {
      try {
        setAppliedCoupon(JSON.parse(storedCoupon));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('appliedCoupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x.product === product._id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.product === existItem.product ? { ...x, qty: x.qty + qty } : x
        )
      );
    } else {
      setCartItems([...cartItems, {
        name: product.name,
        qty,
        image: product.image,
        price: product.price,
        product: product._id,
      }]);
    }
  };

  const updateCartItemQty = (id, qty) => {
    setCartItems(
      cartItems.map((x) =>
        x.product === id ? { ...x, qty } : x
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x.product !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, updateCartItemQty, removeFromCart, clearCart,
      appliedCoupon, applyCoupon, removeCoupon 
    }}>
      {children}
    </CartContext.Provider>
  );
};
