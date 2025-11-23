import { useState, useEffect } from 'react';
import { Eye, Search, Filter, Download } from 'lucide-react';
import { getQuizzes } from '../../services/api.js';

export default function ViewQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Fetch quizzes from API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const response = await getQuizzes();
        if (response.data.success) {
          // Transform data to match table format
          const transformedQuizzes = response.data.quizzes.map(quiz => ({
            id: quiz._id,
            title: quiz.title,
            category: quiz.category,
            questions: quiz.questions.length,
            created: new Date(quiz.createdAt).toLocaleDateString(),
            status: 'Active' // Assuming all quizzes are active
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
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterCategory === 'all' || quiz.category === filterCategory)
  );

  const categories = ['all', ...new Set(quizzes.map(quiz => quiz.category))];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>View Quizzes</h2>
        <button className="btn btn-outline-primary d-flex align-items-center">
          <Download size={18} className="me-2" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={18} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quizzes Table */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading quizzes...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">
              {error}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Questions</th>
                    <th>Created</th>
                    <th>Status</th>
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
                        <span className={`badge ${quiz.status === 'Active' ? 'bg-success' : 'bg-warning'}`}>
                          {quiz.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && filteredQuizzes.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No quizzes found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}