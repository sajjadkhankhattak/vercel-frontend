import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Home, 
  Share2,
  Target,
  Award,
  TrendingUp
} from 'lucide-react';
import { getQuizAttemptResult, getQuizAttempts } from '../services/quizApi';

export default function QuizResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [userAttempts, setUserAttempts] = useState([]);

  useEffect(() => {
    const fetchResult = async () => {
      if (result) return; // Already have result from navigation state
      
      try {
        setLoading(true);
        const response = await getQuizAttemptResult(attemptId);
        
        if (response.data.success) {
          setResult(response.data.result);
        } else {
          setError('Result not found');
        }
      } catch (err) {
        console.error('Error fetching result:', err);
        setError('Failed to load result');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId, result]);

  useEffect(() => {
    const fetchUserAttempts = async () => {
      if (!result?.quiz) return;
      
      try {
        const response = await getQuizAttempts(result.quiz.id || result.quiz._id);
        if (response.data.success) {
          setUserAttempts(response.data.attempts);
        }
      } catch (err) {
        console.error('Error fetching user attempts:', err);
      }
    };

    if (result) {
      fetchUserAttempts();
    }
  }, [result]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
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

  const getPerformanceText = (percentage) => {
    if (percentage >= 90) return 'Excellent! 🏆';
    if (percentage >= 80) return 'Great job! 🌟';
    if (percentage >= 70) return 'Good work! 👍';
    if (percentage >= 60) return 'Not bad! 📚';
    return 'Keep practicing! 💪';
  };

  const handleRetakeQuiz = () => {
    navigate(`/take-quiz/${result.quiz.id || result.quiz._id}`);
  };

  const handleShareResult = () => {
    const shareText = `I just scored ${result.percentage}% on "${result.quiz.title}" quiz! 🎉`;
    if (navigator.share) {
      navigator.share({
        title: 'Quiz Result',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText + ' ' + window.location.href);
      alert('Result copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading result...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h5>Error Loading Result</h5>
          <p className="mb-3">{error || 'Result not found'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12 text-center">
          <div className="mb-3">
            <Trophy size={48} className={getScoreColor(result.percentage)} />
          </div>
          <h1 className="display-6 mb-2">Quiz Completed!</h1>
          <p className="text-muted lead">{getPerformanceText(result.percentage)}</p>
        </div>
      </div>

      {/* Main Results Card */}
      <div className="row justify-content-center mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-gradient text-white text-center py-4" 
                 style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <h3 className="mb-1">{result.quiz.title}</h3>
              <p className="mb-0 opacity-75">{result.quiz.category}</p>
            </div>
            
            <div className="card-body p-4">
              {/* Score Display */}
              <div className="text-center mb-4">
                <div className="d-inline-block position-relative">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      background: `conic-gradient(#28a745 0deg ${result.percentage * 3.6}deg, #e9ecef ${result.percentage * 3.6}deg 360deg)`,
                      padding: '8px'
                    }}
                  >
                    <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" 
                         style={{ width: '100%', height: '100%' }}>
                      <span className={`h2 mb-0 fw-bold ${getScoreColor(result.percentage)}`}>
                        {result.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="row text-center">
                  <div className="col-6 col-md-3 mb-3">
                    <div className="border rounded p-3">
                      <div className={`h4 mb-1 ${getScoreColor(result.percentage)}`}>
                        {result.correctAnswers}
                      </div>
                      <small className="text-muted">Correct</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <div className="border rounded p-3">
                      <div className="h4 mb-1 text-danger">
                        {result.totalQuestions - result.correctAnswers}
                      </div>
                      <small className="text-muted">Incorrect</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <div className="border rounded p-3">
                      <div className="h4 mb-1 text-info">
                        <Clock size={20} className="me-1" />
                        {formatTime(result.timeSpent)}
                      </div>
                      <small className="text-muted">Time Spent</small>
                    </div>
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <div className="border rounded p-3">
                      <div className="h4 mb-1 text-primary">
                        #{result.attemptNumber}
                      </div>
                      <small className="text-muted">Attempt</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              {userAttempts.length > 1 && (
                <div className="bg-light rounded p-3 mb-4">
                  <h6 className="mb-3">
                    <TrendingUp size={18} className="me-2 text-primary" />
                    Your Performance
                  </h6>
                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <small className="text-muted d-block">Best Score</small>
                      <span className="fw-semibold text-success">
                        {Math.max(...userAttempts.map(a => a.percentage))}%
                      </span>
                    </div>
                    <div className="col-md-4 mb-2">
                      <small className="text-muted d-block">Total Attempts</small>
                      <span className="fw-semibold">{userAttempts.length}</span>
                    </div>
                    <div className="col-md-4 mb-2">
                      <small className="text-muted d-block">Improvement</small>
                      <span className="fw-semibold text-info">
                        {userAttempts.length > 1 
                          ? `${result.percentage - userAttempts[1].percentage > 0 ? '+' : ''}${result.percentage - userAttempts[1].percentage}%`
                          : 'First attempt'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-2 justify-content-center">
                <button 
                  className="btn btn-primary"
                  onClick={handleRetakeQuiz}
                >
                  <RotateCcw size={18} className="me-2" />
                  Take Again
                </button>
                
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <Target size={18} className="me-2" />
                  {showDetails ? 'Hide' : 'View'} Details
                </button>
                
                <button 
                  className="btn btn-outline-secondary"
                  onClick={handleShareResult}
                >
                  <Share2 size={18} className="me-2" />
                  Share
                </button>
                
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/')}
                >
                  <Home size={18} className="me-2" />
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      {showDetails && result.detailedResults && (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow">
              <div className="card-header">
                <h5 className="mb-0">Question by Question Review</h5>
              </div>
              <div className="card-body">
                {result.detailedResults.map((item, index) => (
                  <div key={item.questionId} className="border rounded p-3 mb-3">
                    <div className="d-flex align-items-start mb-2">
                      <div className="me-3">
                        {item.isCorrect ? (
                          <CheckCircle size={20} className="text-success" />
                        ) : (
                          <XCircle size={20} className="text-danger" />
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-2">Question {index + 1}</h6>
                        <p className="mb-2">{item.question}</p>
                        
                        <div className="small">
                          <div className="mb-1">
                            <strong>Your Answer:</strong>
                            <span className={`ms-2 badge ${item.isCorrect ? 'bg-success' : 'bg-danger'}`}>
                              {item.userAnswer} - {item.options[['A', 'B', 'C', 'D'].indexOf(item.userAnswer)]}
                            </span>
                          </div>
                          
                          {!item.isCorrect && (
                            <div className="mb-1">
                              <strong>Correct Answer:</strong>
                              <span className="ms-2 badge bg-success">
                                {item.correctAnswer} - {item.options[['A', 'B', 'C', 'D'].indexOf(item.correctAnswer)]}
                              </span>
                            </div>
                          )}
                          
                          <div className="text-muted">
                            Time spent: {formatTime(item.timeSpent || 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Previous Attempts */}
      {userAttempts.length > 1 && (
        <div className="row justify-content-center mt-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow">
              <div className="card-header">
                <h5 className="mb-0">
                  <Award size={18} className="me-2 text-primary" />
                  Your Previous Attempts
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Attempt</th>
                        <th>Score</th>
                        <th>Time</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userAttempts.map((attempt) => (
                        <tr key={attempt.attemptId}>
                          <td>#{attempt.attemptNumber}</td>
                          <td>
                            <span className={`badge ${getScoreBadgeClass(attempt.percentage)}`}>
                              {attempt.percentage}%
                            </span>
                          </td>
                          <td>{formatTime(attempt.timeSpent)}</td>
                          <td>{new Date(attempt.completedAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}