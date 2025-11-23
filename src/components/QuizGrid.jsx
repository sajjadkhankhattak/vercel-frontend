import QuizCard from './QuizCard';
import { useState } from 'react';

// QuizGrid Component
export default function QuizGrid() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const quizzes = [
    {
      id: 1,
      category: 'Quaid e Azam',
      title: 'A Quiz To Test Your Knowledge About Quaid e Azam!',
      image: 'https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg?auto=compress&cs=tinysrgb&w=800',
      duration: 10,
      players: 1500,
      description: 'Test your knowledge about the founder of Pakistan, Muhammad Ali Jinnah, and his remarkable life and achievements.',
      difficulty: 'Medium',
      questions: 15
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
      questions: 10
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
      questions: 32
    },
    // Add more quizzes with IDs...
  ];

  const categories = ['All', 'History', 'Sports', 'Entertainment', 'Trivia',
    'Science', 'Geography', 'Math', 'Literature', 'Art',
    'Technology', 'Music', 'Movies', 'Politics', 'Nature',
    'Health', 'Business', 'Education', 'Culture', 'Food',
    'Travel', 'Languages', 'Philosophy', 'Religion'
  ];

  const filteredQuizzes = selectedCategory === 'All' 
    ? quizzes 
    : quizzes.filter(quiz => quiz.category.toLowerCase().includes(selectedCategory.toLowerCase()));


  return (
    <div className="container py-4">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark mb-3">Popular Quizzes</h2>
        <p className="text-muted mb-4">Test your knowledge with our curated collection of quizzes</p>

        {/* Filter Tabs */}
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
      </div>

      <div className="row">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz.id} {...quiz} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-5">
        <button className="btn btn-outline-primary px-4 py-2">
          Load More Quizzes
        </button>
      </div>
    </div>
  );
}