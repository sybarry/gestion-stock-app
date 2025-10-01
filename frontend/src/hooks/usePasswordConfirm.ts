import { useState } from 'react';

interface PasswordConfirmation {
  title: string;
  message: string;
  actionType: 'delete' | 'modify';
  onConfirm: () => void;
}

export const usePasswordConfirm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<PasswordConfirmation | null>(null);

  const showConfirmation = (data: PasswordConfirmation) => {
    setConfirmData(data);
    setIsModalOpen(true);
  };

  const hideConfirmation = () => {
    setIsModalOpen(false);
    setConfirmData(null);
  };

  const handleConfirm = () => {
    if (confirmData) {
      confirmData.onConfirm();
    }
    hideConfirmation();
  };

  // Fonctions helper pour les actions communes
  const confirmDelete = (itemName: string, onDelete: () => void) => {
    showConfirmation({
      title: 'Confirmer la suppression',
      message: `Êtes-vous sûr de vouloir supprimer "${itemName}" ?\n\nCette action est irréversible.`,
      actionType: 'delete',
      onConfirm: onDelete
    });
  };

  const confirmModify = (itemName: string, onModify: () => void) => {
    showConfirmation({
      title: 'Confirmer la modification',
      message: `Confirmer la modification de "${itemName}" ?`,
      actionType: 'modify',
      onConfirm: onModify
    });
  };

  return {
    isModalOpen,
    confirmData,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
    confirmDelete,
    confirmModify
  };
};

export default usePasswordConfirm;