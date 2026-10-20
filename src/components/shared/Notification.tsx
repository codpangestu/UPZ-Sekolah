import { useEffect, useState, type ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

type NotificationVariant = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  /** Message text */
  message: string;
  /** Variant menentukan warna icon & border */
  variant?: NotificationVariant;
  /** Optional action button text */
  action?: { label: string; onClick: () => void };
  /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
  duration?: number;
  /** Show dismiss button */
  dismissible?: boolean;
  /** Custom icon override */
  icon?: ReactNode;
  /** Optional onDismiss callback */
  onDismiss?: () => void;
}

const variantStyles: Record<NotificationVariant, { bg: string; border: string; iconColor: string; Icon: typeof CheckCircle }> = {
  success: {
    bg: 'bg-[#E6F9F0]',
    border: 'border-[#00C16A]',
    iconColor: 'text-[#00C16A]',
    Icon: CheckCircle,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    iconColor: 'text-red-500',
    Icon: AlertCircle,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    iconColor: 'text-blue-500',
    Icon: Info,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-400',
    iconColor: 'text-amber-500',
    Icon: AlertTriangle,
  },
};

export default function Notification({
  message,
  variant = 'success',
  action,
  duration = 0,
  dismissible = true,
  icon,
  onDismiss,
}: NotificationProps) {
  const [visible, setVisible] = useState(true);

  // Auto-dismiss
  useEffect(() => {
    if (duration > 0 && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, visible, onDismiss]);

  if (!visible) return null;

  const styles = variantStyles[variant];
  const DefaultIcon = styles.Icon;

  return (
    <div
      className={`flex items-center gap-[18px] p-4 rounded-lg ${styles.bg} ${styles.border} border`}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${styles.iconColor}`}>
        {icon || <DefaultIcon size={20} />}
      </div>

      {/* Message */}
      <p className="flex-1 text-sm text-[#303030]">
        {message}
      </p>

      {/* Action button */}
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm font-semibold text-[#28A71A] hover:text-[#1C7712] whitespace-nowrap transition-colors"
        >
          {action.label}
        </button>
      )}

      {/* Dismiss */}
      {dismissible && (
        <button
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[#555] hover:bg-black/5 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
