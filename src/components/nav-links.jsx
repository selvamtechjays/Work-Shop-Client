import React, { useState } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import "../styles/main.css";
import { useNavigate } from "react-router-dom";

//Navbar lins
const NavbarLinks = () => {
  //state management for sidbar
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
//handle click function to navigate dashboard
  const handleClick = () => {
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="navbar">
      <img
        src="https://www.thenewstuff.in/sites/default/files/inline-images/download.png"
        alt="Logo"
        className="logo"
        style={{ cursor: "pointer" }}
        onClick={handleClick}
      />
      <div className={`navlinks ${isOpen ? "open" : ""}`}>
        <a href="/">Banking & Insurance</a>
        <a href="/">SSC Exams</a>
        <a href="/">UPSC Exams</a>
        <a href="/">GATE Exams</a>
        <a href="/">Railways Exams</a>
      </div>
      <div className="menu-icon" onClick={toggleNavbar}>
        {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
      </div>
    </div>
  );
};

export default NavbarLinks;
