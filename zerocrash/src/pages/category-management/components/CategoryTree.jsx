import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CategoryTree = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onAddCategory, 
  onDeleteCategory,
  onDuplicateCategory,
  searchQuery,
  onBulkSelect,
  selectedItems = []
}) => {
  const [expandedCategories, setExpandedCategories] = useState(new Set(['ai-ml', 'cybersecurity']));
  const [draggedItem, setDraggedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleExpanded = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded?.has(categoryId)) {
      newExpanded?.delete(categoryId);
    } else {
      newExpanded?.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetItem) => {
    e?.preventDefault();
    if (draggedItem && draggedItem?.id !== targetItem?.id) {
      console.log('Reordering:', draggedItem?.name, 'to', targetItem?.name);
      // In real app, this would update the category order
    }
    setDraggedItem(null);
    setHoveredItem(null);
  };

  const handleBulkSelection = (categoryId, checked) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected?.add(categoryId);
    } else {
      newSelected?.delete(categoryId);
    }
    onBulkSelect(Array.from(newSelected));
  };

  const isSelected = (categoryId) => selectedItems?.includes(categoryId);

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text?.split(regex);
    return parts?.map((part, index) => 
      regex?.test(part) ? 
        <mark key={index} className="bg-warning/30 text-warning-foreground">{part}</mark> : 
        part
    );
  };

  const renderCategory = (category, level = 0) => {
    const isExpanded = expandedCategories?.has(category?.id);
    const hasChildren = category?.subcategories && category?.subcategories?.length > 0;
    const isItemSelected = selectedCategory?.id === category?.id;
    const isBulkSelected = isSelected(category?.id);
    const isDragging = draggedItem?.id === category?.id;
    const isHovered = hoveredItem === category?.id;

    return (
      <div key={category?.id} className="select-none">
        <div
          className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
            isItemSelected ? 'bg-primary/10 border border-primary/20' : isHovered ?'bg-muted/50' : 'hover:bg-muted/30'
          } ${isDragging ? 'opacity-50' : ''}`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          draggable
          onDragStart={(e) => handleDragStart(e, category)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, category)}
          onDragEnter={() => setHoveredItem(category?.id)}
          onDragLeave={() => setHoveredItem(null)}
          onClick={() => onSelectCategory(category)}
        >
          {/* Bulk Selection Checkbox */}
          <input
            type="checkbox"
            checked={isBulkSelected}
            onChange={(e) => {
              e?.stopPropagation();
              handleBulkSelection(category?.id, e?.target?.checked);
            }}
            className="mr-2 w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
          />

          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 mr-1"
              onClick={(e) => {
                e?.stopPropagation();
                toggleExpanded(category?.id);
              }}
            >
              <Icon 
                name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                size={14} 
              />
            </Button>
          ) : (
            <div className="w-7 mr-1" />
          )}

          {/* Category Icon */}
          <div className={`w-6 h-6 rounded flex items-center justify-center mr-3 ${
            category?.status === 'active' ? 'bg-success/20' : 'bg-muted'
          }`}>
            <Icon 
              name={category?.icon} 
              size={14} 
              className={category?.status === 'active' ? 'text-success' : 'text-text-secondary'}
            />
          </div>

          {/* Category Name and Count */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-primary truncate">
                {highlightText(category?.name, searchQuery)}
              </span>
              <div className="flex items-center space-x-2 ml-2">
                <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded">
                  {category?.itemCount}
                </span>
                {category?.status === 'inactive' && (
                  <div className="w-2 h-2 bg-warning rounded-full" title="Inactive" />
                )}
              </div>
            </div>
            {category?.description && (
              <p className="text-xs text-text-secondary truncate mt-1">
                {highlightText(category?.description, searchQuery)}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              onClick={(e) => {
                e?.stopPropagation();
                onAddCategory(category?.id);
              }}
              title="Add subcategory"
            >
              <Icon name="Plus" size={12} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6"
              onClick={(e) => {
                e?.stopPropagation();
                onDuplicateCategory(category);
              }}
              title="Duplicate category"
            >
              <Icon name="Copy" size={12} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-error hover:text-error"
              onClick={(e) => {
                e?.stopPropagation();
                onDeleteCategory(category);
              }}
              title="Delete category"
            >
              <Icon name="Trash2" size={12} />
            </Button>
          </div>
        </div>
        {/* Subcategories */}
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {category?.subcategories?.map(subcategory => 
              renderCategory(subcategory, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const filteredCategories = searchQuery 
    ? categories?.filter(cat => 
        cat?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        cat?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        cat?.subcategories?.some(sub => 
          sub?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        )
      )
    : categories;

  return (
    <div className="h-full flex flex-col">
      {/* Tree Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-text-primary">Struttura Categorie</h3>
          <p className="text-sm text-text-secondary">
            {categories?.length} categorie principali
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddCategory()}
          iconName="Plus"
          iconPosition="left"
        >
          Nuova
        </Button>
      </div>
      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredCategories?.length > 0 ? (
          <div className="space-y-1 group">
            {filteredCategories?.map(category => renderCategory(category))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Icon name="FolderOpen" size={48} className="text-text-secondary mb-4" />
            <h4 className="font-medium text-text-primary mb-2">
              {searchQuery ? 'Nessun risultato trovato' : 'Nessuna categoria'}
            </h4>
            <p className="text-sm text-text-secondary mb-4">
              {searchQuery 
                ? `Nessuna categoria corrisponde a "${searchQuery}"`
                : 'Inizia creando la tua prima categoria'
              }
            </p>
            {!searchQuery && (
              <Button
                variant="outline"
                onClick={() => onAddCategory()}
                iconName="Plus"
                iconPosition="left"
              >
                Crea Categoria
              </Button>
            )}
          </div>
        )}
      </div>
      {/* Bulk Actions Footer */}
      {selectedItems?.length > 0 && (
        <div className="border-t border-border p-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {selectedItems?.length} elementi selezionati
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkSelect([])}
              >
                Deseleziona
              </Button>
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                iconPosition="left"
              >
                Elimina
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryTree;