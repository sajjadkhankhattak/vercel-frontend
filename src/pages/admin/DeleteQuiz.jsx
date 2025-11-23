import { useState, useEffect } from 'react';
import { Search, Trash2, AlertTriangle, X, Check } from 'lucide-react';
import { getQuizzes, deleteQuiz } from '../../services/api.js';

export default function DeleteQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch quizzes from API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await getQuizzes();
        if (response.data.success) {
          // Transform data to match component format
          const transformedQuizzes = response.data.quizzes.map(quiz => ({
            id: quiz._id,
            title: quiz.title,
            category: quiz.category,
            questions: quiz.questions.length,
            created: new Date(quiz.createdAt).toLocaleDateString()
          }));
          setQuizzes(transformedQuizzes);
        } else {
          setError('Failed to fetch quizzes');
        }
      } catch (err) {
        setError('Error fetching quizzes: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (quiz) => {
    setQuizToDelete(quiz);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (quizToDelete) {
      try {
        setDeleting(true);
        setError(null);

        const response = await deleteQuiz(quizToDelete.id);

        if (response.data.success) {
          // Remove from local state
          setQuizzes(quizzes.filter(q => q.id !== quizToDelete.id));
          setShowDeleteModal(false);
          setQuizToDelete(null);
          alert('Quiz deleted successfully!');
        } else {
          setError('Failed to delete quiz');
        }
      } catch (err) {
        setError('Error deleting quiz: ' + err.message);
      } finally {
        setDeleting(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setQuizToDelete(null);
  };

  return (
    <div>
      <h2 className="mb-4">Delete Quiz</h2>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading quizzes...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="alert alert-warning">
            <AlertTriangle size={18} className="me-2" />
            <strong>Warning:</strong> Deleting a quiz is permanent and cannot be undone.
          </div>

      {/* Search */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search quizzes to delete..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Questions</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuizzes.map(quiz => (
                  <tr key={quiz.id}>
                    <td>{quiz.title}</td>
                    <td>
                      <span className="badge bg-secondary">{quiz.category}</span>
                    </td>
                    <td>{quiz.questions}</td>
                    <td>{quiz.created}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteClick(quiz)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredQuizzes.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No quizzes found</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && quizToDelete && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <AlertTriangle size={20} className="me-2" />
                  Confirm Deletion
                </h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the following quiz?</p>
                <div className="alert alert-danger">
                  <strong>{quizToDelete.title}</strong><br />
                  <small>Category: {quizToDelete.category}</small><br />
                  <small>Questions: {quizToDelete.questions}</small>
                </div>
                <p className="text-danger">
                  <strong>This action cannot be undone!</strong>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelDelete}
                >
                  <X size={18} className="me-2" />
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Check size={18} className="me-2" />
                      Delete Quiz
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )}
    </div>
  );
}