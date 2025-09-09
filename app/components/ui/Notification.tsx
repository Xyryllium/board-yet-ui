import { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export function Notification({ 
  message, 
  type = 'success', 
  duration = 5000, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${typeStyles[type]} rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={handleClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
