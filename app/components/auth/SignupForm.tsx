import { useState } from "react";
import { FormHeader } from "../forms";
import { PersonalInfoForm } from "../signup";
import { OrganizationSection } from "../signup";
import { TermsAgreement } from "../signup";
import { SubmitButton } from "../forms";
import { FormFooter } from "../forms";
import { signupUser, storeAuthToken, storeUserData, type SignupCredentials } from "../../lib/auth";
import { createOrganization as createOrganizationAPI } from "../../api/organizations/create";
import { useNavigate } from "react-router";

interface SignupFormProps {
  onSwitchToLogin?: () => void;
  initialEmail?: string;
  invitationToken?: string;
}

export function SignupForm({ onSwitchToLogin, initialEmail, invitationToken }: SignupFormProps) {
  const navigate = useNavigate();
  const [createOrganization, setCreateOrganization] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: initialEmail || "",
    password: "",
    confirmPassword: ""
  });

  const [organizationData, setOrganizationData] = useState({
    name: ""
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    organizationName?: string;
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

    if (createOrganization) {
      if (!organizationData.name.trim()) {
        newErrors.organizationName = "Organization name is required";
      }
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

      if (response.success && response.token && response.user) {
        storeAuthToken(response.token);
        storeUserData(response.user);
        
        if (createOrganization && organizationData.name.trim()) {
          try {
            const orgResponse = await createOrganizationAPI({
              name: organizationData.name.trim()
            });
            
            if (!orgResponse.success) {
              setErrors({ general: orgResponse.error || "Failed to create organization. Please try again." });
              return;
            }
          } catch (orgError) {
            console.error('Organization creation error:', orgError);
            setErrors({ general: "Account created but failed to create organization. Please try creating it later." });
            return;
          }
        }
        
        if (invitationToken) {
          navigate(`/invitations/accept/${invitationToken}`);
        } else {
          navigate("/organization-dashboard");
        }
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

  const handleOrganizationChange = (field: "name", value: string) => {
    setOrganizationData(prev => ({ ...prev, [field]: value }));
    if (errors.organizationName) {
      setErrors(prev => ({ ...prev, organizationName: undefined }));
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
          organizationData={organizationData}
          onOrganizationChange={handleOrganizationChange}
          errors={errors}
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
