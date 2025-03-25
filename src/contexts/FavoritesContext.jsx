import React, { createContext, useContext, useState } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Add to favorites
  const addToFavorites = (product) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites.some(item => item.id === product.id)) {
        return [...prevFavorites, product];
      }
      return prevFavorites;
    });
  };

  // Remove from favorites
  const removeFromFavorites = (productId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter(item => item.id !== productId)
    );
  };

  // Get favorites count
  const getFavoritesCount = () => favorites.length;

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      getFavoritesCount
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook
export const useFavorites = () => useContext(FavoritesContext);