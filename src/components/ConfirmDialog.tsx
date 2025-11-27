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
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      // Focus the cancel button by default for safety
      const cancelButton = dialog.querySelector('[data-cancel-button]') as HTMLButtonElement;
      cancelButton?.focus();
    } else {
      dialog.close();
    }
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
        <button type="button" aria-label="Close dialog">close</button>
      </form>
    </dialog>
  );
}
