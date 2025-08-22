import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActionsPanel = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: 'New Search',
      description: 'Start discovering trends',
      icon: 'Search',
      variant: 'default',
      action: () => navigate('/advanced-search')
    },
    {
      label: 'Manage Categories',
      description: 'Organize your topics',
      icon: 'FolderTree',
      variant: 'outline',
      action: () => navigate('/category-management')
    },
    {
      label: 'SEO Tools',
      description: 'Generate content',
      icon: 'FileText',
      variant: 'outline',
      action: () => navigate('/seo-tools')
    },
    {
      label: 'View Saved',
      description: 'Access saved items',
      icon: 'Bookmark',
      variant: 'outline',
      action: () => navigate('/saved-items')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
      <div className="space-y-3">
        {quickActions?.map((action, index) => (
          <Button
            key={index}
            variant={action?.variant}
            onClick={action?.action}
            className="w-full justify-start h-auto p-4"
            iconName={action?.icon}
            iconPosition="left"
          >
            <div className="text-left">
              <div className="font-medium">{action?.label}</div>
              <div className="text-xs text-text-secondary mt-1">{action?.description}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel;