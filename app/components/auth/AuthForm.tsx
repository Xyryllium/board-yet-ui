import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

interface AuthFormProps {
  initialTab?: 'login' | 'signup';
  initialEmail?: string;
  showMessage?: string;
  invitationToken?: string;
}

export function AuthForm({ initialTab = 'login', initialEmail, showMessage, invitationToken }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(initialTab === 'login');

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="card">
      <div className="space-content">
        {showMessage && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-blue-600 dark:text-blue-400 text-sm">{showMessage}</p>
          </div>
        )}
        
        <div className="tab-container">
          <button
            onClick={() => setIsLogin(true)}
            className={`tab-button ${
              isLogin ? "tab-button-active" : "tab-button-inactive"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`tab-button ${
              !isLogin ? "tab-button-active" : "tab-button-inactive"
            }`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <LoginForm onSwitchToSignup={toggleForm} initialEmail={initialEmail} />
        ) : (
          <SignupForm onSwitchToLogin={toggleForm} initialEmail={initialEmail} invitationToken={invitationToken} />
        )}
      </div>
    </div>
  );
}
