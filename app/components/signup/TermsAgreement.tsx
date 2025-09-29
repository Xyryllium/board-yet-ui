import React, { useState } from 'react';
import { LegalModal, TermsOfServiceContent, PrivacyPolicyContent } from '~/components/legal';

interface TermsAgreementProps {
  className?: string;
}

export function TermsAgreement({ className = "" }: TermsAgreementProps) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <>
      <div className={`flex items-center ${className}`}>
        <input
          type="checkbox"
          id="terms"
          className="form-checkbox"
          required
        />
        <label htmlFor="terms" className="ml-2 text-body-sm">
          I agree to the{" "}
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
        </label>
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
