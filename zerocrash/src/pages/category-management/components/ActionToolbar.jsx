import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ActionToolbar = ({ 
  selectedItems, 
  searchQuery, 
  onSearchChange, 
  onAddCategory, 
  onBulkOperations, 
  onRefresh,
  onExpandAll,
  onCollapseAll,
  totalCategories,
  activeCategories 
}) => {
  const [viewMode, setViewMode] = useState('tree');

  return (
    <div className="bg-surface border-b border-border p-4 space-y-4">
      {/* Top Row - Search and Primary Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Cerca categorie, descrizioni, parole chiave..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
            />
          </div>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <Icon name="FolderTree" size={16} />
              <span>{totalCategories} totali</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span>{activeCategories} attive</span>
            </div>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            iconName="RefreshCw"
            title="Aggiorna"
          />
          
          <Button
            variant="default"
            size="sm"
            onClick={onAddCategory}
            iconName="Plus"
            iconPosition="left"
          >
            Nuova Categoria
          </Button>
        </div>
      </div>
      {/* Bottom Row - View Controls and Bulk Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'tree' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tree')}
              iconName="FolderTree"
              className="h-8"
            />
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              iconName="List"
              className="h-8"
            />
          </div>

          {/* Tree Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpandAll}
              iconName="ChevronDown"
              title="Espandi tutto"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onCollapseAll}
              iconName="ChevronRight"
              title="Comprimi tutto"
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems?.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              {selectedItems?.length} selezionati
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkOperations}
              iconName="Settings"
              iconPosition="left"
            >
              Operazioni di Massa
            </Button>
          </div>
        )}

        {/* Filter Indicators */}
        {searchQuery && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-accent/10 text-accent px-2 py-1 rounded text-sm">
              <Icon name="Filter" size={14} />
              <span>Filtro attivo</span>
              <Button
                variant="ghost"
                size="icon"
                className="w-4 h-4 ml-1"
                onClick={() => onSearchChange('')}
              >
                <Icon name="X" size={12} />
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Mobile Stats Row */}
      <div className="md:hidden flex items-center justify-between text-sm text-text-secondary">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon name="FolderTree" size={16} />
            <span>{totalCategories} categorie</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span>{activeCategories} attive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionToolbar;