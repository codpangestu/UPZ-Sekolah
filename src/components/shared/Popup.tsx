import { useEffect, useCallback, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface PopupProps {
  /** Whether the popup is visible */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Popup title */
  title?: string;
  /** Popup description / body content */
  description?: string;
  /** Custom body content (overrides description) */
  children?: ReactNode;
  /** Optional action buttons rendered at bottom */
  actions?: ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-[400px]',
  md: 'w-[480px]',
  lg: 'w-[560px]',
};

export default function Popup({ open, onClose, title, description, children, actions, size = 'md' }: PopupProps) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Card — sesuai design specs: 480px, white, rounded-16, flex col centered, p-6, gap-6 */}
      <div
        className={`relative ${sizeClasses[size]} bg-white rounded-2xl shadow-2xl flex flex-col items-center p-6 gap-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#555] hover:bg-[#F0F4F8] transition-colors"
        >
          <X size={16} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center gap-2 w-full">
          {title && (
            <h3
              className="text-lg font-bold text-[#303030]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {title}
            </h3>
          )}
          {children ? (
            <div className="w-full">{children}</div>
          ) : (
            description && (
              <p
                className="text-sm text-[#555] max-w-sm"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {description}
              </p>
            )
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-3 w-full">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
