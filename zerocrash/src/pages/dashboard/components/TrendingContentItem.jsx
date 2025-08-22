import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrendingContentItem = ({ title, source, difficulty, popularityScore, category, url, description, publishedAt }) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e?.stopPropagation();
    setIsSaved(!isSaved);
    // In real app, this would save to backend/localStorage
  };

  const handleOpen = (e) => {
    e?.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getSourceIcon = () => {
    switch (source?.toLowerCase()) {
      case 'google': return 'Search';
      case 'youtube': return 'Play';
      case 'reddit': return 'MessageSquare';
      default: return 'Globe';
    }
  };

  const getSourceColor = () => {
    switch (source?.toLowerCase()) {
      case 'google': return 'text-accent';
      case 'youtube': return 'text-error';
      case 'reddit': return 'text-warning';
      default: return 'text-text-secondary';
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'Easy': return 'bg-success/10 text-success';
      case 'Medium': return 'bg-warning/10 text-warning';
      case 'Hard': return 'bg-error/10 text-error';
      default: return 'bg-muted text-text-secondary';
    }
  };

  const formatPublishedAt = (timestamp) => {
    const now = new Date();
    const publishTime = new Date(timestamp);
    const diffInHours = Math.floor((now - publishTime) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon name={getSourceIcon()} size={16} className={getSourceColor()} />
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">{source}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor()}`}>
            {difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className="w-8 h-8"
          >
            <Icon 
              name={isSaved ? "Bookmark" : "BookmarkPlus"} 
              size={14} 
              className={isSaved ? "text-accent" : "text-text-secondary"} 
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleOpen}
            className="w-8 h-8"
          >
            <Icon name="ExternalLink" size={14} />
          </Button>
        </div>
      </div>
      
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-text-primary mb-2 line-clamp-2 leading-relaxed">
          {title}
        </h3>
        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-muted rounded text-xs">{category}</span>
          <span>{formatPublishedAt(publishedAt)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="TrendingUp" size={12} />
          <span>{popularityScore}%</span>
        </div>
      </div>
    </div>
  );
};

export default TrendingContentItem;