import QuizCard from './QuizCard';
import { useState, useEffect } from 'react';
import { getQuizzes } from '../services/api';

// QuizGrid Component
export default function QuizGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quizzes from API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await getQuizzes();
        if (response.data.success) {
          setQuizzes(response.data.quizzes);
        } else {
          setError('Failed to load quizzes');
        }
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Get unique categories from quizzes
  const categories = ['All', ...new Set(quizzes.map(quiz => quiz.category))];

  const filteredQuizzes = selectedCategory === 'All' 
    ? quizzes 
    : quizzes.filter(quiz => quiz.category === selectedCategory);

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning text-center">
          <h5>Unable to load quizzes</h5>
          <p className="mb-0">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark mb-3">Popular Quizzes</h2>
        <p className="text-muted mb-4">Test your knowledge with our curated collection of quizzes</p>

        {/* Filter Tabs */}
        {categories.length > 1 && (
          <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'} btn-sm px-3`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="row">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))
        ) : (
          <div className="col-12">
            <div className="text-center py-5">
              <h5 className="text-muted">No quizzes available</h5>
              <p className="text-muted">
                {selectedCategory === 'All' 
                  ? 'No quizzes have been created yet.' 
                  : `No quizzes found in "${selectedCategory}" category.`
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quiz count */}
      {filteredQuizzes.length > 0 && (
        <div className="text-center mt-4">
          <p className="text-muted">
            Showing {filteredQuizzes.length} of {quizzes.length} quiz{quizzes.length !== 1 ? 'es' : ''}
          </p>
        </div>
      )}
    </div>
  );
}