import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrendingTopicCard = ({ category, trendCount, popularityScore, recentTrends, icon, color = 'primary' }) => {
  const navigate = useNavigate();

  const handleQuickSearch = () => {
    navigate(`/advanced-search?category=${encodeURIComponent(category)}`);
  };

  const getPopularityLevel = () => {
    if (popularityScore >= 80) return { label: 'Hot', color: 'text-error' };
    if (popularityScore >= 60) return { label: 'Trending', color: 'text-warning' };
    if (popularityScore >= 40) return { label: 'Rising', color: 'text-accent' };
    return { label: 'Stable', color: 'text-text-secondary' };
  };

  const popularity = getPopularityLevel();

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${color}/10`}>
          <Icon name={icon} size={20} className={`text-${color}`} />
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${popularity?.color} bg-current/10`}>
          {popularity?.label}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-text-primary mb-2">{category}</h3>
        <div className="flex items-center justify-between text-sm text-text-secondary mb-3">
          <span>{trendCount} trends</span>
          <span>{popularityScore}% popularity</span>
        </div>
        
        <div className="space-y-2">
          {recentTrends?.slice(0, 3)?.map((trend, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-sm text-text-secondary truncate">{trend}</span>
            </div>
          ))}
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleQuickSearch}
        className="w-full"
        iconName="Search"
        iconPosition="left"
      >
        Quick Search
      </Button>
    </div>
  );
};

export default TrendingTopicCard;