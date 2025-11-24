import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, Flag, AlertCircle } from 'lucide-react';
import { getQuizById } from '../services/api';
import { submitQuizAttempt } from '../services/quizApi';

export default function TakeQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [startTime] = useState(new Date());

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await getQuizById(quizId);
        
        if (response.data.success) {
          const quizData = response.data.quiz;
          setQuiz(quizData);
          setTimeLeft((quizData.duration || 30) * 60); // Convert to seconds
        } else {
          setError('Quiz not found');
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !submitting) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
        setTimeSpent(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, submitting]);

  const handleTimeUp = useCallback(async () => {
    console.log('Time is up! Auto-submitting...');
    await handleSubmitQuiz(true);
  }, []);

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: {
        selectedAnswer: answer, // Now stores the actual option text
        timeSpent: Math.floor((new Date() - startTime) / 1000)
      }
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionJump = (index) => {
    setCurrentQuestion(index);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / ((quiz?.duration || 30) * 60)) * 100;
    if (percentage > 50) return 'text-success';
    if (percentage > 25) return 'text-warning';
    return 'text-danger';
  };

  const getAnsweredCount = () => {
    return Object.keys(userAnswers).length;
  };

  const handleSubmitQuiz = async (timeLimitExceeded = false) => {
    if (submitting) return;

    try {
      setSubmitting(true);
      
      // Prepare answers for submission
      const formattedAnswers = quiz.questions.map(question => {
        const userAnswer = userAnswers[question._id];
        return {
          questionId: question._id,
          selectedAnswer: userAnswer?.selectedAnswer || '',
          timeSpent: userAnswer?.timeSpent || 0
        };
      }).filter(answer => answer.selectedAnswer !== ''); // Only include answered questions

      const totalTimeSpent = Math.floor((new Date() - startTime) / 1000);

      const response = await submitQuizAttempt(quizId, {
        userAnswers: formattedAnswers,
        timeSpent: totalTimeSpent,
        timeLimitExceeded
      });

      if (response.data.success) {
        // Navigate to results page
        navigate(`/quiz-result/${response.data.result.attemptId}`, {
          state: { result: response.data.result }
        });
      } else {
        setError('Failed to submit quiz');
        setSubmitting(false);
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz: ' + err.message);
      setSubmitting(false);
    }
  };

  const handleSubmitClick = () => {
    const unanswered = quiz.questions.length - getAnsweredCount();
    if (unanswered > 0) {
      setShowConfirmSubmit(true);
    } else {
      handleSubmitQuiz();
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h5>Error Loading Quiz</h5>
          <p className="mb-3">{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h5>Quiz Not Found</h5>
          <p className="mb-3">The requested quiz could not be found.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="h3 mb-1">{quiz.title}</h1>
          <p className="text-muted mb-0">{quiz.category} • {quiz.questions.length} Questions</p>
        </div>
        <div className="col-md-4 text-md-end">
          <div className="d-flex align-items-center justify-content-md-end gap-3">
            <div className={`h5 mb-0 ${getTimeColor()}`}>
              <Clock size={20} className="me-2" />
              {formatTime(timeLeft)}
            </div>
            <span className="badge bg-primary">
              {getAnsweredCount()}/{quiz.questions.length} Answered
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Quiz Content */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </h6>
                <div className="progress" style={{ width: '200px', height: '8px' }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ 
                      width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="card-body p-4">
              <h5 className="card-title mb-4">{currentQuestionData.questionText || currentQuestionData.question}</h5>
              
              <div className="list-group list-group-flush">
                {currentQuestionData.options.map((option, index) => {
                  const optionKey = ['A', 'B', 'C', 'D'][index];
                  const isSelected = userAnswers[currentQuestionData._id]?.selectedAnswer === option;
                  
                  return (
                    <div
                      key={index}
                      className={`list-group-item list-group-item-action border rounded mb-2 cursor-pointer ${
                        isSelected ? 'bg-primary text-white' : ''
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestionData._id, option)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center">
                        <div 
                          className={`me-3 rounded-circle d-flex align-items-center justify-content-center ${
                            isSelected ? 'bg-white text-primary' : 'bg-light'
                          }`}
                          style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 'bold' }}
                        >
                          {optionKey}
                        </div>
                        <span>{option}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="card-footer bg-light border-0 py-3">
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-outline-secondary"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft size={20} className="me-1" />
                  Previous
                </button>
                
                {currentQuestion < quiz.questions.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleNextQuestion}
                  >
                    Next
                    <ChevronRight size={20} className="ms-1" />
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={handleSubmitClick}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Flag size={20} className="me-1" />
                        Submit Quiz
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0 py-3">
              <h6 className="mb-0">Question Navigator</h6>
            </div>
            <div className="card-body p-3">
              <div className="row g-2">
                {quiz.questions.map((_, index) => {
                  const isAnswered = userAnswers[quiz.questions[index]._id];
                  const isCurrent = index === currentQuestion;
                  
                  return (
                    <div key={index} className="col-3">
                      <button
                        className={`btn w-100 btn-sm ${
                          isCurrent 
                            ? 'btn-primary' 
                            : isAnswered 
                            ? 'btn-success' 
                            : 'btn-outline-secondary'
                        }`}
                        onClick={() => handleQuestionJump(index)}
                        style={{ aspectRatio: '1' }}
                      >
                        {index + 1}
                      </button>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-3 pt-3 border-top">
                <div className="small text-muted">
                  <div className="d-flex align-items-center mb-2">
                    <div className="bg-success rounded me-2" style={{ width: '12px', height: '12px' }}></div>
                    Answered ({getAnsweredCount()})
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <div className="bg-primary rounded me-2" style={{ width: '12px', height: '12px' }}></div>
                    Current
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="border rounded me-2" style={{ width: '12px', height: '12px' }}></div>
                    Not answered ({quiz.questions.length - getAnsweredCount()})
                  </div>
                </div>
              </div>
              
              <button
                className="btn btn-warning w-100 mt-3"
                onClick={handleSubmitClick}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Flag size={18} className="me-1" />
                    Submit Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <AlertCircle className="me-2 text-warning" size={20} />
                  Confirm Submission
                </h5>
              </div>
              <div className="modal-body">
                <p>You have <strong>{quiz.questions.length - getAnsweredCount()} unanswered questions</strong>.</p>
                <p className="mb-0">Are you sure you want to submit the quiz? You won't be able to change your answers after submission.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmSubmit(false)}
                >
                  Continue Quiz
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => {
                    setShowConfirmSubmit(false);
                    handleSubmitQuiz();
                  }}
                  disabled={submitting}
                >
                  Submit Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}