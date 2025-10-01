import React, { useState } from 'react';
import './PasswordConfirmModal.css';

interface PasswordConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  actionType: 'delete' | 'modify';
}

const PasswordConfirmModal: React.FC<PasswordConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  actionType
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const correctPassword = '123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password === correctPassword) {
      onConfirm();
      handleClose();
    } else {
      setError('Mot de passe incorrect');
      setPassword('');
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="password-modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button 
            className="close-button" 
            onClick={handleClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className={`action-icon ${actionType}`}>
            {actionType === 'delete' ? '🗑️' : '✏️'}
          </div>
          
          <p className="modal-message">{message}</p>

          <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="password">
                Mot de passe de confirmation :
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
                className={error ? 'error' : ''}
                disabled={isLoading}
                autoFocus
                required
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-cancel"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className={`btn btn-${actionType}`}
                disabled={isLoading || !password.trim()}
              >
                {isLoading ? 'Vérification...' : 
                 actionType === 'delete' ? 'Supprimer' : 'Modifier'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordConfirmModal;
