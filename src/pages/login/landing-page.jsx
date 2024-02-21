import React from 'react';
import '../../styles/main.css';
import MainContent from './login-page';

// Define the LandingPage component
const LandingPage = () => {
  return (
    <div className="grid">
      <main>
        <MainContent />
      </main>
    </div>
  );
};

// Export the LandingPage component
export default LandingPage;
