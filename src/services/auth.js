import axiosInstance from '../services/axios';
import { toast } from 'react-toastify';


//working fine
export const login = async (payloadData) => {
  try {
    const response = await axiosInstance.post('/auth/login', payloadData, {
      headers: {
        'Authorization': `Bearer ${payloadData.bearerToken}`
      }
    });
    console.log("res====>>>",response);
    if (response?.data?.accessToken) {
      localStorage.setItem('authToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response;
  } catch (error) {
    toast.error('Login failed. Please check your credentials.');

    throw error;
  }
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const getEmployeeData = async (employeeId) => {
  try {
    const authToken = getToken(); 
    if (!authToken) {
      throw new Error('No auth token found');
    }

    const response = await axios.get(`/api/v1/reward-service/employee/${employeeId}`, {
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


export const addToCart = async (productId, quantity, authToken) => {
  const response = await axiosInstance.post(`/api/v1/reward-service/cart?productId=${productId}&quantity=${quantity}`, {
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
  });
  if (!response.ok) {
    throw new Error('Failed to add product to cart');
  }
  return response.json();
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
export const updateQuantity = async (productId, quantity, authToken) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/reward-service/cart/update-quantity?productId=${productId}&quantityChange=${quantity}`, {
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
export const removeFromCart = async (productId, authToken) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/reward-service/cart?productId=${productId}`, {
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

// update address api -patch
export const updateAddress = async (addressData, authToken) => {
  try {
    const response = await axiosInstance.patch('/api/v1/reward-service/address/1', addressData, {
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
      `/api/v1/reward-service/order/check-out?employeeId=1&addressId=1`, 
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