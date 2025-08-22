import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionBar = ({ selectedCount, onSelectAll, onDeselectAll, onBulkMove, onBulkDelete, onBulkExport, onBulkShare, totalItems }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-card border border-border rounded-lg shadow-elevation-2 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">
              {selectedCount} di {totalItems} elementi selezionati
            </span>
          </div>
          
          <div className="h-6 w-px bg-border"></div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSelectAll}
              className="text-xs"
            >
              Seleziona tutto
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeselectAll}
              className="text-xs"
            >
              Deseleziona tutto
            </Button>
          </div>
          
          <div className="h-6 w-px bg-border"></div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBulkMove}
              iconName="FolderOpen"
              iconPosition="left"
              iconSize={16}
            >
              Sposta
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onBulkShare}
              iconName="Share"
              iconPosition="left"
              iconSize={16}
            >
              Condividi
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onBulkExport}
              iconName="Download"
              iconPosition="left"
              iconSize={16}
            >
              Esporta
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onBulkDelete}
              iconName="Trash2"
              iconPosition="left"
              iconSize={16}
              className="text-error hover:text-error"
            >
              Elimina
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;