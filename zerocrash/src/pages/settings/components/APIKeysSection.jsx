import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';
import { useAuth } from '../../../contexts/AuthContext';
import { settingsService } from '../../../services/settingsService';

const APIKeysSection = ({ onSettingsChange }) => {
  const { user, loading: authLoading } = useAuth();
  const [apiKeys, setApiKeys] = useState({
    googleCSE: {
      apiKey: '',
      searchEngineId: '',
      status: 'disconnected'
    },
    youtubeDataAPI: {
      apiKey: '',
      status: 'disconnected'
    },
    redditAPI: {
      clientId: '',
      clientSecret: '',
      userAgent: 'TrendTech-App/1.0',
      status: 'disconnected'
    }
  });
  
  const [storageOption, setStorageOption] = useState('supabase');
  const [testing, setTesting] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const storageOptions = [
    { value: 'supabase', label: 'Supabase (Cloud)' },
    { value: 'local', label: 'Local Storage' },
    { value: 'encrypted', label: 'Encrypted Local Storage' }
  ];

  // Load user's API keys on mount
  useEffect(() => {
    if (!authLoading && user?.id) {
      loadAPIKeys();
    } else if (!authLoading && !user) {
      // Clear loading state if user is not authenticated
      setLoading(false);
    }
  }, [user?.id, authLoading]);

  const loadAPIKeys = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);

      const { data: settings, error: serviceError } = await settingsService?.getSettings(user?.id);
      
      if (serviceError) {
        setError(`Failed to load API settings: ${serviceError?.message}`);
        return;
      }

      // If we have API keys in the settings, merge them with defaults
      if (settings?.api_keys && Object.keys(settings?.api_keys)?.length > 0) {
        setApiKeys(prevKeys => ({
          googleCSE: {
            ...prevKeys?.googleCSE,
            ...settings?.api_keys?.googleCSE
          },
          youtubeDataAPI: {
            ...prevKeys?.youtubeDataAPI,
            ...settings?.api_keys?.youtubeDataAPI
          },
          redditAPI: {
            ...prevKeys?.redditAPI,
            ...settings?.api_keys?.redditAPI
          }
        }));
      }
    } catch (err) {
      setError(`Failed to load API settings: ${err?.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAPIKeyChange = (service, field, value) => {
    setApiKeys(prev => ({
      ...prev,
      [service]: {
        ...prev?.[service],
        [field]: value,
        status: value ? 'needs-testing' : 'disconnected'
      }
    }));

    // Clear any existing errors when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleSaveChanges = async () => {
    if (!user?.id || saving) return;

    try {
      setSaving(true);
      setError(null);
      
      const { error: saveError } = await settingsService?.updateAPIKeys(user?.id, apiKeys);
      
      if (saveError) {
        setError(`Failed to save API keys: ${saveError?.message}`);
        return;
      }

      // Notify parent component of changes
      onSettingsChange?.();
      
      // Show success message temporarily
      const successTimer = setTimeout(() => {
        setError(null);
      }, 3000);

      // Clear the timer if component unmounts
      return () => clearTimeout(successTimer);
      
    } catch (err) {
      setError(`Failed to save API keys: ${err?.message}`);
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (service) => {
    if (!user?.id) {
      setError('User authentication required');
      return;
    }

    const credentials = apiKeys?.[service];
    
    // Validate required fields before testing
    if (service === 'googleCSE' && (!credentials?.apiKey || !credentials?.searchEngineId)) {
      setError('Google CSE requires both API Key and Search Engine ID');
      return;
    }
    if (service === 'youtubeDataAPI' && !credentials?.apiKey) {
      setError('YouTube API requires an API Key');
      return;
    }
    if (service === 'redditAPI' && (!credentials?.clientId || !credentials?.clientSecret)) {
      setError('Reddit API requires both Client ID and Client Secret');
      return;
    }

    setTesting(prev => ({ ...prev, [service]: true }));
    setError(null);
    
    try {
      const result = await settingsService?.testAPIConnection(service, credentials);
      
      setApiKeys(prev => ({
        ...prev,
        [service]: {
          ...prev?.[service],
          status: result?.connected ? 'connected' : 'error'
        }
      }));

      if (!result?.connected && result?.error) {
        setError(`${service} connection failed: ${result?.error}`);
      }
    } catch (error) {
      setApiKeys(prev => ({
        ...prev,
        [service]: {
          ...prev?.[service],
          status: 'error'
        }
      }));
      setError(`Connection test failed: ${error?.message}`);
    } finally {
      setTesting(prev => ({ ...prev, [service]: false }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <Icon name="CheckCircle" size={16} className="text-green-600" />;
      case 'error':
        return <Icon name="XCircle" size={16} className="text-red-600" />;
      case 'needs-testing':
        return <Icon name="AlertCircle" size={16} className="text-yellow-600" />;
      default:
        return <Icon name="Circle" size={16} className="text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connesso ✅';
      case 'error':
        return 'Errore chiave ❌';
      case 'needs-testing':
        return 'Test richiesto';
      default:
        return 'Non configurato';
    }
  };

  // Show loading state only when actually loading and user is authenticated
  if (loading && user?.id) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-gray-600">
          <Icon name="Loader" size={16} className="animate-spin" />
          <span>Loading API settings...</span>
        </div>
      </div>
    );
  }

  // Show authentication required message
  if (!authLoading && !user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center gap-2">
          <Icon name="AlertCircle" size={16} className="text-yellow-600" />
          <span className="text-yellow-800 font-medium">
            Please sign in to manage your API keys
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Icon name="AlertCircle" size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-red-800 font-medium">Error</span>
                <p className="text-red-700 mt-1 text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 text-sm ml-4 flex-shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* Saving Indicator */}
      {saving && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Icon name="Loader" size={16} className="text-blue-600 animate-spin" />
            <span className="text-blue-800">Saving API keys...</span>
          </div>
        </div>
      )}
      {/* Storage Configuration */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configurazione Archiviazione
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Metodo di Archiviazione"
            value={storageOption}
            onChange={(value) => {
              setStorageOption(value);
              onSettingsChange?.();
            }}
            options={storageOptions}
            description="Le chiavi vengono salvate crittografate in Supabase"
          />
          <div className="flex items-end">
            <Button
              variant="outline"
              iconName="Shield"
              iconPosition="left"
              className="h-10"
              disabled
            >
              Crittografia Attiva
            </Button>
          </div>
        </div>
      </div>
      {/* Google Custom Search Engine */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Google Custom Search Engine
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Richiesto per ricerche Google. Ottieni le credenziali dalla Google Cloud Console.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(apiKeys?.googleCSE?.status)}
            <span className={cn(
              "text-sm font-medium",
              apiKeys?.googleCSE?.status === 'connected' && "text-green-600",
              apiKeys?.googleCSE?.status === 'error' && "text-red-600",
              apiKeys?.googleCSE?.status === 'needs-testing' && "text-yellow-600"
            )}>
              {getStatusText(apiKeys?.googleCSE?.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            type="password"
            label="API Key"
            placeholder="Inserisci la tua Google CSE API Key"
            value={apiKeys?.googleCSE?.apiKey || ''}
            onChange={(e) => handleAPIKeyChange('googleCSE', 'apiKey', e?.target?.value)}
            required
          />
          <Input
            label="Search Engine ID"
            placeholder="Inserisci il Search Engine ID"
            value={apiKeys?.googleCSE?.searchEngineId || ''}
            onChange={(e) => handleAPIKeyChange('googleCSE', 'searchEngineId', e?.target?.value)}
            required
          />
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            onClick={() => testConnection('googleCSE')}
            loading={testing?.googleCSE}
            disabled={!apiKeys?.googleCSE?.apiKey || !apiKeys?.googleCSE?.searchEngineId}
            iconName="Zap"
            iconPosition="left"
          >
            Testa Connessione
          </Button>
          <Button
            variant="ghost"
            iconName="ExternalLink"
            iconPosition="right"
            onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
          >
            Documentazione API
          </Button>
        </div>
      </div>
      {/* YouTube Data API */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              YouTube Data API v3
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Richiesto per ricerche YouTube. Stessa API key di Google CSE.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(apiKeys?.youtubeDataAPI?.status)}
            <span className={cn(
              "text-sm font-medium",
              apiKeys?.youtubeDataAPI?.status === 'connected' && "text-green-600",
              apiKeys?.youtubeDataAPI?.status === 'error' && "text-red-600",
              apiKeys?.youtubeDataAPI?.status === 'needs-testing' && "text-yellow-600"
            )}>
              {getStatusText(apiKeys?.youtubeDataAPI?.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            type="password"
            label="API Key"
            placeholder="Inserisci la tua YouTube Data API Key"
            value={apiKeys?.youtubeDataAPI?.apiKey || ''}
            onChange={(e) => handleAPIKeyChange('youtubeDataAPI', 'apiKey', e?.target?.value)}
            required
          />
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => testConnection('youtubeDataAPI')}
              loading={testing?.youtubeDataAPI}
              disabled={!apiKeys?.youtubeDataAPI?.apiKey}
              iconName="Zap"
              iconPosition="left"
              className="h-10"
            >
              Testa Connessione
            </Button>
          </div>
        </div>
      </div>
      {/* Reddit API */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Reddit API
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Richiesto per ricerche Reddit. Crea un'app su reddit.com/prefs/apps
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(apiKeys?.redditAPI?.status)}
            <span className={cn(
              "text-sm font-medium",
              apiKeys?.redditAPI?.status === 'connected' && "text-green-600",
              apiKeys?.redditAPI?.status === 'error' && "text-red-600",
              apiKeys?.redditAPI?.status === 'needs-testing' && "text-yellow-600"
            )}>
              {getStatusText(apiKeys?.redditAPI?.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Client ID"
            placeholder="Inserisci il Client ID"
            value={apiKeys?.redditAPI?.clientId || ''}
            onChange={(e) => handleAPIKeyChange('redditAPI', 'clientId', e?.target?.value)}
            required
          />
          <Input
            type="password"
            label="Client Secret"
            placeholder="Inserisci il Client Secret"
            value={apiKeys?.redditAPI?.clientSecret || ''}
            onChange={(e) => handleAPIKeyChange('redditAPI', 'clientSecret', e?.target?.value)}
            required
          />
        </div>

        <div className="mt-4">
          <Input
            label="User Agent (Optional)"
            placeholder="YourApp/1.0"
            value={apiKeys?.redditAPI?.userAgent || ''}
            onChange={(e) => handleAPIKeyChange('redditAPI', 'userAgent', e?.target?.value)}
            description="Identificativo univoco per la tua app"
          />
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            onClick={() => testConnection('redditAPI')}
            loading={testing?.redditAPI}
            disabled={!apiKeys?.redditAPI?.clientId || !apiKeys?.redditAPI?.clientSecret}
            iconName="Zap"
            iconPosition="left"
          >
            Testa Connessione
          </Button>
          <Button
            variant="ghost"
            iconName="ExternalLink"
            iconPosition="right"
            onClick={() => window.open('https://www.reddit.com/prefs/apps', '_blank')}
          >
            Documentazione API
          </Button>
        </div>
      </div>
      {/* Save Changes Button */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Salva Modifiche</h4>
            <p className="text-sm text-gray-600 mt-1">
              Salva tutte le modifiche alle chiavi API su Supabase
            </p>
          </div>
          <Button
            onClick={handleSaveChanges}
            loading={saving}
            disabled={saving}
            iconName="Save"
            iconPosition="left"
          >
            Salva Modifiche
          </Button>
        </div>
      </div>
      {/* Connection Status Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Stato delle Connessioni API</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(apiKeys)?.map(([service, config]) => (
            <div key={service} className="flex items-center gap-3">
              {getStatusIcon(config?.status)}
              <span className="text-sm text-gray-700">
                {service === 'googleCSE' && 'Google CSE'}
                {service === 'youtubeDataAPI' && 'YouTube API'}
                {service === 'redditAPI' && 'Reddit API'}
              </span>
            </div>
          ))}
        </div>
        
        {Object.values(apiKeys)?.some(config => config?.status === 'connected') && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              ✅ Le ricerche ora utilizzano le tue API chiavi invece dei dati demo
            </p>
          </div>
        )}

        {Object.values(apiKeys)?.every(config => config?.status === 'disconnected' || config?.status === 'error') && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ Configura e testa le connessioni API per utilizzare dati reali nelle ricerche
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default APIKeysSection;