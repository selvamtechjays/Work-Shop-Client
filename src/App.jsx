import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import LandingPage from "./pages/login/landing-page";
import SignupPage from "./pages/signup/signup-page";
import Dashboard from "./pages/dashboard-page/dashboard";
import Scoreboard from "./pages/score-board/score-board-page";
import {
  ForgetPasswordForm,
  UpdatePasswordForm,
} from "./pages/forget-password-page/forget-password";
import NavbarLinks from "./components/nav-links";

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
        {/* Dashboard route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />

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

//protected route for dashboard
export function ProtectedRoutes(props) {
  // Check if user info is present in localStorage
  const userInfoString = localStorage.getItem("userInfo");
  // Parse user info string to object
  const userInfo = JSON.parse(userInfoString);
  // Get email from userInfo object
  const email = userInfo ? userInfo.userEmail : null;

  if (email) {
    return props.children;
  } else {
    return <Navigate to="/" />;
  }
}
