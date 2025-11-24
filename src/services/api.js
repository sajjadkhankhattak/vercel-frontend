import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                 import.meta.env.VITE_BACKEND_URL || 
                 'http://localhost:5000';

console.log('API Base URL:', BASE_URL); // Debug log to see what URL is being used

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth functions
export const register = async (userData) => {
  return await api.post('/api/auth/signup', userData);
}

export const login = async (userData) => {
  return await api.post('/api/auth/login', userData);
}

export const getCurrentUser = async () => {
  return await api.get('/api/auth/profile');
}

export const checkAdminStatus = async () => {
  return await api.get('/api/auth/admin-status');
}

// Quiz functions
export const createQuiz = async (quizData, imageFile = null) => {
  // If there's an image, use FormData, otherwise use JSON
  if (imageFile) {
    const formData = new FormData();
    
    // Append quiz data as JSON string
    formData.append('title', quizData.title);
    formData.append('description', quizData.description || '');
    formData.append('category', quizData.category);
    formData.append('duration', quizData.duration || '');
    formData.append('difficulty', quizData.difficulty || '');
    formData.append('tags', JSON.stringify(quizData.tags || []));
    formData.append('questions', JSON.stringify(quizData.questions));
    
    // Append image file
    formData.append('image', imageFile);
    
    return await api.post('/api/quiz', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 60000 // 60 seconds for image uploads
    });
  } else {
    // No image, send as JSON
    return await api.post('/api/quiz', quizData);
  }
}

export const getQuizzes = async () => {
  return await api.get('/api/quiz');
}

export const deleteQuiz = async (id) => {
  return await api.delete(`/api/quiz/${id}`);
}

export const updateQuiz = async (id, quizData) => {
  return await api.put(`/api/quiz/${id}`, quizData);
}

export const sendQuizData = async (quizData) => {
  return await api.post('/api/quiz/test', quizData);
}

// User functions
export const createUser = async (userData) => {
  return await api.post('/api/auth/signup', userData);
}

export const updateUser = async (userId, userData) => {
  return await api.put(`/api/users/${userId}`, userData);
}

export const deleteUser = async (userId) => {
  return await api.delete(`/api/users/${userId}`);
}

export const getUsers = async () => {
  return await api.get('/api/users');
}