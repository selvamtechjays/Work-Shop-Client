import { Route, Routes } from 'react-router-dom';
import "./App.css";
import { ToastContainer } from 'react-toastify';
import LandingPage from './pages/login/landing-page';
import SignupPage from './pages/signup/signup-page';
import Dashboard from './pages/dashboard-page/dashboard';
import Scoreboard from './pages/score-board/score-board-page';
import {
  ForgetPasswordForm,
  UpdatePasswordForm,
} from './pages/forget-password-page/forget-password';
import NavbarLinks from './components/nav-links';

    //root component
export default function App() {
  return (
    <div className="app">
      <ToastContainer />

      <nav>
        <NavbarLinks />
      </nav>

      <Routes>
        {/* Landing page route */}
        <Route path="/" element={<LandingPage />} />

        {/* signup route path */}
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* score board route */}
        <Route path="/scoreboard" element={<Scoreboard />} />
        {/* forget password link route */}
        <Route path="/forgetPassword/" element={<ForgetPasswordForm />} />
        {/* update passord route */}
        <Route path="/updatepassword/:id" element={<UpdatePasswordForm />} />
      </Routes>
    </div>
  );
}
