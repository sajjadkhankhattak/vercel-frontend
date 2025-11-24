import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthDebugger = () => {
  try {
    const auth = useAuth();
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        background: 'green', 
        color: 'white', 
        padding: '5px', 
        zIndex: 9999,
        fontSize: '12px'
      }}>
        ✅ AuthProvider Working
        <br />
        User: {auth.user ? auth.user.firstName : 'None'}
        <br />
        Token: {auth.token ? 'Yes' : 'No'}
      </div>
    );
  } catch (error) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        background: 'red', 
        color: 'white', 
        padding: '5px', 
        zIndex: 9999,
        fontSize: '12px'
      }}>
        ❌ AuthProvider Error: {error.message}
      </div>
    );
  }
};

export default AuthDebugger;