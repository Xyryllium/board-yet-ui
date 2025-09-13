interface FormFooterProps {
  onSwitchToLogin?: () => void;
  className?: string;
}

export function FormFooter({ onSwitchToLogin, className = "" }: FormFooterProps) {
  return (
    <div className={`text-center-content ${className}`}>
      <p className="text-body-sm">
        Already have an account?{" "}
        <button 
          onClick={onSwitchToLogin}
          className="link-primary-medium"
        >
          Sign in here
        </button>
      </p>
    </div>
  );
}
