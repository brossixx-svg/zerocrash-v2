import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    tooltip: 'Central command center with trending insights overview'
  },
  {
    label: 'Search',
    path: '/advanced-search',
    icon: 'Search',
    tooltip: 'Advanced trend discovery with sophisticated filtering'
  },
  {
    label: 'SEO Tools',
    path: '/seo-tools',
    icon: 'FileText',
    tooltip: 'Content generation workspace for optimized titles and meta descriptions'
  },
  {
    label: 'Saved Items',
    path: '/saved-items',
    icon: 'Bookmark',
    badge: 12,
    tooltip: 'Manage bookmarked searches, results, and generated content'
  },
  {
    label: 'Categories',
    path: '/category-management',
    icon: 'FolderTree',
    tooltip: 'Administrative interface for maintaining IT taxonomy structure'
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    tooltip: 'Platform configuration including API management and preferences'
  }];


  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActive = (path) => {
    return location?.pathname === path;
  };

  const SidebarContent = () =>
  <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex items-center p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Zap" size={20} color="white" />
          </div>
          {!isCollapsed &&
        <div className="flex flex-col">
              <span className="text-lg font-semibold text-text-primary">ZeroCrash</span>
              <span className="text-xs text-text-secondary">IT Trend Scouting</span>
            </div>
        }
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems?.map((item) => {
        const active = isActive(item?.path);

        return (
          <div key={item?.path} className="relative group">
              <Button
              variant={active ? "default" : "ghost"}



              onClick={() => handleNavigation(item?.path)}>

                <Icon
                name={item?.icon}
                size={20}
                className="bg-[rgba(136,27,27,0)]" />

                {!isCollapsed &&
              <>
                    <span className="flex-1 text-left">{item?.label}</span>
                    {item?.badge &&
                <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full">
                        {item?.badge}
                      </span>
                }
                  </>
              }
              </Button>
              {/* Tooltip for collapsed state */}
              {isCollapsed &&
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-elevation-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                  <div className="text-sm font-medium text-text-primary">{item?.label}</div>
                  {item?.tooltip &&
              <div className="text-xs text-text-secondary mt-1 max-w-48">{item?.tooltip}</div>
              }
                  {item?.badge &&
              <div className="text-xs text-accent mt-1">{item?.badge} items</div>
              }
                </div>
            }
            </div>);

      })}
      </nav>

      {/* Collapse Toggle (Desktop) */}
      {!isMobileOpen &&
    <div className="p-4 border-t border-border">
          <Button
        variant="ghost"
        size="icon"
        onClick={onToggleCollapse}
        className="w-full h-10">

            <Icon
          name={isCollapsed ? "ChevronRight" : "ChevronLeft"}
          size={20} />

          </Button>
        </div>
    }
    </div>;


  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen bg-surface border-r border-border shadow-elevation-1 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-72'} hidden lg:block`
      }>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen &&
      <div
        className="fixed inset-0 z-50 bg-black/50 lg:hidden"
        onClick={() => setIsMobileOpen(false)} />

      }

      {/* Mobile Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 h-screen w-72 bg-surface border-r border-border shadow-elevation-2 transform transition-transform duration-300 lg:hidden ${
      isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`
      }>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-text-primary">ZeroCrash</span>
              <span className="text-xs text-text-secondary">IT Trend Scouting</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(false)}>

            <Icon name="X" size={20} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-30 lg:hidden"
        onClick={() => setIsMobileOpen(true)}>

        <Icon name="Menu" size={20} />
      </Button>
    </>);

};

export default Sidebar;