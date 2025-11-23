import { GraduationCap, Search } from 'lucide-react';

export default function Hero() {
  return (
    <div className="bg-light py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="display-6 fw-bold mb-3">
            Take <span style={{ color: '#f97316' }}>Quizzes</span>, Learn & Have Fun! <span>😊</span>
          </h1>
          <p className="lead text-muted">
            Test your knowledge or <a href="#" className="text-decoration-none">create your own quiz</a> adventure.
          </p>
        </div>

        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <GraduationCap className="text-primary me-2" size={24} />
            <span className="text-primary fw-semibold">📘 What would you like to learn today?</span>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="input-group input-group-lg">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Quizzes"
                />
                <button className="btn btn-outline-secondary" type="button">
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center gap-3 mb-4">
          <button className="btn btn-light border active">
            📝 Quiz
          </button>
          <button className="btn btn-light border">
            🎯 Trivia
          </button>
          <button className="btn btn-light border">
            🎓 Lesson
          </button>
        </div>
      </div>
    </div>
  );
}
