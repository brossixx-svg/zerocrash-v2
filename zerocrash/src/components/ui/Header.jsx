import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, userProfile, loading: authLoading, signOut } = useAuth();

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      navigate(`/advanced-search?q=${encodeURIComponent(searchQuery?.trim())}`);
      setSearchQuery('');
      setIsSearchExpanded(false);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    setShowUserMenu(false);
    
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Logout error:', error?.message);
        return;
      }
      
      // Redirect to login page
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Logout error:', error?.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Mock notifications for demo
  const notifications = [
    { id: 1, title: 'New trend detected', message: 'AI/ML trends showing 15% growth', time: '2 min ago', unread: true },
    { id: 2, title: 'SEO analysis complete', message: 'Your content optimization is ready', time: '1 hour ago', unread: true },
    { id: 3, title: 'Weekly report available', message: 'IT trends summary for this week', time: '3 hours ago', unread: false },
  ];

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border shadow-elevation-1">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-text-primary">ZeroCrash</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <form onSubmit={handleSearch} className="relative">
            <div className={`relative transition-all duration-300 ${isSearchExpanded ? 'w-full' : 'w-full md:w-96'}`}>
              <Input
                type="search"
                placeholder="Search trends, technologies, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={() => setIsSearchExpanded(false)}
                className="pl-10 pr-4"
              />
              <Icon 
                name="Search" 
                size={18} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
              />
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Quick Search Button (Mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => navigate('/advanced-search')}
          >
            <Icon name="Search" size={20} />
          </Button>

          {/* Authentication-aware content */}
          {!authLoading && user ? (
            <>
              {/* Notifications - Only for authenticated users */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNotificationClick}
                  className="relative"
                >
                  <Icon name="Bell" size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-popover border border-border rounded-lg shadow-elevation-2 z-50">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-medium text-text-primary">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications?.map((notification) => (
                        <div
                          key={notification?.id}
                          className={`p-4 border-b border-border hover:bg-muted cursor-pointer ${
                            notification?.unread ? 'bg-accent/5' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-text-primary">{notification?.title}</p>
                              <p className="text-sm text-text-secondary mt-1">{notification?.message}</p>
                              <p className="text-xs text-text-secondary mt-2">{notification?.time}</p>
                            </div>
                            {notification?.unread && (
                              <div className="w-2 h-2 bg-accent rounded-full mt-1"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-border">
                      <Button variant="ghost" size="sm" className="w-full">
                        View all notifications
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <Button variant="ghost" size="icon">
                <Icon name="Moon" size={20} />
              </Button>

              {/* User Menu - Authenticated */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUserMenuClick}
                  className="rounded-full"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} color="white" />
                  </div>
                </Button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-56 bg-popover border border-border rounded-lg shadow-elevation-2 z-50">
                    <div className="p-4 border-b border-border">
                      <p className="font-medium text-text-primary">
                        {userProfile?.full_name || user?.email?.split('@')?.[0] || 'User'}
                      </p>
                      <p className="text-sm text-text-secondary truncate">
                        {user?.email}
                      </p>
                      {userProfile?.role && userProfile?.role !== 'user' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800 mt-2">
                          {userProfile?.role}
                        </span>
                      )}
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/dashboard');
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-muted flex items-center space-x-2"
                      >
                        <Icon name="LayoutDashboard" size={16} />
                        <span>Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/settings');
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-muted flex items-center space-x-2"
                      >
                        <Icon name="Settings" size={16} />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/saved-items');
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-muted flex items-center space-x-2"
                      >
                        <Icon name="Bookmark" size={16} />
                        <span>Saved Items</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/seo-tools');
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-muted flex items-center space-x-2"
                      >
                        <Icon name="Search" size={16} />
                        <span>SEO Tools</span>
                      </button>
                      <div className="border-t border-border my-2"></div>
                      <button
                        onClick={handleSignOut}
                        disabled={isLoggingOut}
                        className="w-full px-4 py-2 text-left text-sm text-error hover:bg-muted flex items-center space-x-2 disabled:opacity-50"
                      >
                        {isLoggingOut ? (
                          <Icon name="Loader" size={16} className="animate-spin" />
                        ) : (
                          <Icon name="LogOut" size={16} />
                        )}
                        <span>{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : !authLoading ? (
            /* Not authenticated - Show Sign In button */
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth')}
                iconName="LogIn"
                iconPosition="left"
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/auth')}
                iconName="UserPlus"
                iconPosition="left"
              >
                Sign Up
              </Button>
            </div>
          ) : (
            /* Loading state */
            <div className="w-8 h-8 bg-muted rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;