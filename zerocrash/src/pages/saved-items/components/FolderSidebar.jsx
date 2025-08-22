import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FolderSidebar = ({ folders, selectedFolder, onFolderSelect, onCreateFolder, onDeleteFolder, onRenameFolder, isCollapsed, onToggleCollapse }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);
  const [editName, setEditName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));

  const handleCreateFolder = (e) => {
    e?.preventDefault();
    if (newFolderName?.trim()) {
      onCreateFolder({
        name: newFolderName?.trim(),
        parent: selectedFolder || 'root',
        color: '#3B82F6'
      });
      setNewFolderName('');
      setShowCreateForm(false);
    }
  };

  const handleRenameFolder = (folderId) => {
    if (editName?.trim()) {
      onRenameFolder(folderId, editName?.trim());
      setEditingFolder(null);
      setEditName('');
    }
  };

  const toggleFolderExpansion = (folderId) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded?.has(folderId)) {
      newExpanded?.delete(folderId);
    } else {
      newExpanded?.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolder = (folder, level = 0) => {
    const isExpanded = expandedFolders?.has(folder?.id);
    const hasChildren = folder?.children && folder?.children?.length > 0;
    const isSelected = selectedFolder === folder?.id;
    const isEditing = editingFolder === folder?.id;

    return (
      <div key={folder?.id}>
        <div
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted transition-colors ${
            isSelected ? 'bg-primary/10 text-primary' : 'text-text-primary'
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={() => !isEditing && onFolderSelect(folder?.id)}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e?.stopPropagation();
                toggleFolderExpansion(folder?.id);
              }}
              className="w-4 h-4 p-0"
            >
              <Icon 
                name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                size={12} 
              />
            </Button>
          )}
          
          {!hasChildren && <div className="w-4"></div>}
          
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: folder?.color || '#64748B' }}
          ></div>
          
          {isEditing ? (
            <Input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e?.target?.value)}
              onBlur={() => handleRenameFolder(folder?.id)}
              onKeyDown={(e) => {
                if (e?.key === 'Enter') handleRenameFolder(folder?.id);
                if (e?.key === 'Escape') {
                  setEditingFolder(null);
                  setEditName('');
                }
              }}
              className="text-sm h-6 px-1"
              autoFocus
            />
          ) : (
            <span className="flex-1 text-sm truncate">{folder?.name}</span>
          )}
          
          <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded-full">
            {folder?.itemCount || 0}
          </span>
          
          {!isEditing && folder?.id !== 'all' && (
            <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e?.stopPropagation();
                  setEditingFolder(folder?.id);
                  setEditName(folder?.name);
                }}
                className="w-6 h-6"
              >
                <Icon name="Edit" size={12} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e?.stopPropagation();
                  onDeleteFolder(folder?.id);
                }}
                className="w-6 h-6 text-error hover:text-error"
              >
                <Icon name="Trash2" size={12} />
              </Button>
            </div>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {folder?.children?.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-surface border-r border-border p-2 space-y-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="w-full"
        >
          <Icon name="ChevronRight" size={20} />
        </Button>
        <div className="space-y-1">
          {folders?.slice(0, 3)?.map(folder => (
            <Button
              key={folder?.id}
              variant={selectedFolder === folder?.id ? "default" : "ghost"}
              size="icon"
              onClick={() => onFolderSelect(folder?.id)}
              className="w-full"
              title={folder?.name}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: folder?.color || '#64748B' }}
              ></div>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 bg-surface border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Cartelle</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <Icon name="FolderPlus" size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
            >
              <Icon name="ChevronLeft" size={20} />
            </Button>
          </div>
        </div>
        
        {showCreateForm && (
          <form onSubmit={handleCreateFolder} className="space-y-2">
            <Input
              type="text"
              placeholder="Nome cartella"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e?.target?.value)}
              className="text-sm"
              autoFocus
            />
            <div className="flex space-x-2">
              <Button type="submit" size="sm" className="flex-1">
                Crea
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewFolderName('');
                }}
              >
                Annulla
              </Button>
            </div>
          </form>
        )}
      </div>
      <div className="p-2 space-y-1 max-h-96 overflow-y-auto">
        {folders?.map(folder => (
          <div key={folder?.id} className="group">
            {renderFolder(folder)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderSidebar;