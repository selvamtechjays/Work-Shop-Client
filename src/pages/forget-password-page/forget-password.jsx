import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../../utils/api';

// Component for sending a password reset link
const ForgetPasswordForm = () => {
  const [email, setEmail] = useState('');

  // Function to handle form submission for sending a reset password link
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to the server to send a password reset link
      await axios.post(
        `${API_URL}/forgetPassword/${email}`,
        { email: email }
      );

      // Notify the user that the reset link has been sent successfully
      toast.success("Password Reset Link Sent Successfully");
    } catch (error) {
      // Log and notify the user if an error occurs during sending the reset link
      console.error("Error sending reset password link:", error);
      toast.error("Error sending reset password link");
    }
  };

  return (
    <MDBContainer>
      <MDBRow className="justify-content-center mt-5">
        <MDBCol md="6">
          <form onSubmit={handleSubmit}>
            <MDBInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="text-center mt-3">
              <MDBBtn color="primary" type="submit">Send Reset Link</MDBBtn>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

// Component for updating the password
const UpdatePasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Use useParams hook to access route parameters
  const { id } = useParams();

  const navigate = useNavigate()

  // Function to handle form submission for updating the password
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // Notify the user if the passwords do not match
      alert("Passwords do not match");
      return;
    }

    try {
      // Send a POST request to the server to update the password
      await axios.post(`${API_URL}/changePassword/${id}`, { password });

      // Notify the user that the password has been updated successfully
      toast.success("Password updated successfully");

      // Redirect the user to the home page
      navigate("/");

      // Reset form fields
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      // Log and notify the user if an error occurs during password update
      console.error("Error updating password:", error);
      toast.error("Error updating password");
    }
  };

  return (
    <MDBContainer>
      <MDBRow className="justify-content-center mt-5">
        <MDBCol md="6">
          <form onSubmit={handleSubmit}>
            <MDBInput
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <MDBInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="text-center mt-3">
              <MDBBtn color="primary" type="submit">Update Password</MDBBtn>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

// Exporting the components for usage in other parts of the application
export { ForgetPasswordForm, UpdatePasswordForm };

