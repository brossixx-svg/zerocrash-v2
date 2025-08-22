import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'warning',
  confirmText = 'Conferma',
  cancelText = 'Annulla',
  category = null 
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return { name: 'AlertTriangle', color: 'text-error' };
      case 'success':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'info':
        return { name: 'Info', color: 'text-accent' };
      default:
        return { name: 'AlertCircle', color: 'text-warning' };
    }
  };

  const icon = getIcon();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-lg shadow-elevation-2 w-full max-w-md">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-12 h-12 rounded-full bg-${type === 'danger' ? 'error' : type === 'success' ? 'success' : type === 'info' ? 'accent' : 'warning'}/10 flex items-center justify-center`}>
              <Icon name={icon?.name} size={24} className={icon?.color} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">
                {title}
              </h3>
            </div>
          </div>
          
          <div className="text-text-secondary">
            {message}
          </div>

          {/* Category Details (for delete operations) */}
          {category && type === 'danger' && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Icon name={category?.icon} size={20} className="text-text-secondary" />
                <span className="font-medium text-text-primary">{category?.name}</span>
              </div>
              {category?.description && (
                <p className="text-sm text-text-secondary mb-2">{category?.description}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <span>{category?.itemCount || 0} elementi</span>
                {category?.subcategories && category?.subcategories?.length > 0 && (
                  <span>{category?.subcategories?.length} sottocategorie</span>
                )}
              </div>
            </div>
          )}

          {/* Warning for destructive actions */}
          {type === 'danger' && (
            <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-error mb-1">Attenzione</p>
                  <p className="text-text-secondary">
                    Questa azione non può essere annullata. Tutti i dati associati verranno eliminati definitivamente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-border p-6 pt-4">
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              variant={type === 'danger' ? 'destructive' : 'default'}
              onClick={() => {
                onConfirm();
                onClose();
              }}
              iconName={type === 'danger' ? 'Trash2' : 'Check'}
              iconPosition="left"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;