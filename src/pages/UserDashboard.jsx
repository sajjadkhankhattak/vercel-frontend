import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, 
  Clock, 
  TrendingUp, 
  Eye, 
  RotateCcw, 
  Calendar,
  Target,
  Award,
  BookOpen,
  ChevronRight,
  Filter
} from 'lucide-react';
import { getUserQuizHistory } from '../services/quizApi';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all'); // all, completed, high-score

  useEffect(() => {
    // Check if user is authenticated (with fallback check)
    const token = localStorage.getItem('token');
    if (!isAuthenticated() && !token) {
      navigate('/login');
      return;
    }
    
    // Test endpoint first to debug the issue
    const testConnection = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/quiz-attempts/test`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log("🔍 Test endpoint response:", data);
      } catch (error) {
        console.log("❌ Test endpoint failed:", error);
      }
    };

    testConnection();
    fetchQuizHistory(currentPage);
  }, [currentPage, isAuthenticated, navigate]);

  const fetchQuizHistory = async (page = 1) => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await getUserQuizHistory(page, 10);
      
      if (response.data.success) {
        setQuizHistory(response.data.attempts || []);
        setPagination(response.data.pagination || {});
      } else {
        setError('Failed to load quiz history: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error fetching quiz history:', err);
      
      // Handle different types of errors
      if (err.response?.status === 401) {
        setError('Please log in to view your quiz history');
      } else if (err.response?.status === 500) {
        setError('Server error. This might be because you haven\'t taken any quizzes yet or the server is experiencing issues.');
      } else if (err.response?.data?.message) {
        setError('Error: ' + err.response.data.message);
      } else {
        setError('Failed to load quiz history. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-danger';
  };

  const getScoreBadgeClass = (percentage) => {
    if (percentage >= 80) return 'bg-success';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-danger';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getStats = () => {
    if (quizHistory.length === 0) return null;

    const totalQuizzes = quizHistory.length;
    const averageScore = Math.round(
      quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0) / totalQuizzes
    );
    const highScore = Math.max(...quizHistory.map(quiz => quiz.percentage));
    const totalTime = quizHistory.reduce((sum, quiz) => sum + quiz.timeSpent, 0);

    return {
      totalQuizzes,
      averageScore,
      highScore,
      totalTime
    };
  };

  const filteredHistory = () => {
    switch (filter) {
      case 'high-score':
        return quizHistory.filter(quiz => quiz.percentage >= 80);
      case 'completed':
        return quizHistory;
      default:
        return quizHistory;
    }
  };

  const stats = getStats();

  if (loading && currentPage === 1) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading your quiz history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="h2 mb-1">My Dashboard</h1>
          <p className="text-muted">Track your quiz performance and progress</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="row mb-4">
          <div className="col-6 col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="mb-2">
                  <BookOpen size={24} className="text-primary" />
                </div>
                <h4 className="mb-1">{stats.totalQuizzes}</h4>
                <small className="text-muted">Quizzes Taken</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="mb-2">
                  <Target size={24} className={getScoreColor(stats.averageScore)} />
                </div>
                <h4 className={`mb-1 ${getScoreColor(stats.averageScore)}`}>
                  {stats.averageScore}%
                </h4>
                <small className="text-muted">Average Score</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="mb-2">
                  <Trophy size={24} className="text-warning" />
                </div>
                <h4 className="mb-1 text-warning">{stats.highScore}%</h4>
                <small className="text-muted">Best Score</small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="mb-2">
                  <Clock size={24} className="text-info" />
                </div>
                <h4 className="mb-1 text-info">{formatTime(stats.totalTime)}</h4>
                <small className="text-muted">Total Time</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <Link to="/" className="btn btn-primary">
                  <BookOpen size={18} className="me-2" />
                  Browse Quizzes
                </Link>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => window.location.reload()}
                >
                  <TrendingUp size={18} className="me-2" />
                  Refresh Stats
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Quiz History */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <Award size={20} className="me-2 text-primary" />
                  Quiz History
                </h5>
                
                <div className="dropdown">
                  <button 
                    className="btn btn-outline-secondary btn-sm dropdown-toggle"
                    type="button" 
                    data-bs-toggle="dropdown"
                  >
                    <Filter size={16} className="me-1" />
                    {filter === 'all' ? 'All Attempts' : 
                     filter === 'high-score' ? 'High Scores' : 'Completed'}
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={() => setFilter('all')}
                      >
                        All Attempts
                      </button>
                    </li>
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={() => setFilter('high-score')}
                      >
                        High Scores (80%+)
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="card-body p-0">
              {error ? (
                <div className="text-center py-4">
                  <div className="alert alert-info mx-4">
                    <h6>Welcome to Your Dashboard!</h6>
                    <p className="mb-2">
                      It looks like you haven't taken any quizzes yet, or there was an issue loading your history.
                    </p>
                    <p className="mb-3 small text-muted">{error}</p>
                    <div className="d-flex gap-2 justify-content-center">
                      <Link to="/" className="btn btn-primary btn-sm">
                        Browse Quizzes
                      </Link>
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => fetchQuizHistory()}
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              ) : filteredHistory().length === 0 ? (
                <div className="text-center py-5">
                  <BookOpen size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No Quiz History</h5>
                  <p className="text-muted mb-3">
                    {filter === 'high-score' 
                      ? "You haven't achieved any high scores yet. Keep practicing!" 
                      : "You haven't taken any quizzes yet."}
                  </p>
                  <Link to="/" className="btn btn-primary">
                    Start Your First Quiz
                  </Link>
                </div>
              ) : (
                <>
                  <div className="list-group list-group-flush">
                    {filteredHistory().map((attempt) => (
                      <div key={attempt.attemptId} className="list-group-item">
                        <div className="d-flex align-items-center">
                          {/* Quiz Image */}
                          <div className="me-3 flex-shrink-0">
                            <img
                              src={attempt.quiz.image || '/images/default-quiz.svg'}
                              alt={attempt.quiz.title}
                              className="rounded"
                              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = '/images/default-quiz.svg';
                              }}
                            />
                          </div>
                          
                          {/* Quiz Info */}
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="mb-1">{attempt.quiz.title}</h6>
                                <div className="d-flex align-items-center gap-3 small text-muted">
                                  <span className="badge bg-light text-dark">
                                    {attempt.quiz.category}
                                  </span>
                                  <span>
                                    <Calendar size={14} className="me-1" />
                                    {new Date(attempt.completedAt).toLocaleDateString()}
                                  </span>
                                  <span>
                                    <Clock size={14} className="me-1" />
                                    {formatTime(attempt.timeSpent)}
                                  </span>
                                  <span>Attempt #{attempt.attemptNumber}</span>
                                </div>
                              </div>
                              
                              <div className="text-end">
                                <div className={`h5 mb-1 ${getScoreColor(attempt.percentage)}`}>
                                  {attempt.percentage}%
                                </div>
                                <div className="d-flex gap-1">
                                  <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => navigate(`/quiz-result/${attempt.attemptId}`)}
                                    title="View Result"
                                  >
                                    <Eye size={14} />
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => navigate(`/take-quiz/${attempt.quiz.id}`)}
                                    title="Retake Quiz"
                                  >
                                    <RotateCcw size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="card-footer bg-light border-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Showing {((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, pagination.totalAttempts)} of {pagination.totalAttempts} attempts
                        </small>
                        
                        <nav>
                          <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${!pagination.hasPrev ? 'disabled' : ''}`}>
                              <button 
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={!pagination.hasPrev}
                              >
                                Previous
                              </button>
                            </li>
                            
                            {[...Array(pagination.totalPages)].map((_, index) => (
                              <li 
                                key={index + 1} 
                                className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                              >
                                <button 
                                  className="page-link"
                                  onClick={() => setCurrentPage(index + 1)}
                                >
                                  {index + 1}
                                </button>
                              </li>
                            ))}
                            
                            <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                              <button 
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={!pagination.hasNext}
                              >
                                Next
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}