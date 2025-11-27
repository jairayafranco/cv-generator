import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'warning' | 'error' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Check if showModal exists (not available in jsdom)
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
      // Focus the cancel button by default for safety
      cancelButtonRef.current?.focus();
    } else {
      // Check if close exists (not available in jsdom)
      if (typeof dialog.close === 'function') {
        dialog.close();
      }
      // Restore focus to the previously focused element
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusableElements = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const alertClass = type === 'error' ? 'alert-error' : type === 'info' ? 'alert-info' : 'alert-warning';

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onKeyDown={handleKeyDown}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
      aria-modal="true"
    >
      <div className="modal-box" role="alertdialog">
        <h3 id="dialog-title" className="font-bold text-lg">
          {title}
        </h3>
        <div id="dialog-message" className={`alert ${alertClass} mt-4`}>
          <span>{message}</span>
        </div>
        <div className="modal-action">
          <button
            ref={cancelButtonRef}
            data-cancel-button
            className="btn"
            onClick={handleCancel}
            aria-label={cancelText}
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            className="btn btn-error"
            onClick={handleConfirm}
            aria-label={confirmText}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={handleCancel}>
        <button type="button" aria-label="Close dialog" tabIndex={-1}>close</button>
      </form>
    </dialog>
  );
}
