import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingProduct = state.find((item) => item.id === action.payload.id);
      if (existingProduct) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [...state, action.payload];
      
    case 'REMOVE_FROM_CART':
      return state.filter((item) => item.id !== action.payload);
      
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const getCartCount = () => cart.reduce((total, item) => total + item.quantity, 0);

  // ✅ **Added getCartTotal function**
  const getCartTotal = () => 
    cart.reduce((total, item) => total + (item.points * item.quantity), 0); 

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getCartCount, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
