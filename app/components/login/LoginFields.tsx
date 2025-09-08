interface LoginFieldsProps {
  className?: string;
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  errors?: {
    email?: string;
    password?: string;
  };
}

export function LoginFields({ 
  className = "",
  email,
  password,
  onEmailChange,
  onPasswordChange,
  errors = {}
}: LoginFieldsProps) {
  return (
    <div className={`form-fields ${className}`}>
      <div>
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          className={`form-input ${errors.email ? 'border-red-500' : ''}`}
          placeholder="Enter your email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          className={`form-input ${errors.password ? 'border-red-500' : ''}`}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      <div className="flex justify-end">
        <a href="#" className="link-primary-sm">
          Forgot password?
        </a>
      </div>
    </div>
  );
}
