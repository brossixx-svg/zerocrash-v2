import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SavedItemPreview = ({ title, type, category, savedAt, difficulty, source }) => {
  const navigate = useNavigate();

  const handleViewItem = () => {
    navigate('/saved-items');
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'search': return 'Search';
      case 'seo': return 'FileText';
      case 'result': return 'Bookmark';
      default: return 'File';
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'search': return 'text-accent';
      case 'seo': return 'text-success';
      case 'result': return 'text-warning';
      default: return 'text-text-secondary';
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Easy': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'Hard': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const formatSavedAt = (timestamp) => {
    const now = new Date();
    const savedTime = new Date(timestamp);
    const diffInHours = Math.floor((now - savedTime) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer" onClick={handleViewItem}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-2 flex-1 min-w-0">
          <Icon name={getTypeIcon()} size={16} className={getTypeColor()} />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-text-primary truncate">{title}</h4>
            <p className="text-xs text-text-secondary">{category}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 flex-shrink-0 w-6 h-6"
        >
          <Icon name="ExternalLink" size={12} />
        </Button>
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-text-secondary">
          <span>{source}</span>
          {difficulty && (
            <>
              <span>•</span>
              <span className={getDifficultyColor()}>{difficulty}</span>
            </>
          )}
        </div>
        <span className="text-text-secondary">{formatSavedAt(savedAt)}</span>
      </div>
    </div>
  );
};

export default SavedItemPreview;