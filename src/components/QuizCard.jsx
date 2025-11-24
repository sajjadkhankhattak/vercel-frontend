import { Play, Clock, Users, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { memo, useCallback, useMemo } from 'react';

// QuizCard Component
const QuizCard = memo(({ quiz }) => {
  const navigate = useNavigate();

  const handleCardClick = useCallback(() => {
    navigate(`/take-quiz/${quiz._id}`);
  }, [quiz._id, navigate]);

  // Memoize quiz image to prevent recalculation
  const quizImage = useMemo(() => {
    if (quiz.image) {
      return quiz.image; // This will be base64 string from database
    }
    // Fallback to default based on category
    const defaultImages = {
      'Programming': '/images/default-quiz.svg',
      'Web Development': '/images/default-quiz.svg',
      'Science': '/images/default-quiz.svg',
      'Mathematics': '/images/default-quiz.svg',
      'General Knowledge': '/images/default-quiz.svg',
      'Technology': '/images/default-quiz.svg',
      'History': '/images/default-quiz.svg',
      'Geography': '/images/default-quiz.svg'
    };
    return defaultImages[quiz.category] || '/images/default-quiz.svg';
  }, [quiz.image, quiz.category]);

  // Memoize image error handler
  const handleImageError = useCallback((e) => {
    // Fallback if image fails to load
    console.log('Image failed to load, using default');
    e.target.src = '/images/default-quiz.svg';
    e.target.onerror = null; // Prevent infinite loop
  }, []);

  return (
    <div className="col-md-4 mb-4">
      <div
        className="card h-100 border-0 shadow-sm hover-shadow transition-all pointer"
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}>
        <div className="position-relative">
          <img
            src={quizImage}
            className="card-img-top"
            alt={quiz.title}
            style={{ height: '180px', objectFit: 'cover' }}
            onError={handleImageError}
            loading="lazy"
          />
          <div className="position-absolute top-0 end-0 m-3">
            <span className="badge bg-dark bg-opacity-75 text-white px-2 py-1">
              <Play size={14} className="me-1" />
              Play
            </span>
          </div>
          {/* Image indicator if custom image is uploaded */}
          {quiz.image && (
            <div className="position-absolute top-0 start-0 m-3">
              <span className="badge bg-success bg-opacity-75 text-white px-2 py-1" title="Custom Image">
                <ImageIcon size={12} />
              </span>
            </div>
          )}
        </div>

        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-2">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 small">
              {quiz.category}
            </span>
          </div>

          <h6 className="card-title fw-semibold text-dark mb-3 line-clamp-2">
            {quiz.title}
          </h6>

          <div className="d-flex justify-content-between align-items-center text-muted small">
            <div className="d-flex align-items-center">
              <Clock size={14} className="me-1" />
              <span>{quiz.duration || 5} min</span>
            </div>
            <div className="d-flex align-items-center">
              <Users size={14} className="me-1" />
              <span>{quiz.questions?.length || 0} questions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

QuizCard.displayName = 'QuizCard';

export default QuizCard;