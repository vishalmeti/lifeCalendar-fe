import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Loader from './loader';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  isLoading = false,
}) => {
  // Create a separate handler for confirm action
  const handleConfirm = async (e: React.MouseEvent) => {
    // Prevent default behavior to stop the dialog from closing immediately
    e.preventDefault();

    // Call the onConfirm handler
    onConfirm();

    // Note: we don't close the modal here - the parent component should do that
    // after the operation is complete by setting isOpen to false
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        // Only call onCancel when the dialog is closing via the escape key or clicking outside
        // Don't automatically close when buttons inside the dialog are clicked
        if (!open) {
          onCancel();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center min-w-[80px]"
            disabled={isLoading}
          >
            {isLoading ? <Loader size="sm" variant="spinner" /> : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;