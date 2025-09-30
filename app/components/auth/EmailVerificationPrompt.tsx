import { useState } from 'react';
import { resendVerificationEmail } from '../../lib/auth';
import { useUser } from '../../contexts/UserContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorAlert } from '../ui/ErrorAlert';

interface EmailVerificationPromptProps {
  onDismiss?: () => void;
}

export function EmailVerificationPrompt({ onDismiss }: EmailVerificationPromptProps) {
  const { user } = useUser();
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResendVerification = async () => {
    setIsResending(true);
    setError('');

    try {
      const result = await resendVerificationEmail();
      
      if (result.success) {
        setMessage('Verification email sent!');
      } else {
        setError(result.error || 'Failed to resend verification email');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsResending(false);
    }
  };

  if (user?.email_verified) {
    return null;
  }

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.725-1.36 3.49 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Email Verification Required
          </h3>
          <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            <p>
              Please verify your email address ({user?.email}) to access all features. 
              Check your inbox and click the verification link in the email.
            </p>
          </div>
          
          {error && (
            <div className="mt-2">
              <ErrorAlert error={error} />
            </div>
          )}
          
          {message && (
            <div className="mt-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2">
              <p className="text-green-600 dark:text-green-400 text-sm">{message}</p>
            </div>
          )}

          <div className="mt-3 flex space-x-3">
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="bg-yellow-100 dark:bg-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-700 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isResending ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-1">Sending...</span>
                </>
              ) : (
                'Resend Email'
              )}
            </button>
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="bg-yellow-100 dark:bg-yellow-800 hover:bg-yellow-200 dark:hover:bg-yellow-700 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
