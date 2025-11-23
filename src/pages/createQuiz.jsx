import { useState, useRef } from 'react';
import { Upload, Plus, X, FileText, Clock, Tag, Image, BookOpen } from 'lucide-react';
import { createQuiz } from '../services/api'; // Import the API function
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CreateQuiz = () => {
  // Refs for DOM access and values
  const titleInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const notesInputRef = useRef(null);
  const tagInputRef = useRef(null);
  const questionInputRef = useRef(null);
  const formRef = useRef(null);
  
  // Ref for tracking previous question count
  const prevQuestionCountRef = useRef(0);
  
  // Ref for storing timer (if needed for auto-save)
  const autoSaveTimerRef = useRef(null);

  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    category: '',
    tags: [],
    duration: 30,
    difficulty: 'medium',
    image: null,
    notes: null,
    questions: []
  });

  const [newTag, setNewTag] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    points: 1
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Mathematics',
    'Science',
    'History',
    'Geography',
    'Sports',
    'Entertainment',
    'Technology',
    'Literature',
    'Art',
    'General Knowledge'
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'hard', label: 'Hard', color: 'danger' }
  ];

  // Focus title input - useful for UX
  const focusTitleInput = () => {
    titleInputRef.current?.focus();
  };

  // Handle file upload with ref
  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerNotesUpload = () => {
    notesInputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-save functionality (debounced)
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      console.log('Auto-saving quiz...');
      // In real app, you would save to localStorage or backend
    }, 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setQuizData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotesUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        alert('Please upload PDF or Word documents only');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        return;
      }

      setQuizData(prev => ({
        ...prev,
        notes: file
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !quizData.tags.includes(newTag.trim())) {
      setQuizData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      // Focus back on tag input for quick addition
      tagInputRef.current?.focus();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setQuizData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleQuestionChange = (value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      question: value
    }));
  };

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[optionIndex] = value;
    setCurrentQuestion(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleAddQuestion = () => {
    if (currentQuestion.question.trim() && currentQuestion.options.every(opt => opt.trim())) {
      // Store previous count before update
      prevQuestionCountRef.current = quizData.questions.length;
      
      setQuizData(prev => ({
        ...prev,
        questions: [...prev.questions, { ...currentQuestion }]
      }));
      
      setCurrentQuestion({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 1
      });
      
      // Focus back on question input for next question
      questionInputRef.current?.focus();
    }
  };

  const handleRemoveQuestion = (index) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  // Scroll to newly added question
  const scrollToNewQuestion = () => {
    if (quizData.questions.length > prevQuestionCountRef.current) {
      const questionsContainer = document.getElementById('questions-list');
      if (questionsContainer) {
        const lastQuestion = questionsContainer.lastElementChild;
        lastQuestion?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  // Update ref when questions change and scroll to new one
  useState(() => {
    scrollToNewQuestion();
  }, [quizData.questions.length]);

  // SEND QUIZ DATA TO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Clear any pending auto-save
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      // Validate required fields
      if (!quizData.title.trim()) {
        alert('Please enter a quiz title');
        return;
      }
      
      if (!quizData.category) {
        alert('Please select a category');
        return;
      }
      
      if (quizData.questions.length === 0) {
        alert('Please add at least one question');
        return;
      }

      console.log('Sending quiz data to backend:', quizData);
      
      // Prepare data for backend
      const quizDataForBackend = {
        title: quizData.title,
        description: quizData.description,
        category: quizData.category,
        tags: quizData.tags,
        duration: quizData.duration,
        difficulty: quizData.difficulty,
        questions: quizData.questions,
        // For files, you might need to handle them differently
        // image: quizData.image, // Base64 string
        // notes: quizData.notes, // File object
      };

      // Send to backend using API service
      const response = await createQuiz(quizDataForBackend);
      
      console.log('✅ Backend response:', response.data);
      alert('✅ Quiz created successfully!');
      
      // Reset form
      setQuizData({
        title: '',
        description: '',
        category: '',
        tags: [],
        duration: 30,
        difficulty: 'medium',
        image: null,
        notes: null,
        questions: []
      });
      
      // Focus back on title for new quiz
      focusTitleInput();
      
    } catch (error) {
      console.error('❌ Quiz creation error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create quiz. Please try again.';
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup on unmount
  useState(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="container py-4">
      <Navbar />
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="fw-bold text-dark mb-3">Create New Quiz</h1>
            <p className="text-muted">Design your perfect quiz with images, notes, and engaging questions</p>
            <button 
              type="button" 
              onClick={focusTitleInput}
              className="btn btn-outline-secondary btn-sm"
            >
              Focus on Title
            </button>
          </div>

          <form ref={formRef} onSubmit={handleSubmit}>
            {/* Basic Information Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-semibold text-dark mb-4 d-flex align-items-center">
                  <BookOpen size={20} className="me-2" />
                  Basic Information
                </h5>

                <div className="row">
                  {/* Quiz Title */}
                  <div className="col-md-8 mb-3">
                    <label htmlFor="title" className="form-label fw-medium text-dark">
                      Quiz Title *
                    </label>
                    <input
                      ref={titleInputRef}
                      type="text"
                      className="form-control py-2"
                      id="title"
                      name="title"
                      value={quizData.title}
                      onChange={handleInputChange}
                      placeholder="Enter an engaging quiz title"
                      required
                    />
                  </div>

                  {/* Duration */}
                  <div className="col-md-4 mb-3">
                    <label htmlFor="duration" className="form-label fw-medium text-dark d-flex align-items-center">
                      <Clock size={16} className="me-2" />
                      Duration (min) *
                    </label>
                    <input
                      type="number"
                      className="form-control py-2"
                      id="duration"
                      name="duration"
                      value={quizData.duration}
                      onChange={handleInputChange}
                      min="1"
                      max="180"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label fw-medium text-dark">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={quizData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what this quiz is about..."
                  ></textarea>
                </div>

                <div className="row">
                  {/* Category */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="category" className="form-label fw-medium text-dark">
                      Category *
                    </label>
                    <select
                      className="form-select py-2"
                      id="category"
                      name="category"
                      value={quizData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="difficulty" className="form-label fw-medium text-dark">
                      Difficulty Level *
                    </label>
                    <select
                      className="form-select py-2"
                      id="difficulty"
                      name="difficulty"
                      value={quizData.difficulty}
                      onChange={handleInputChange}
                      required
                    >
                      {difficulties.map(diff => (
                        <option key={diff.value} value={diff.value}>
                          {diff.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-3">
                  <label className="form-label fw-medium text-dark d-flex align-items-center">
                    <Tag size={16} className="me-2" />
                    Tags
                  </label>
                  <div className="d-flex gap-2 mb-2">
                    <input
                      ref={tagInputRef}
                      type="text"
                      className="form-control py-2"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary d-flex align-items-center"
                      onClick={handleAddTag}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {quizData.tags.map((tag, index) => (
                      <span key={index} className="badge bg-primary bg-opacity-10 text-primary d-flex align-items-center">
                        {tag}
                        <button
                          type="button"
                          className="btn-close btn-close-sm ms-1"
                          onClick={() => handleRemoveTag(tag)}
                        ></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Media Upload Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-semibold text-dark mb-4">Media & Resources</h5>

                <div className="row">
                  {/* Image Upload */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-medium text-dark d-flex align-items-center">
                      <Image size={16} className="me-2" />
                      Quiz Cover Image
                    </label>
                    <div className="border rounded p-4 text-center">
                      {quizData.image ? (
                        <div className="position-relative">
                          <img
                            src={quizData.image}
                            alt="Quiz preview"
                            className="img-fluid rounded mb-2"
                            style={{ maxHeight: '150px' }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0"
                            onClick={() => setQuizData(prev => ({ ...prev, image: null }))}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload size={48} className="text-muted mb-2" />
                          <p className="text-muted small mb-2">Upload a cover image for your quiz</p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="d-none"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <label
                        htmlFor="imageUpload"
                        className="btn btn-outline-primary btn-sm"
                        onClick={triggerImageUpload}
                      >
                        Choose Image
                      </label>
                    </div>
                  </div>

                  {/* Notes Upload */}
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-medium text-dark d-flex align-items-center">
                      <FileText size={16} className="me-2" />
                      Study Notes (PDF/DOC)
                    </label>
                    <div className="border rounded p-4 text-center">
                      {quizData.notes ? (
                        <div className="text-center">
                          <FileText size={48} className="text-success mb-2" />
                          <p className="text-dark small mb-1">{quizData.notes.name}</p>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => setQuizData(prev => ({ ...prev, notes: null }))}
                          >
                            Remove File
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload size={48} className="text-muted mb-2" />
                          <p className="text-muted small mb-2">Upload related study materials</p>
                        </div>
                      )}
                      <input
                        ref={notesInputRef}
                        type="file"
                        className="d-none"
                        id="notesUpload"
                        accept=".pdf,.doc,.docx"
                        onChange={handleNotesUpload}
                      />
                      <label
                        htmlFor="notesUpload"
                        className="btn btn-outline-primary btn-sm"
                        onClick={triggerNotesUpload}
                      >
                        Choose File
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Card */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="fw-semibold text-dark mb-4">Quiz Questions</h5>

                {/* Add Question Form */}
                <div className="border rounded p-4 mb-4">
                  <h6 className="fw-semibold text-dark mb-3">Add New Question</h6>
                  
                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Question</label>
                    <input
                      ref={questionInputRef}
                      type="text"
                      className="form-control py-2"
                      value={currentQuestion.question}
                      onChange={(e) => handleQuestionChange(e.target.value)}
                      placeholder="Enter your question"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Options</label>
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="input-group mb-2">
                        <div className="input-group-text">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={currentQuestion.correctAnswer === index}
                            onChange={() => setCurrentQuestion(prev => ({
                              ...prev,
                              correctAnswer: index
                            }))}
                            className="form-check-input mt-0"
                          />
                        </div>
                        <input
                          type="text"
                          className="form-control py-2"
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark">Points</label>
                    <input
                      type="number"
                      className="form-control py-2"
                      value={currentQuestion.points}
                      onChange={(e) => setCurrentQuestion(prev => ({
                        ...prev,
                        points: parseInt(e.target.value) || 1
                      }))}
                      min="1"
                      max="10"
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center"
                    onClick={handleAddQuestion}
                    disabled={!currentQuestion.question.trim() || currentQuestion.options.some(opt => !opt.trim())}
                  >
                    <Plus size={16} className="me-2" />
                    Add Question
                  </button>
                </div>

                {/* Questions List */}
                <div id="questions-list">
                  <h6 className="fw-semibold text-dark mb-3">
                    Added Questions ({quizData.questions.length})
                  </h6>
                  
                  {quizData.questions.length === 0 ? (
                    <p className="text-muted text-center py-4">No questions added yet</p>
                  ) : (
                    quizData.questions.map((question, index) => (
                      <div key={index} className="border rounded p-3 mb-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-semibold text-dark mb-0">
                            Q{index + 1}: {question.question}
                          </h6>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleRemoveQuestion(index)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="row">
                          <div className="col-md-8">
                            <p className="small text-muted mb-1">Options:</p>
                            <ul className="small mb-2">
                              {question.options.map((opt, optIndex) => (
                                <li key={optIndex} className={optIndex === question.correctAnswer ? 'text-success fw-semibold' : ''}>
                                  {opt} {optIndex === question.correctAnswer && '(Correct)'}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="col-md-4">
                            <p className="small text-muted mb-0">Points: {question.points}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary btn-lg px-5 py-2"
                disabled={quizData.questions.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating Quiz...
                  </>
                ) : (
                  'Create Quiz'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateQuiz;