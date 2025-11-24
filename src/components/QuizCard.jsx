import { Play, Clock, Users, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// QuizCard Component
export default function QuizCard({ quiz }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/quiz/${quiz._id}`);
  };

  // Use quiz image from database or fallback to default
  const getQuizImage = () => {
    if (quiz.image) {
      return quiz.image; // This will be base64 string from database
    }
    // Fallback to default based on category
    const defaultImages = {
      'Programming': '/images/programming.jpg',
      'Web Development': '/images/webdev.jpg',
      'Science': '/images/science.jpg',
      'Mathematics': '/images/math.jpg',
      'General Knowledge': '/images/general.jpg'
    };
    return defaultImages[quiz.category] || '/images/default-quiz.jpg';
  };

  return (
    <div className="col-md-4 mb-4">
      <div
        className="card h-100 border-0 shadow-sm hover-shadow transition-all pointer"
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}>
        <div className="position-relative">
          <img
            src={getQuizImage()}
            className="card-img-top"
            alt={quiz.title}
            style={{ height: '180px', objectFit: 'cover' }}
            onError={(e) => {
              // Fallback if image fails to load
              e.target.src = '/images/default-quiz.jpg';
            }}
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
}