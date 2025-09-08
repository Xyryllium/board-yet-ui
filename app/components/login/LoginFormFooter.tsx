interface LoginFormFooterProps {
  onSwitchToSignup?: () => void;
  className?: string;
}

export function LoginFormFooter({ onSwitchToSignup, className = "" }: LoginFormFooterProps) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-body-sm">
        Don't have an account?{" "}
        <button 
          onClick={onSwitchToSignup}
          className="link-primary-medium"
        >
          Sign up here
        </button>
      </p>
    </div>
  );
}
