import { useState } from "react";
import { useNavigate } from "react-router";
import { LoginFormHeader } from "../login";
import { LoginFields } from "../login";
import { SubmitButton } from "../forms";
import { LoginFormFooter } from "../login";
import { loginUser, storeAuthToken, type LoginCredentials } from "../../lib/auth";

interface LoginFormProps {
  onSwitchToSignup?: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const credentials: LoginCredentials = {
        email: formData.email.trim(),
        password: formData.password
      };

      const response = await loginUser(credentials);

      if (response.success && response.token) {
        storeAuthToken(response.token);
        navigate("/organization-dashboard");
      } else {
        setErrors({ general: response.error || "Login failed. Please try again." });
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-content">
      <LoginFormHeader />

      <form className="form-fields" onSubmit={handleSubmit}>
        <LoginFields
          email={formData.email}
          password={formData.password}
          onEmailChange={(email) => handleInputChange("email", email)}
          onPasswordChange={(password) => handleInputChange("password", password)}
          errors={errors}
        />

        {errors.general && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <SubmitButton 
          className="btn-primary" 
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </SubmitButton>
      </form>

      <LoginFormFooter onSwitchToSignup={onSwitchToSignup} />
    </div>
  );
}
