import { useState } from "react";
import { Link } from "react-router";
import { FormHeader } from "../forms";
import { SubmitButton } from "../forms";
import { forgotPassword, type ForgotPasswordCredentials } from "../../lib/auth";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const credentials: ForgotPasswordCredentials = {
        email: email.trim()
      };

      const response = await forgotPassword(credentials);

      if (response.success) {
        setIsSubmitted(true);
      } else {
        setError(response.error || "Failed to send password reset email. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="page-container">
        <div className="page-content">
          <div className="max-w-md mx-auto">
            <div className="card">
              <div className="space-content">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <FormHeader 
                    title="Check Your Email" 
                    description="We've sent a password reset link to your email address."
                  />
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-600 dark:text-green-400 text-sm text-center">
                    If an account with the email <strong>{email}</strong> exists, you will receive a password reset link shortly.
                  </p>
                </div>

                <div className="text-center space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setEmail("");
                      }}
                      className="btn-outline"
                    >
                      Try Different Email
                    </button>
                    
                    <Link to="/" className="btn-primary">
                      Back to Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-content">
        <div className="max-w-md mx-auto">
          <div className="card">
            <div className="space-content">
              <FormHeader 
                title="Forgot Password?" 
                description="Enter your email address and we'll send you a link to reset your password."
              />

              <form className="form-fields" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`form-input ${error ? 'form-input-error' : ''}`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    required
                    autoFocus
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>

                <SubmitButton 
                  className="btn-primary w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </SubmitButton>
              </form>

              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Remember your password?{" "}
                  <Link to="/" className="link-primary">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
