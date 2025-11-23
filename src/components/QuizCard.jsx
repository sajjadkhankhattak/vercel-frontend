import { Play, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// QuizCard Component
export default function QuizCard({ id, category, title, image, duration = 5, players = 1200 }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/quiz/${id}`);
  };
  return (
    <div className="col-md-4 mb-4">
      <div
        className="card h-100 border-0 shadow-sm hover-shadow transition-all pointer"
        onClick={handleCardClick}
        style={{ cursor: 'pointer' }}>
        <div className="position-relative">
          <img
            src={image}
            className="card-img-top"
            alt={title}
            style={{ height: '180px', objectFit: 'cover' }}
          />
          <div className="position-absolute top-0 end-0 m-3">
            <span className="badge bg-dark bg-opacity-75 text-white px-2 py-1">
              <Play size={14} className="me-1" />
              Play
            </span>
          </div>
        </div>

        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-2">
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 small">
              {category}
            </span>
          </div>

          <h6 className="card-title fw-semibold text-dark mb-3 line-clamp-2">
            {title}
          </h6>

          <div className="d-flex justify-content-between align-items-center text-muted small">
            <div className="d-flex align-items-center">
              <Clock size={14} className="me-1" />
              <span>5 min</span>
            </div>
            <div className="d-flex align-items-center">
              <Users size={14} className="me-1" />
              <span>1.2k played</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}