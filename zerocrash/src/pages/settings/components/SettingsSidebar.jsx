import React from 'react';
import { cn } from '../../../utils/cn';
import Icon from '../../../components/AppIcon';

const SettingsSidebar = ({ 
  sections = [], 
  activeSection, 
  onSectionChange, 
  hasUnsavedChanges = false 
}) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary">
          Sezioni Impostazioni
        </h3>
      </div>
      <nav className="p-2">
        {sections?.map((section) => (
          <button
            key={section?.id}
            onClick={() => onSectionChange?.(section?.id)}
            className={cn(
              "w-full flex items-start gap-3 px-3 py-3 rounded-md text-left transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              activeSection === section?.id 
                ? "bg-primary text-primary-foreground" 
                : "text-text-secondary"
            )}
          >
            <Icon 
              name={section?.icon} 
              size={18} 
              className={cn(
                "mt-0.5 flex-shrink-0",
                activeSection === section?.id 
                  ? "text-primary-foreground" 
                  : "text-text-secondary"
              )} 
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">
                {section?.label}
                {hasUnsavedChanges && activeSection === section?.id && (
                  <span className="text-warning ml-1">*</span>
                )}
              </div>
              <div className={cn(
                "text-xs mt-1 opacity-80",
                activeSection === section?.id 
                  ? "text-primary-foreground" 
                  : "text-text-secondary"
              )}>
                {section?.description}
              </div>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SettingsSidebar;