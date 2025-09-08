import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="card">
      <div className="space-content">
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

        {isLogin ? <LoginForm onSwitchToSignup={toggleForm} /> : <SignupForm onSwitchToLogin={toggleForm} />}
      </div>
    </div>
  );
}
