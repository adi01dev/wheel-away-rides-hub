
import axios from 'axios';

const API_URL = '/api/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: string;
  phoneNumber?: string;
}

export interface GoogleAuthData {
  email: string;
  name: string;
  googleId: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Register new user
const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/register`, userData);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Login user
const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Google auth
const googleAuth = async (googleData: GoogleAuthData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/google`, googleData);
  
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Logout
const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Optional: Send logout request to server to invalidate token if needed
  axios.post(`${API_URL}/logout`).catch(err => {
    console.error("Logout API error:", err);
  });
};

// Get current user
const getCurrentUser = (): any => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Check if user is authenticated
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Update user profile
const updateProfile = async (userData: { name?: string; phoneNumber?: string }): Promise<any> => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/user`, userData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  // Update local storage with new user data
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...response.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  
  return response.data;
};

// Setup auth header for axios
const setupAxiosInterceptors = (): void => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Auto logout if 401 response returned from API
        logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Initialize axios interceptors
setupAxiosInterceptors();

const authService = {
  register,
  login,
  googleAuth,
  logout,
  getCurrentUser,
  isAuthenticated,
  updateProfile
};

export default authService;
