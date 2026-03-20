import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";

import LandingPage from "./pages/login/landing-page";
import { LoginPage } from "./pages/login/LoginPage";
import SignupPage from "./pages/signup/signup-page";
import { SignUpPage } from "./pages/signup/SignUpPage";
import Dashboard from "./pages/dashboard-page/dashboard";
import Scoreboard from "./pages/score-board/score-board-page";
import {
  ForgetPasswordForm,
  UpdatePasswordForm,
} from "./pages/forget-password-page/forget-password";

import HistoryPage from "./pages/history/user-histroy";
import ParentComponent from "./components/chart-parent";
import Test from "./components/test-card";

//root component
export default function App() {
  return (
    <div className="app">
      <ToastContainer />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgetPassword" element={<ForgetPasswordForm />} />
        <Route path="/updatepassword/:id" element={<UpdatePasswordForm />} />

        {/* Protected Parent Route with CHILD ROUTES */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        >
          {/* Child Routes */}
          <Route index element={<Test />} /> {/* default dashboard content */}
          <Route path="history" element={<HistoryPage />} />
          <Route path="progress" element={<ParentComponent />} />
        </Route>

        {/* ScoreBoard outside dashboard */}
        <Route path="/scoreboard" element={<Scoreboard />} />
      </Routes>
    </div>
  );
}

// Protected Route
export function ProtectedRoutes({ children }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const email = userInfo ? userInfo.userEmail : null;

  return email ? children : <Navigate to="/" />;
}
