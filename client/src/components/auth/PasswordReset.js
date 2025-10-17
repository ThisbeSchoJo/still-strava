import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./PasswordReset.css";

function PasswordReset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="password-reset">
        <div className="password-reset-container">
          <h2>Invalid Reset Link</h2>
          <p className="error-message">
            This password reset link is invalid or has expired.
          </p>
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/request-password-reset")}
          >
            Request a new reset link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset">
      <div className="password-reset-container">
        <h2>Reset Your Password</h2>
        <p className="password-reset-instructions">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="password-reset-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your new password"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your new password"
              minLength="6"
            />
          </div>

          {error && (
            <div className="error" role="alert" aria-live="polite">
              <p className="error-message">{error}</p>
            </div>
          )}

          {message && (
            <div className="success" role="alert" aria-live="polite">
              <p className="success-message">{message}</p>
              <p className="redirect-message">Redirecting to login...</p>
            </div>
          )}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="password-reset-links">
          <p>
            Remember your password?{" "}
            <button
              type="button"
              className="link-button"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset;
