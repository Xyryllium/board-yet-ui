import { useState } from "react";
import { FormHeader } from "../forms";
import { PersonalInfoForm } from "../signup";
import { OrganizationSection } from "../signup";
import { TermsAgreement } from "../signup";
import { SubmitButton } from "../forms";
import { FormFooter } from "../forms";
import { signupUser, storeAuthToken, type SignupCredentials } from "../../lib/auth";
import { useNavigate } from "react-router";

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const navigate = useNavigate();
  const [createOrganization, setCreateOrganization] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const credentials: SignupCredentials = {
        name: formData.name,
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword
      };

      const response = await signupUser(credentials);

      if (response.success && response.token) {
        storeAuthToken(response.token);
        navigate("/organization-dashboard");
      } else {
        if (response.error && response.error.includes('errors')) {
          const errorMessage = response.error;
          setErrors({ general: errorMessage });
        } else {
          setErrors({ general: response.error || "Signup failed. Please try again." });
        }
      }

    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-content">
      <FormHeader
        title="Create Account"
        description="Join Board Yet and start managing your projects today."
      />

      <form className="form-fields" onSubmit={handleSubmit}>
        {errors.general && (
          <div className="error-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
            <p className="text-sm font-medium">{errors.general}</p>
          </div>
        )}

        <PersonalInfoForm
          formData={formData}
          errors={errors}
          onChange={(field, value) => handleInputChange(field, value)}
        />

        <OrganizationSection 
          createOrganization={createOrganization}
          onOrganizationToggle={setCreateOrganization}
        />

        <TermsAgreement />

        <SubmitButton>
          {createOrganization ? "Create Account & Organization" : "Create Account"}
        </SubmitButton>
      </form>

      <FormFooter onSwitchToLogin={onSwitchToLogin} />
    </div>
  );
}
