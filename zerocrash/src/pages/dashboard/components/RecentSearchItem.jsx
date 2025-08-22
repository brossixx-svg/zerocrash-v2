import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentSearchItem = ({ query, category, timestamp, resultsCount, sources }) => {
  const navigate = useNavigate();

  const handleRepeatSearch = () => {
    navigate(`/advanced-search?q=${encodeURIComponent(query)}&category=${encodeURIComponent(category)}`);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const searchTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - searchTime) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'google': return 'Search';
      case 'youtube': return 'Play';
      case 'reddit': return 'MessageSquare';
      default: return 'Globe';
    }
  };

  return (
    <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors duration-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-text-primary truncate">{query}</h4>
          <p className="text-xs text-text-secondary">{category}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRepeatSearch}
          className="ml-2 flex-shrink-0 w-8 h-8"
        >
          <Icon name="RotateCcw" size={14} />
        </Button>
      </div>
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <div className="flex items-center space-x-2">
          <span>{resultsCount} results</span>
          <span>•</span>
          <span>{formatTimestamp(timestamp)}</span>
        </div>
        <div className="flex items-center space-x-1">
          {sources?.map((source, index) => (
            <Icon key={index} name={getSourceIcon(source)} size={12} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentSearchItem;