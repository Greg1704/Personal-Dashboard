// src/components/ModalBackdrop.tsx
import { type ReactNode, type MouseEvent } from 'react';

interface ModalBackdropProps {
  isClosing: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const ModalBackdrop = ({ isClosing, onClose, children }: ModalBackdropProps) => {
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50
                  ${isClosing ? 'animate-backdropExit' : 'animate-backdropEnter'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-slate-800 p-5 rounded-lg shadow-lg w-96
                    ${isClosing ? 'animate-modalExit' : 'animate-modalEnter'}`}
      >
        {children}
      </div>
    </div>
  );
};
