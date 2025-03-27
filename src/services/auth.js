import axiosInstance, { updateAxiosAuthHeader } from '../services/axios';
import { toast } from 'react-toastify';

//working fine
export const login = async (payloadData) => {
  try {
    const response = await axiosInstance.post('/auth/login', payloadData, {
      headers: {
        'Authorization': `Bearer ${payloadData.bearerToken}`
      }
    });

    if (response?.data?.accessToken) {
      localStorage.setItem('authToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);

      updateAxiosAuthHeader(response.data.accessToken);
    }

    return response;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    throw error;
  }
};

import jwt_decode from "jwt-decode";

export const getToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null; // Handle missing token case

  try {
    const decodedToken = jwt_decode(token);
    return decodedToken.userId; // Extract userId from the decoded token
  } catch (error) {
    console.error("Invalid token:", error);
    return null; // Handle invalid token case
  }
};


export const getEmployeeData = async (employeeId) => {
  try {
    const authToken = getToken(); 
    if (!authToken) {
      throw new Error('No auth token found');
    }

    const response = await axiosInstance.get(`/api/v1/reward-service/employee/${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};

export const getProducts = async (userId, page = 1, size = 10) => {
  try {
    const authToken = getToken(); 
    if (!authToken) {
      throw new Error('No auth token found');
    }
    const response = await axiosInstance.get(`/api/v1/reward-service/product?employeeId=${userId}&page=${page}&size=${size}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};


export const addToCart = async (productId, quantity, size, authToken) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/reward-service/cart?productId=${productId}&size=${size}&quantity=${quantity}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    // The response data is already parsed, so just return it directly
    return response.data;
  } catch (error) {
    // Handle error (network error or non-2xx status codes)
    console.error('Error adding product to cart:', error);
    throw new Error('Failed to add product to cart');
  }
};


export const fetchCart = async (authToken) => {
  try {
    const response = await axiosInstance.get('/api/v1/reward-service/cart', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};

// update carts items quantity patch api
export const updateQuantity = async (queryParams, authToken) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/reward-service/cart/update-quantity${queryParams}`, {}, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};  


//delete cart items -delete api
export const removeFromCart = async (productId, size, authToken) => {
  try {
    // Construct the URL with both productId and size as query parameters
    const response = await axiosInstance.delete(
      `/api/v1/reward-service/cart?productId=${productId}&size=${size}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Handle error and show toast for unauthorized access
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    // Rethrow the error for further handling
    throw error;
  }
};


// get user profile api by id

export const profileUser = async (authToken, employeeId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/reward-service/employee/${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};

// create address api -post
export const addAddress = async (addressData, authToken) => {
  try {
    const response = await axiosInstance.post('/api/v1/reward-service/address/1', addressData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};

// get address api -get
export const getAddress = async (authToken) => {
  try {
    const response = await axiosInstance.get('/api/v1/reward-service/address/1', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};

// update address by id api -patch
// Update address by ID - PATCH
export const updateAddress = async (addressData, authToken, id) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/reward-service/address/1`, addressData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};

// wishlist post api
export const addToWishlist = async (productId, authToken) => {
  try {
    const response = await axiosInstance.post(`/api/v1/reward-service/wishlist?productId=${productId}`, {}, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};

// get all wishlist items api
export const getWishlist = async (authToken) => {
  try {
    const response = await axiosInstance.get('/api/v1/reward-service/wishlist', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};

// toggle wishlist item api
export const toggleWishlist = async (productId, authToken) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/reward-service/wishlist/toggle?productId=${productId}`, {}, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};

//delete wishlist items -delete api
export const removeFromWishlist = async (productId, authToken) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/reward-service/wishlist?productId=${productId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};  

// checkout order api
export const checkoutOrder = async (authToken) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/reward-service/order/check-out?employeeId=${employeeId}&addressId=${addressId}`, 
      {}, 
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': '*/*'
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};

//order history api -get
export const getOrderHistory = async (authToken) => {
  try {
    const response = await axiosInstance.get('/api/v1/reward-service/order?employeeId=1', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};  

//product by id api -get
export const getProductById = async (productId, employeeId, authToken) => {
  try {
    const response = await axios.get(
      `/api/v1/reward-service/product/${productId}?employeeId=${employeeId}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': '*/*',
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      toast.error('Unauthorized access. Please log in again.');
    }
    throw error;
  }
};