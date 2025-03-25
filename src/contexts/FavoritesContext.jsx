import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist } from '../services/auth';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  console.log("wishlist from contest",wishlist);	

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;

    try {
      const data = await getWishlist(authToken);
      setWishlist(data);
    } catch (error) {
      console.error( error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Add item to wishlist
  const addToFavorites = (product) => {
    setWishlist((prevWishlist) => {
      if (!prevWishlist.some((item) => item.productId === product.productId)) {
        return [...prevWishlist, product];
      }
      return prevWishlist;
    });
  };

  // Remove item from wishlist
  const removeFromFavorites = (productId) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.productId !== productId)
    );
  };

  // Clear all items from wishlist
  const clearFavorites = () => {
    setWishlist([]);
  };

  // Get wishlist count
  const getFavoritesCount = () => wishlist.length;
  

  return (
    <FavoritesContext.Provider value={{
      wishlist,
      fetchWishlist,
      addToFavorites,
      removeFromFavorites,
      getFavoritesCount,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook
export const useFavorites = () => useContext(FavoritesContext);
