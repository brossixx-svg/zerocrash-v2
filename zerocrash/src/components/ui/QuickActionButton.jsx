import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getContextualActions = () => {
    const currentPath = location?.pathname;
    
    switch (currentPath) {
      case '/dashboard':
        return [
          {
            label: 'New Search',
            icon: 'Search',
            action: () => navigate('/advanced-search'),
            primary: true
          },
          {
            label: 'Quick SEO',
            icon: 'FileText',
            action: () => navigate('/seo-tools')
          }
        ];
      
      case '/advanced-search':
        return [
          {
            label: 'Save Results',
            icon: 'Bookmark',
            action: () => handleSaveResults(),
            primary: true
          },
          {
            label: 'Generate SEO',
            icon: 'FileText',
            action: () => navigate('/seo-tools')
          }
        ];
      
      case '/seo-tools':
        return [
          {
            label: 'Save Content',
            icon: 'Save',
            action: () => handleSaveContent(),
            primary: true
          },
          {
            label: 'New Search',
            icon: 'Search',
            action: () => navigate('/advanced-search')
          }
        ];
      
      case '/saved-items':
        return [
          {
            label: 'New Search',
            icon: 'Search',
            action: () => navigate('/advanced-search'),
            primary: true
          },
          {
            label: 'Create Category',
            icon: 'FolderPlus',
            action: () => navigate('/category-management')
          }
        ];
      
      case '/category-management':
        return [
          {
            label: 'New Category',
            icon: 'FolderPlus',
            action: () => handleNewCategory(),
            primary: true
          },
          {
            label: 'Import Data',
            icon: 'Upload',
            action: () => handleImportData()
          }
        ];
      
      default:
        return [
          {
            label: 'New Search',
            icon: 'Search',
            action: () => navigate('/advanced-search'),
            primary: true
          }
        ];
    }
  };

  const handleSaveResults = () => {
    // Simulate saving search results
    console.log('Saving search results...');
    // In real app, this would save current search results to saved items
  };

  const handleSaveContent = () => {
    // Simulate saving generated content
    console.log('Saving generated content...');
    // In real app, this would save current SEO content
  };

  const handleNewCategory = () => {
    // Simulate creating new category
    console.log('Creating new category...');
    // In real app, this would open a modal or form for new category
  };

  const handleImportData = () => {
    // Simulate importing data
    console.log('Importing data...');
    // In real app, this would open file picker or import modal
  };

  const actions = getContextualActions();
  const primaryAction = actions?.find(action => action?.primary) || actions?.[0];
  const secondaryActions = actions?.filter(action => !action?.primary);

  const handlePrimaryAction = () => {
    if (primaryAction) {
      primaryAction?.action();
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Secondary Actions (when expanded) */}
      {isExpanded && secondaryActions?.length > 0 && (
        <div className="mb-4 space-y-3">
          {secondaryActions?.map((action, index) => (
            <div
              key={index}
              className="flex items-center justify-end animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="mr-3 px-3 py-2 bg-popover border border-border rounded-lg shadow-elevation-1 text-sm text-text-primary whitespace-nowrap">
                {action?.label}
              </span>
              <Button
                variant="secondary"
                size="icon"
                onClick={action?.action}
                className="w-12 h-12 rounded-full shadow-elevation-2 hover:shadow-elevation-2 transition-all duration-200"
              >
                <Icon name={action?.icon} size={20} />
              </Button>
            </div>
          ))}
        </div>
      )}
      {/* Primary Action Button */}
      <div className="flex items-center justify-end">
        {isExpanded && (
          <span className="mr-3 px-3 py-2 bg-popover border border-border rounded-lg shadow-elevation-1 text-sm text-text-primary whitespace-nowrap animate-fade-in">
            {primaryAction?.label}
          </span>
        )}
        
        <div className="relative">
          {/* Primary Action */}
          <Button
            variant="default"
            size="icon"
            onClick={handlePrimaryAction}
            className="w-14 h-14 rounded-full shadow-elevation-2 hover:shadow-elevation-2 transition-all duration-200 bg-primary hover:bg-primary/90"
          >
            <Icon name={primaryAction?.icon} size={24} color="white" />
          </Button>

          {/* Expand/Collapse Toggle (only if there are secondary actions) */}
          {secondaryActions?.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleExpanded}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-elevation-1"
            >
              <Icon 
                name={isExpanded ? "Minus" : "Plus"} 
                size={12} 
                color="white"
              />
            </Button>
          )}
        </div>
      </div>
      {/* Backdrop (when expanded) */}
      {isExpanded && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default QuickActionButton;