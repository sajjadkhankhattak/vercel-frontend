import { api } from './api.js';

// Submit quiz attempt
export const submitQuizAttempt = async (quizId, attemptData) => {
  return await api.post(`/api/quiz-attempts/${quizId}/submit`, attemptData);
};

// Get quiz attempt result
export const getQuizAttemptResult = async (attemptId) => {
  return await api.get(`/api/quiz-attempts/result/${attemptId}`);
};

// Get user's quiz history
export const getUserQuizHistory = async (page = 1, limit = 10) => {
  return await api.get(`/api/quiz-attempts/history?page=${page}&limit=${limit}`);
};

// Get user's attempts for specific quiz
export const getQuizAttempts = async (quizId) => {
  return await api.get(`/api/quiz-attempts/${quizId}/attempts`);
};

// Get quiz leaderboard
export const getQuizLeaderboard = async (quizId, limit = 10) => {
  return await api.get(`/api/quiz-attempts/${quizId}/leaderboard?limit=${limit}`);
};