import { ReactNode } from 'react';

type AlertVariant = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  children: ReactNode;
}

export const Alert = ({ variant = 'error', children }: AlertProps) => {
  const variants = {
    error: {
      container: 'bg-red-50 border-red-400',
      text: 'text-red-700',
    },
    success: {
      container: 'bg-green-50 border-green-400',
      text: 'text-green-700',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-400',
      text: 'text-yellow-700',
    },
    info: {
      container: 'bg-blue-50 border-blue-400',
      text: 'text-blue-700',
    },
  };

  return (
    <div
      className={`rounded-md p-4 border ${variants[variant].container}`}
      role="alert"
    >
      <p className={`text-sm ${variants[variant].text}`}>{children}</p>
    </div>
  );
};