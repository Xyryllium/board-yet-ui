import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router';
import { resendVerificationEmail, verifyEmail, getCurrentUser } from '../../lib/auth';
import { useUser } from '../../contexts/UserContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorAlert } from '../ui/ErrorAlert';

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useUser();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<any>(null);

  const id = params.id || searchParams.get('id');
  const hash = params.hash || searchParams.get('hash');

  useEffect(() => {
    if (id && hash) {
      handleVerification();
    }
  }, [id, hash]);

  const handleVerification = async () => {
    if (!id || !hash) return;

    setIsVerifying(true);
    setError('');

    try {
      const result = await verifyEmail(id, hash);

      if (result.success) {
        setMessage('Email verified successfully!');
        setIsVerified(true);
        
        let updatedUser = null;
        try {
          await refreshUser();
          updatedUser = await getCurrentUser();
          setVerifiedUser(updatedUser);
        } catch (err) {
          console.log('User not logged in, verification still successful');
        }
        
        setTimeout(async () => {
          if (updatedUser && updatedUser.subdomain) {
            const { redirectToUserOrganization } = await import('../../lib/tenancy');
            const path = updatedUser.role === 'admin' ? '/tenant/' : '/tenant/boards';
            redirectToUserOrganization(updatedUser.subdomain, path);
          } else {
            navigate('/');
          }
        }, 2000);
      } else {
        setError(result.error || 'Failed to verify email');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsVerifying(false);
    }
  };

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

  if (user?.email_verified && !id && !hash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="card">
            <div className="space-content text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Email Verified
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Your email address has been successfully verified.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary w-full"
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="card">
          <div className="space-content text-center">
            {isVerifying ? (
              <div className="space-y-4">
                <LoadingSpinner />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Verifying Email...
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please wait while we verify your email address.
                </p>
              </div>
            ) : isVerified ? (
              <div className="space-y-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Email Verified!
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {message || 'Your email has been successfully verified.'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {verifiedUser?.subdomain ? 'Redirecting to dashboard...' : 'Redirecting to login...'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                  <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Verify Your Email
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
                </p>
                
                {error && <ErrorAlert error={error} />}
                {message && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-green-600 dark:text-green-400 text-sm">{message}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="btn-secondary w-full"
                  >
                    {isResending ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Sending...
                      </>
                    ) : (
                      'Resend Verification Email'
                    )}
                  </button>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="btn-outline w-full"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
