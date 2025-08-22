import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { settingsService } from '../../../services/settingsService';

const APIStatusIndicator = () => {
  const { user } = useAuth();
  const [apiStatus, setApiStatus] = useState({
    google: { connected: false, testing: false },
    youtube: { connected: false, testing: false },
    reddit: { connected: false, testing: false }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      checkAPIStatus();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const checkAPIStatus = async () => {
    try {
      setLoading(true);
      const { data: settings } = await settingsService?.getSettings(user?.id);
      
      if (settings?.api_keys) {
        const status = {};
        
        // Check each API service
        for (const [service, config] of Object.entries(settings?.api_keys)) {
          const serviceKey = service === 'googleCSE' ? 'google' : 
                           service === 'youtubeDataAPI' ? 'youtube' : 'reddit';
          
          status[serviceKey] = {
            connected: config?.status === 'connected' || 
                      (config?.apiKey && config?.status !== 'error') ||
                      (config?.clientId && config?.clientSecret && config?.status !== 'error'),
            testing: false
          };
        }
        
        setApiStatus(prevStatus => ({ ...prevStatus, ...status }));
      }
    } catch (error) {
      console.error('Error checking API status:', error);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (service) => {
    if (!user?.id) return;
    
    setApiStatus(prev => ({
      ...prev,
      [service]: { ...prev?.[service], testing: true }
    }));

    try {
      const { data: settings } = await settingsService?.getSettings(user?.id);
      const serviceMap = {
        google: 'googleCSE',
        youtube: 'youtubeDataAPI', 
        reddit: 'redditAPI'
      };
      
      const serviceKey = serviceMap?.[service];
      const credentials = settings?.api_keys?.[serviceKey];
      
      if (credentials) {
        const result = await settingsService?.testAPIConnection(serviceKey, credentials);
        
        setApiStatus(prev => ({
          ...prev,
          [service]: { connected: result?.connected, testing: false }
        }));
      }
    } catch (error) {
      setApiStatus(prev => ({
        ...prev,
        [service]: { connected: false, testing: false }
      }));
    }
  };

  const getStatusColor = (connected, testing) => {
    if (testing) return 'text-warning';
    return connected ? 'text-success' : 'text-error';
  };

  const getStatusIcon = (connected, testing) => {
    if (testing) return 'Loader';
    return connected ? 'CheckCircle' : 'XCircle';
  };

  const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg border border-border p-6">
        <h3 className="font-semibold text-text-primary mb-4">Stato API</h3>
        <div className="text-center py-4">
          <Icon name="Shield" size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-text-secondary text-sm">
            Accedi per visualizzare lo stato delle tue API
          </p>
        </div>
      </div>
    );
  }

  const services = [
    { key: 'google', label: 'Google CSE', icon: 'Search' },
    { key: 'youtube', label: 'YouTube', icon: 'Video' },
    { key: 'reddit', label: 'Reddit', icon: 'MessageSquare' }
  ];

  const connectedCount = Object.values(apiStatus)?.filter(s => s?.connected)?.length;

  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary">Stato API</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">
          {connectedCount}/3 connesse
        </span>
      </div>

      <div className="space-y-3">
        {services?.map((service) => {
          const status = apiStatus?.[service?.key];
          return (
            <div key={service?.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon 
                  name={service?.icon} 
                  size={16} 
                  className="text-text-secondary" 
                />
                <span className="text-sm text-text-primary font-medium">
                  {service?.label}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Icon
                  name={getStatusIcon(status?.connected, status?.testing)}
                  size={16}
                  className={cn(
                    getStatusColor(status?.connected, status?.testing),
                    status?.testing && 'animate-spin'
                  )}
                />
                
                {!status?.testing && (
                  <button
                    onClick={() => testConnection(service?.key)}
                    className="text-xs text-text-secondary hover:text-accent transition-colors"
                    title="Test connection"
                  >
                    Test
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {connectedCount === 0 && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-warning text-xs">
            Configura le tue API per abilitare le ricerche reali
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/settings'}
            className="mt-1 text-warning hover:text-warning/80 p-0 h-auto"
          >
            Vai alle Impostazioni →
          </Button>
        </div>
      )}
    </div>
  );
};

export default APIStatusIndicator;