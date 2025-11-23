import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PremiumButton.css';

const PremiumButton = ({ 
  amount = 9.99, 
  itemName = "Premium Quiz Access",
  description = "Unlock premium quizzes and features",
  className = "",
  children,
  size = "medium"
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/checkout', {
      state: {
        amount,
        itemName,
        description
      }
    });
  };

  const sizeClasses = {
    small: 'premium-btn-small',
    medium: 'premium-btn-medium',
    large: 'premium-btn-large'
  };

  return (
    <button 
      onClick={handleUpgrade}
      className={`premium-button ${sizeClasses[size]} ${className}`}
    >
      {children || (
        <>
          <span className="premium-icon">⭐</span>
          Upgrade to Premium
        </>
      )}
    </button>
  );
};

export default PremiumButton;