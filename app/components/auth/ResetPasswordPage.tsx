import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { FormHeader } from "../forms";
import { SubmitButton } from "../forms";
import { PasswordInput } from "../ui";
import { resetPassword, type ResetPasswordCredentials } from "../../lib/auth";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    password_confirmation?: string;
    general?: string;
  }>({});

  useEffect(() => {
    if (!token || !email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [token, email, navigate]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Please confirm your password";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !email) {
      setErrors({ general: "Invalid or missing reset token or email" });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const credentials: ResetPasswordCredentials = {
        email,
        token,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      };

      const response = await resetPassword(credentials);

      if (response.success) {
        setIsSuccess(true);
      } else {
        setErrors({ general: response.error || "Failed to reset password. Please try again." });
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return null; // Will redirect in useEffect
  }

  if (isSuccess) {
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
                    title="Password Reset Successfully" 
                    description="Your password has been updated. You can now sign in with your new password."
                  />
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-600 dark:text-green-400 text-sm text-center">
                    Your password has been successfully reset. You can now sign in with your new password.
                  </p>
                </div>

                <div className="text-center">
                  <Link to="/" className="btn-primary">
                    Sign In
                  </Link>
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
                title="Reset Your Password" 
                description="Enter your new password below."
              />

              <form className="form-fields" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="password" className="form-label">
                    New Password
                  </label>
                  <PasswordInput
                    id="password"
                    value={formData.password}
                    onChange={(password) => handleInputChange("password", password)}
                    placeholder="Enter your new password"
                    error={errors.password}
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm New Password
                  </label>
                  <PasswordInput
                    id="confirmPassword"
                    value={formData.password_confirmation}
                    onChange={(password) => handleInputChange("password_confirmation", password)}
                    placeholder="Confirm your new password"
                    error={errors.password_confirmation}
                    required
                  />
                </div>

                {errors.general && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
                  </div>
                )}

                <SubmitButton 
                  className="btn-primary w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
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
