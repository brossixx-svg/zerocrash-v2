import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ResultCard = ({ result, isSelected, onSelect, onSave, onCopy }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSourceIcon = (source) => {
    switch (source) {
      case 'google': return 'Globe';
      case 'youtube': return 'Youtube';
      case 'reddit': return 'MessageCircle';
      default: return 'Globe';
    }
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'google': return 'bg-blue-500';
      case 'youtube': return 'bg-red-500';
      case 'reddit': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Facile';
      case 'medium': return 'Medio';
      case 'hard': return 'Difficile';
      default: return 'N/A';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(result?.url);
      onCopy?.(result);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-elevation-1 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox
            checked={isSelected}
            onChange={(e) => onSelect(result?.id, e?.target?.checked)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs text-white ${getSourceColor(result?.source)}`}>
                <Icon name={getSourceIcon(result?.source)} size={12} />
                <span className="capitalize">{result?.source}</span>
              </div>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(result?.difficulty)}`}>
                {getDifficultyLabel(result?.difficulty)}
              </div>
              
              <div className="flex items-center space-x-1 text-xs text-text-secondary">
                <Icon name="TrendingUp" size={12} />
                <span>{result?.popularity}%</span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-2">
              <a 
                href={result?.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                {result?.title}
              </a>
            </h3>
            
            <p className={`text-text-secondary text-sm leading-relaxed ${
              isExpanded ? '' : 'line-clamp-3'
            }`}>
              {result?.description}
            </p>
            
            {result?.description?.length > 150 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 p-0 h-auto text-primary hover:text-primary/80"
              >
                {isExpanded ? 'Mostra meno' : 'Mostra di più'}
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={14} />
            <span>{formatDate(result?.publishedAt)}</span>
          </div>
          
          {result?.author && (
            <div className="flex items-center space-x-1">
              <Icon name="User" size={14} />
              <span>{result?.author}</span>
            </div>
          )}
          
          {result?.readTime && (
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{result?.readTime} min</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <Icon name="Eye" size={14} />
          <span>{result?.views?.toLocaleString('it-IT') || 'N/A'} visualizzazioni</span>
        </div>
      </div>
      {/* Keywords */}
      {result?.keywords && result?.keywords?.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {result?.keywords?.slice(0, 5)?.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-full"
              >
                {keyword}
              </span>
            ))}
            {result?.keywords?.length > 5 && (
              <span className="px-2 py-1 bg-muted text-text-secondary text-xs rounded-full">
                +{result?.keywords?.length - 5} altri
              </span>
            )}
          </div>
        </div>
      )}
      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(result?.url, '_blank')}
            iconName="ExternalLink"
            iconPosition="left"
          >
            Apri
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            iconName="Copy"
            iconPosition="left"
          >
            Copia
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave?.(result)}
            iconName="Bookmark"
            iconPosition="left"
          >
            Salva
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Share2"
          >
            Condividi
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="MoreHorizontal"
          >
            Altro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;