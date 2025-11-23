import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Save } from 'lucide-react';
import { createQuiz } from '../../services/api.js';

export default function AddQuiz() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([...questions, {
      id: Date.now(),
      text: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);

      // Validate questions
      if (questions.length === 0) {
        setError('At least one question is required');
        return;
      }

      // Transform questions to match backend format
      const formattedQuestions = questions.map(q => ({
        questionText: q.text,
        options: q.options,
        correctAnswer: q.options[q.correctAnswer]
      }));

      const quizData = {
        title: data.title,
        description: data.description,
        category: data.category,
        questions: formattedQuestions
      };

      const response = await createQuiz(quizData);

      if (response.data.success) {
        alert('Quiz created successfully!');
        reset();
        setQuestions([]);
        navigate('/admin/view'); // Redirect to view quizzes page
      } else {
        setError('Failed to create quiz');
      }
    } catch (err) {
      setError('Error creating quiz: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Add New Quiz</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Quiz Title *</label>
              <input
                type="text"
                className={`form-control ${errors.title && 'is-invalid'}`}
                {...register('title', { required: 'Quiz title is required' })}
              />
              {errors.title && (
                <div className="invalid-feedback">{errors.title.message}</div>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Category *</label>
              <select
                className={`form-control ${errors.category && 'is-invalid'}`}
                {...register('category', { required: 'Category is required' })}
              >
                <option value="">Select Category</option>
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="General Knowledge">General Knowledge</option>
              </select>
              {errors.category && (
                <div className="invalid-feedback">{errors.category.message}</div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            {...register('description')}
          />
        </div>

        {/* Questions Section */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Questions</h5>
            <button type="button" className="btn btn-primary btn-sm" onClick={addQuestion}>
              <Plus size={16} className="me-1" />
              Add Question
            </button>
          </div>

          {questions.map((question, index) => (
            <div key={question.id} className="card mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span>Question {index + 1}</span>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeQuestion(question.id)}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Question Text *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                    placeholder="Enter your question"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Options *</label>
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="input-group mb-2">
                      <div className="input-group-text">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          checked={question.correctAnswer === optIndex}
                          onChange={() => updateQuestion(question.id, 'correctAnswer', optIndex)}
                          className="form-check-input mt-0"
                        />
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={option}
                        onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                        placeholder={`Option ${optIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {questions.length === 0 && (
            <div className="text-center py-4 border rounded">
              <p className="text-muted">No questions added yet</p>
              <button type="button" className="btn btn-primary" onClick={addQuestion}>
                <Plus size={16} className="me-1" />
                Add First Question
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-danger mb-3">
            {error}
          </div>
        )}

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Creating...
              </>
            ) : (
              <>
                <Save size={18} className="me-2" />
                Create Quiz
              </>
            )}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => reset()}>
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}