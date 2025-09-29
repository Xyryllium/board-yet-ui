import React, { useState } from 'react';
import { LegalModal, TermsOfServiceContent, PrivacyPolicyContent } from '~/components/legal';

interface LoginFormFooterProps {
  onSwitchToSignup?: () => void;
  className?: string;
}

export function LoginFormFooter({ onSwitchToSignup, className = "" }: LoginFormFooterProps) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <>
      <div className={`text-center ${className}`}>
        <p className="text-body-sm mb-2">
          Don't have an account?{" "}
          <button 
            onClick={onSwitchToSignup}
            className="link-primary-medium"
          >
            Sign up here
          </button>
        </p>
        <p className="text-body-xs text-gray-500 dark:text-gray-400">
          By using Board Yet, you agree to our{" "}
          <button 
            type="button"
            onClick={() => setIsTermsOpen(true)}
            className="link-primary"
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button 
            type="button"
            onClick={() => setIsPrivacyOpen(true)}
            className="link-primary"
          >
            Privacy Policy
          </button>
        </p>
      </div>

      <LegalModal
        title="Terms of Service"
        content={<TermsOfServiceContent />}
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      <LegalModal
        title="Privacy Policy"
        content={<PrivacyPolicyContent />}
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </>
  );
}
