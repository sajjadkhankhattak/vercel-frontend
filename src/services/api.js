import axios from 'axios';

const BASE_URL = "http://localhost:5000";

export const register = async (userData) => {
  return await axios.post(`${BASE_URL}/api/auth/signup`, userData);
}

export const login = async (userData) => {
  return await axios.post(`${BASE_URL}/api/auth/login`, userData);
}

// Add these new functions for quizzes
export const createQuiz = async (quizData) => {
  return await axios.post(`${BASE_URL}/api/quiz`, quizData);
}

export const getQuizzes = async () => {
  return await axios.get(`${BASE_URL}/api/quiz`);
}

export const deleteQuiz = async (id) => {
  return await axios.delete(`${BASE_URL}/api/quiz/${id}`);
}

export const updateQuiz = async (id, quizData) => {
  return await axios.put(`${BASE_URL}/api/quiz/${id}`, quizData);
}

// Add this to your existing services/api.js
export const sendQuizData = async (quizData) => {
  return await axios.post(`${BASE_URL}/api/quiz/test`, quizData);
}
// Add these to your existing API functions

// Create new user
export const createUser = async (userData) => {
  return await axios.post(`${BASE_URL}/api/auth/signup`, userData);
}

// Update user
export const updateUser = async (userId, userData) => {
  return await axios.put(`${BASE_URL}/api/users/${userId}`, userData);
}

// Delete user
export const deleteUser = async (userId) => {
  return await axios.delete(`${BASE_URL}/api/users/${userId}`);
}

// Get all users]
export const getUsers = async () => {
  return await axios.get(`${BASE_URL}/api/users`);
}