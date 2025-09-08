interface LoginFormHeaderProps {
  className?: string;
}

export function LoginFormHeader({ className = "" }: LoginFormHeaderProps) {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="heading-3">Sign In</h2>
      <p className="text-body-sm mt-2">
        Welcome back! Please sign in to your account.
      </p>
    </div>
  );
}
