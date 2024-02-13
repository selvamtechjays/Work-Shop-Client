import React from "react";
import "./landingPage.css";
import NavbarLinks from "./navLinks";
import MainContent from "./landingMainContent";

const LandingPage = () => {
  return (
    <div className="grid">
    
      <main>
        <MainContent />
      </main>
    </div>
  );
};

export default LandingPage;