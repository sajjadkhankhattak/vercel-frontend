import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, BookOpen, Clock, Users, BarChart, ArrowLeft, FileText, Download, Send } from 'lucide-react';
import { sendQuizData } from '../services/api'; // Import API function

const QuizDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isSending, setIsSending] = useState(false);

    // Mock data - in real app, fetch from API based on ID
    const quizzes = [
        {
            id: 1,
            category: 'Quaid e Azam',
            title: 'A Quiz To Test Your Knowledge About Quaid e Azam!',
            image: 'https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg?auto=compress&cs=tinysrgb&w=800',
            duration: 10,
            players: 1500,
            description: 'Test your knowledge about the founder of Pakistan, Muhammad Ali Jinnah, and his remarkable life and achievements. This comprehensive quiz covers his early life, political career, leadership qualities, and legacy.',
            difficulty: 'Medium',
            questions: 15,
            author: 'History Enthusiast',
            createdDate: '2024-01-15',
            rating: 4.5,
            tags: ['History', 'Pakistan', 'Leadership', 'Freedom Fighter'],
            notes: {
                fileName: 'quaid_e_azam_notes.pdf',
                fileSize: '2.4 MB',
                pages: 12,
                content: 'Comprehensive study material about Quaid-e-Azam Muhammad Ali Jinnah'
            },
            statistics: {
                averageScore: 65,
                completionRate: 78,
                bestScore: 95
            }
        },
        {
            id: 2,
            category: 'Friendship',
            title: 'Best Friend Quiz: Are You Really Best Friends?',
            image: 'https://www.bing.com/th/id/OIP.t-bx7HdzFFzb29ZB_5JN8wHaE7?w=244&h=211&c=8&rs=1&qlt=90&o=6&cb=12&dpr=1.5&pid=3.1&rm=2',
            duration: 5,
            players: 8900,
            description: 'Discover how well you know your best friend with this fun and engaging friendship quiz.',
            difficulty: 'Easy',
            questions: 10,
            author: 'Friendship Expert',
            createdDate: '2024-01-20',
            rating: 4.8,
            tags: ['Relationships', 'Friendship', 'Fun', 'Personality'],
            notes: {
                fileName: 'friendship_guide.pdf',
                fileSize: '1.2 MB',
                pages: 8,
                content: 'Guide to building and maintaining strong friendships'
            },
            statistics: {
                averageScore: 82,
                completionRate: 92,
                bestScore: 98
            }
        },
        {
            id: 3,
            category: 'NFL',
            title: 'Name All NFL Teams Quiz: How Many Can You Identify?',
            image: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=800',
            duration: 8,
            players: 3200,
            description: 'Challenge yourself to identify all NFL teams and test your American football knowledge.',
            difficulty: 'Hard',
            questions: 32,
            author: 'Sports Analyst',
            createdDate: '2024-01-25',
            rating: 4.3,
            tags: ['Sports', 'Football', 'NFL', 'Teams'],
            notes: {
                fileName: 'nfl_teams_guide.pdf',
                fileSize: '3.1 MB',
                pages: 15,
                content: 'Complete guide to all NFL teams and their history'
            },
            statistics: {
                averageScore: 45,
                completionRate: 65,
                bestScore: 100
            }
        }
    ];

    // Find the specific quiz based on ID
    const quizData = quizzes.find(quiz => quiz.id === parseInt(id));

    // Function to send data to backend
    const handleSendToBackend = async () => {
        setIsSending(true);
        try {
            // Prepare data to send
            const dataToSend = {
                quizId: quizData.id,
                quizTitle: quizData.title,
                category: quizData.category,
                action: 'button_clicked',
                timestamp: new Date().toISOString(),
                message: 'Quiz details button clicked!'
            };

            console.log('Sending data to backend:', dataToSend);
            
            // Send to backend
            const response = await sendQuizData(dataToSend);
            
            console.log('✅ Backend response:', response.data);
            alert('✅ Data sent to backend successfully!');
            
        } catch (error) {
            console.error('❌ Error sending data:', error);
            alert('❌ Failed to send data to backend');
        } finally {
            setIsSending(false);
        }
    };

    // If quiz not found, show error
    if (!quizData) {
        return (
            <div className="container py-4">
                <div className="text-center">
                    <h2>Quiz Not Found</h2>
                    <p>The quiz you're looking for doesn't exist.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="btn btn-primary"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const handleStartQuiz = () => {
        navigate(`/quiz/${id}/play`);
    };

    const handleDownloadNotes = () => {
        // Simulate download
        alert(`Downloading ${quizData.notes.fileName}`);
    };

    const difficultyColor = {
        'Easy': 'success',
        'Medium': 'warning',
        'Hard': 'danger'
    };

    return (
        <div className="container py-4">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="btn btn-outline-primary d-flex align-items-center mb-4"
            >
                <ArrowLeft size={18} className="me-2" />
                Back to Quizzes
            </button>

            <div className="row">
                {/* Main Content */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body p-0">
                            {/* Quiz Header */}
                            <div className="position-relative">
                                <img
                                    src={quizData.image}
                                    alt={quizData.title}
                                    className="img-fluid w-100"
                                    style={{ height: '300px', objectFit: 'cover' }}
                                />
                                <div className="position-absolute bottom-0 start-0 p-4 text-white w-100"
                                    style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                                    <span className="badge bg-primary bg-opacity-75 mb-2">{quizData.category}</span>
                                    <h1 className="h3 fw-bold mb-2">{quizData.title}</h1>
                                    <div className="d-flex align-items-center gap-3">
                                        <span className="d-flex align-items-center">
                                            <Clock size={16} className="me-1" />
                                            {quizData.duration} min
                                        </span>
                                        <span className="d-flex align-items-center">
                                            <Users size={16} className="me-1" />
                                            {quizData.players.toLocaleString()} played
                                        </span>
                                        <span className={`badge bg-${difficultyColor[quizData.difficulty]}`}>
                                            {quizData.difficulty}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="p-4">
                                <ul className="nav nav-tabs border-0">
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === 'overview' ? 'active border-0' : 'border-0'}`}
                                            onClick={() => setActiveTab('overview')}
                                        >
                                            Overview
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === 'notes' ? 'active border-0' : 'border-0'}`}
                                            onClick={() => setActiveTab('notes')}
                                        >
                                            <FileText size={16} className="me-1" />
                                            Study Notes
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === 'stats' ? 'active border-0' : 'border-0'}`}
                                            onClick={() => setActiveTab('stats')}
                                        >
                                            <BarChart size={16} className="me-1" />
                                            Statistics
                                        </button>
                                    </li>
                                </ul>

                                {/* Tab Content */}
                                <div className="mt-4">
                                    {activeTab === 'overview' && (
                                        <div>
                                            <h5 className="fw-semibold mb-3">About This Quiz</h5>
                                            <p className="text-muted mb-4">{quizData.description}</p>

                                            {/* NEW: Send to Backend Button */}
                                            <div className="mb-4">
                                                <button
                                                    onClick={handleSendToBackend}
                                                    disabled={isSending}
                                                    className="btn btn-info d-flex align-items-center"
                                                >
                                                    <Send size={16} className="me-2" />
                                                    {isSending ? 'Sending to Backend...' : 'Send Data to Backend'}
                                                </button>
                                                <small className="text-muted d-block mt-1">
                                                    Click to test backend connection with this quiz data
                                                </small>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h6 className="fw-semibold mb-3">Quiz Details</h6>
                                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                                        <span className="text-muted">Questions</span>
                                                        <span className="fw-semibold">{quizData.questions}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                                        <span className="text-muted">Difficulty</span>
                                                        <span className={`text-${difficultyColor[quizData.difficulty]} fw-semibold`}>
                                                            {quizData.difficulty}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                                        <span className="text-muted">Author</span>
                                                        <span className="fw-semibold">{quizData.author}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between py-2 border-bottom">
                                                        <span className="text-muted">Created</span>
                                                        <span className="fw-semibold">{quizData.createdDate}</span>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <h6 className="fw-semibold mb-3">Tags</h6>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {quizData.tags.map((tag, index) => (
                                                            <span key={index} className="badge bg-light text-dark border">
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'notes' && (
                                        <div>
                                            <h5 className="fw-semibold mb-3">Study Materials</h5>
                                            <div className="card border">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <FileText size={32} className="text-primary me-3" />
                                                            <div>
                                                                <h6 className="fw-semibold mb-1">{quizData.notes.fileName}</h6>
                                                                <p className="text-muted small mb-0">
                                                                    {quizData.notes.fileSize} • {quizData.notes.pages} pages
                                                                </p>
                                                                <p className="small text-muted mb-0">{quizData.notes.content}</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={handleDownloadNotes}
                                                            className="btn btn-primary d-flex align-items-center"
                                                        >
                                                            <Download size={16} className="me-2" />
                                                            Download
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'stats' && (
                                        <div>
                                            <h5 className="fw-semibold mb-3">Quiz Statistics</h5>
                                            <div className="row text-center">
                                                <div className="col-md-4 mb-3">
                                                    <div className="card border-0 bg-light">
                                                        <div className="card-body">
                                                            <BarChart size={24} className="text-primary mb-2" />
                                                            <h4 className="fw-bold text-primary">{quizData.statistics.averageScore}%</h4>
                                                            <p className="text-muted small mb-0">Average Score</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <div className="card border-0 bg-light">
                                                        <div className="card-body">
                                                            <Users size={24} className="text-success mb-2" />
                                                            <h4 className="fw-bold text-success">{quizData.statistics.completionRate}%</h4>
                                                            <p className="text-muted small mb-0">Completion Rate</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <div className="card border-0 bg-light">
                                                        <div className="card-body">
                                                            <Play size={24} className="text-warning mb-2" />
                                                            <h4 className="fw-bold text-warning">{quizData.statistics.bestScore}%</h4>
                                                            <p className="text-muted small mb-0">Best Score</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Action Buttons */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
                        <div className="card-body p-4 text-center">
                            <div className="mb-4">
                                <h5 className="fw-semibold text-dark mb-3">Ready to Start?</h5>
                                <p className="text-muted small">
                                    {quizData.questions} questions • {quizData.duration} minutes • {quizData.difficulty} level
                                </p>
                            </div>

                            <button
                                onClick={handleStartQuiz}
                                className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center mb-3 py-3"
                            >
                                <Play size={20} className="me-2" />
                                Start Quiz
                            </button>

                            <button
                                onClick={() => setActiveTab('notes')}
                                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center py-3"
                            >
                                <BookOpen size={20} className="me-2" />
                                Read Notes First
                            </button>

                            {/* NEW: Send to Backend Button in Sidebar */}
                            <button
                                onClick={handleSendToBackend}
                                disabled={isSending}
                                className="btn btn-outline-info w-100 d-flex align-items-center justify-content-center mt-3 py-2"
                            >
                                <Send size={16} className="me-2" />
                                {isSending ? 'Sending...' : 'Test Backend'}
                            </button>

                            <div className="mt-4 pt-3 border-top">
                                <div className="row text-center">
                                    <div className="col-4">
                                        <div className="fw-bold text-dark">{quizData.questions}</div>
                                        <div className="small text-muted">Questions</div>
                                    </div>
                                    <div className="col-4">
                                        <div className="fw-bold text-dark">{quizData.duration}</div>
                                        <div className="small text-muted">Minutes</div>
                                    </div>
                                    <div className="col-4">
                                        <div className="fw-bold text-dark">{quizData.rating}/5</div>
                                        <div className="small text-muted">Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizDetails;