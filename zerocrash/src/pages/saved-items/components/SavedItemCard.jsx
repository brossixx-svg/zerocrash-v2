import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const SavedItemCard = ({ item, viewMode, onEdit, onDelete, onMove, onShare, onOpen, isSelected, onSelect }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getSourceBadgeColor = (source) => {
    const colors = {
      'Google': 'bg-blue-100 text-blue-800',
      'YouTube': 'bg-red-100 text-red-800',
      'Reddit': 'bg-orange-100 text-orange-800',
      'SEO': 'bg-green-100 text-green-800'
    };
    return colors?.[source] || 'bg-gray-100 text-gray-800';
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);
    switch (action) {
      case 'edit':
        onEdit(item);
        break;
      case 'delete':
        onDelete(item);
        break;
      case 'move':
        onMove(item);
        break;
      case 'share':
        onShare(item);
        break;
      default:
        break;
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-all duration-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(item?.id, e?.target?.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
          </div>
          
          <div className="w-16 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
            {item?.thumbnail ? (
              <Image 
                src={item?.thumbnail} 
                alt={item?.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Icon name="FileText" size={20} className="text-text-secondary" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-text-primary truncate">{item?.title}</h3>
                <p className="text-xs text-text-secondary mt-1 line-clamp-2">{item?.description}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceBadgeColor(item?.source)}`}>
                    {item?.source}
                  </span>
                  <span className="text-xs text-text-secondary">{formatDate(item?.savedDate)}</span>
                  {item?.category && (
                    <span className="text-xs text-text-secondary">• {item?.category}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpen(item)}
                  className="w-8 h-8"
                >
                  <Icon name="ExternalLink" size={16} />
                </Button>
                
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowMenu(!showMenu)}
                    className="w-8 h-8"
                  >
                    <Icon name="MoreVertical" size={16} />
                  </Button>
                  
                  {showMenu && (
                    <div className="absolute right-0 top-8 w-48 bg-popover border border-border rounded-lg shadow-elevation-2 z-10">
                      <div className="py-1">
                        <button
                          onClick={() => handleMenuAction('edit')}
                          className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-muted flex items-center space-x-2"
                        >
                          <Icon name="Edit" size={14} />
                          <span>Modifica</span>
                        </button>
                        <button
                          onClick={() => handleMenuAction('move')}
                          className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-muted flex items-center space-x-2"
                        >
                          <Icon name="FolderOpen" size={14} />
                          <span>Sposta in cartella</span>
                        </button>
                        <button
                          onClick={() => handleMenuAction('share')}
                          className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-muted flex items-center space-x-2"
                        >
                          <Icon name="Share" size={14} />
                          <span>Condividi</span>
                        </button>
                        <div className="border-t border-border my-1"></div>
                        <button
                          onClick={() => handleMenuAction('delete')}
                          className="w-full px-3 py-2 text-left text-sm text-error hover:bg-muted flex items-center space-x-2"
                        >
                          <Icon name="Trash2" size={14} />
                          <span>Elimina</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevation-1 transition-all duration-200">
      <div className="relative">
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(item?.id, e?.target?.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />
        </div>
        
        <div className="absolute top-2 right-2 z-10">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              <Icon name="MoreVertical" size={16} />
            </Button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-popover border border-border rounded-lg shadow-elevation-2 z-20">
                <div className="py-1">
                  <button
                    onClick={() => handleMenuAction('edit')}
                    className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="Edit" size={14} />
                    <span>Modifica</span>
                  </button>
                  <button
                    onClick={() => handleMenuAction('move')}
                    className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="FolderOpen" size={14} />
                    <span>Sposta in cartella</span>
                  </button>
                  <button
                    onClick={() => handleMenuAction('share')}
                    className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="Share" size={14} />
                    <span>Condividi</span>
                  </button>
                  <div className="border-t border-border my-1"></div>
                  <button
                    onClick={() => handleMenuAction('delete')}
                    className="w-full px-3 py-2 text-left text-sm text-error hover:bg-muted flex items-center space-x-2"
                  >
                    <Icon name="Trash2" size={14} />
                    <span>Elimina</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-32 bg-muted flex items-center justify-center overflow-hidden">
          {item?.thumbnail ? (
            <Image 
              src={item?.thumbnail} 
              alt={item?.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon name="FileText" size={32} className="text-text-secondary" />
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceBadgeColor(item?.source)}`}>
            {item?.source}
          </span>
        </div>
        
        <h3 className="text-sm font-medium text-text-primary mb-2 line-clamp-2">{item?.title}</h3>
        <p className="text-xs text-text-secondary mb-3 line-clamp-3">{item?.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-text-secondary">{formatDate(item?.savedDate)}</span>
            {item?.category && (
              <span className="text-xs text-text-secondary">{item?.category}</span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpen(item)}
            className="w-8 h-8"
          >
            <Icon name="ExternalLink" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SavedItemCard;