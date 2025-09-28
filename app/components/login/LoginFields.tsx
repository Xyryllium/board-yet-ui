import { PasswordInput } from '../ui';

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
          className={`form-input ${errors.email ? 'form-input-error' : ''}`}
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
        <PasswordInput
          id="password"
          value={password}
          onChange={onPasswordChange}
          placeholder="Enter your password"
          error={errors.password}
          required
        />
      </div>

      <div className="flex justify-end">
        <a href="#" className="link-primary-sm">
          Forgot password?
        </a>
      </div>
    </div>
  );
}
