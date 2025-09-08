interface TermsAgreementProps {
  className?: string;
}

export function TermsAgreement({ className = "" }: TermsAgreementProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id="terms"
        className="form-checkbox"
        required
      />
      <label htmlFor="terms" className="ml-2 text-body-sm">
        I agree to the{" "}
        <a href="#" className="link-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="link-primary">
          Privacy Policy
        </a>
      </label>
    </div>
  );
}
