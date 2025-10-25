// src/hooks/useModalState.ts
import { useState } from 'react';

interface ModalState {
  isOpen: boolean;
  isClosing: boolean;
}

export const useModalState = (initialState = false) => {
  const [state, setState] = useState<ModalState>({
    isOpen: initialState,
    isClosing: false
  });

  const open = () => {
    setState({ isOpen: true, isClosing: false });
  };

  const close = (onCloseComplete?: () => void) => {
    setState(prev => ({ ...prev, isClosing: true }));

    setTimeout(() => {
      setState({ isOpen: false, isClosing: false });
      onCloseComplete?.();
    }, 300);
  };

  const closeImmediately = () => {
    setState({ isOpen: false, isClosing: false });
  };

  return {
    isOpen: state.isOpen,
    isClosing: state.isClosing,
    open,
    close,
    closeImmediately
  };
};

// Hook especializado para múltiples modales
export const useMultipleModals = () => {
  const createFormModal = useModalState();
  const editFormModal = useModalState();
  const categoryManagerModal = useModalState();

  return {
    createForm: createFormModal,
    editForm: editFormModal,
    categoryManager: categoryManagerModal
  };
};
