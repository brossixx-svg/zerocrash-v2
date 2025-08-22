import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { cn } from '../../../utils/cn';

const DatabaseConfigSection = ({ onSettingsChange }) => {
  const [dbConfig, setDbConfig] = useState({
    supabase: {
      url: '',
      anonKey: '',
      status: 'disconnected'
    },
    indexedDB: {
      enabled: true,
      maxSize: 50,
      autoCleanup: true,
      cleanupDays: 30
    },
    backup: {
      autoBackup: false,
      frequency: 'weekly',
      destination: 'local',
      retention: 4
    }
  });
  
  const [testing, setTesting] = useState(false);

  const backupFrequencyOptions = [
    { value: 'daily', label: 'Giornaliero' },
    { value: 'weekly', label: 'Settimanale' },
    { value: 'monthly', label: 'Mensile' }
  ];

  const backupDestinationOptions = [
    { value: 'local', label: 'Download Locale' },
    { value: 'cloud', label: 'Cloud Storage' },
    { value: 'supabase', label: 'Supabase Storage' }
  ];

  const handleConfigChange = (section, field, value) => {
    setDbConfig(prev => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [field]: value
      }
    }));
    onSettingsChange?.();
  };

  const testSupabaseConnection = async () => {
    setTesting(true);
    
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock connection result
      const isValid = dbConfig?.supabase?.url && dbConfig?.supabase?.anonKey;
      
      setDbConfig(prev => ({
        ...prev,
        supabase: {
          ...prev?.supabase,
          status: isValid ? 'connected' : 'error'
        }
      }));
    } catch (error) {
      setDbConfig(prev => ({
        ...prev,
        supabase: {
          ...prev?.supabase,
          status: 'error'
        }
      }));
    } finally {
      setTesting(false);
    }
  };

  const handleBackupNow = async () => {
    try {
      // Mock backup operation
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Backup completato con successo!');
    } catch (error) {
      alert('Errore durante il backup');
    }
  };

  const handleRestoreBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.db';
    input.onchange = async (e) => {
      const file = e?.target?.files?.[0];
      if (file) {
        // Mock restore operation
        alert(`Ripristino dal file ${file?.name} - Funzionalità da implementare`);
      }
    };
    input?.click();
  };

  const clearIndexedDB = async () => {
    const confirm = window.confirm('Sei sicuro di voler eliminare tutti i dati locali? Questa azione non è reversibile.');
    if (confirm) {
      // Mock clear operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Dati locali eliminati');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <Icon name="CheckCircle" size={16} className="text-success" />;
      case 'error':
        return <Icon name="XCircle" size={16} className="text-error" />;
      default:
        return <Icon name="Circle" size={16} className="text-text-secondary" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected':
        return 'Connesso';
      case 'error':
        return 'Errore di connessione';
      default:
        return 'Non configurato';
    }
  };

  return (
    <div className="space-y-8">
      {/* Supabase Configuration */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Configurazione Supabase
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Connetti il database Supabase per la sincronizzazione cloud
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(dbConfig?.supabase?.status)}
            <span className={cn(
              "text-sm font-medium",
              dbConfig?.supabase?.status === 'connected' && "text-success",
              dbConfig?.supabase?.status === 'error' && "text-error"
            )}>
              {getStatusText(dbConfig?.supabase?.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Supabase URL"
            placeholder="https://your-project.supabase.co"
            value={dbConfig?.supabase?.url}
            onChange={(e) => handleConfigChange('supabase', 'url', e?.target?.value)}
            required
          />
          <Input
            type="password"
            label="Anon Key"
            placeholder="Inserisci la chiave anonima"
            value={dbConfig?.supabase?.anonKey}
            onChange={(e) => handleConfigChange('supabase', 'anonKey', e?.target?.value)}
            required
          />
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            onClick={testSupabaseConnection}
            loading={testing}
            disabled={!dbConfig?.supabase?.url || !dbConfig?.supabase?.anonKey}
            iconName="Zap"
            iconPosition="left"
          >
            Testa Connessione
          </Button>
          <Button
            variant="ghost"
            iconName="ExternalLink"
            iconPosition="right"
          >
            Documentazione Supabase
          </Button>
        </div>
      </div>

      {/* IndexedDB Configuration */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Configurazione IndexedDB (Fallback Locale)
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          Database locale utilizzato quando Supabase non è disponibile
        </p>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="indexeddb-enabled"
              checked={dbConfig?.indexedDB?.enabled}
              onChange={(e) => handleConfigChange('indexedDB', 'enabled', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label htmlFor="indexeddb-enabled" className="text-sm font-medium text-text-primary">
              Abilita IndexedDB come database di fallback
            </label>
          </div>

          {dbConfig?.indexedDB?.enabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="number"
                  label="Dimensione Massima (MB)"
                  value={dbConfig?.indexedDB?.maxSize}
                  onChange={(e) => handleConfigChange('indexedDB', 'maxSize', parseInt(e?.target?.value) || 0)}
                  min={10}
                  max={500}
                  description="Spazio massimo utilizzabile per i dati locali"
                />
                <Input
                  type="number"
                  label="Giorni di Pulizia Automatica"
                  value={dbConfig?.indexedDB?.cleanupDays}
                  onChange={(e) => handleConfigChange('indexedDB', 'cleanupDays', parseInt(e?.target?.value) || 0)}
                  min={1}
                  max={365}
                  description="Elimina automaticamente i dati più vecchi di N giorni"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="auto-cleanup"
                  checked={dbConfig?.indexedDB?.autoCleanup}
                  onChange={(e) => handleConfigChange('indexedDB', 'autoCleanup', e?.target?.checked)}
                  className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
                <label htmlFor="auto-cleanup" className="text-sm font-medium text-text-primary">
                  Abilita pulizia automatica dei dati vecchi
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={clearIndexedDB}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Svuota Database Locale
                </Button>
                <Button
                  variant="ghost"
                  iconName="Info"
                  iconPosition="left"
                >
                  Statistiche Storage
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Backup e Ripristino
        </h3>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="auto-backup"
              checked={dbConfig?.backup?.autoBackup}
              onChange={(e) => handleConfigChange('backup', 'autoBackup', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label htmlFor="auto-backup" className="text-sm font-medium text-text-primary">
              Abilita backup automatico
            </label>
          </div>

          {dbConfig?.backup?.autoBackup && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Frequenza Backup"
                value={dbConfig?.backup?.frequency}
                onChange={(value) => handleConfigChange('backup', 'frequency', value)}
                options={backupFrequencyOptions}
              />
              <Select
                label="Destinazione"
                value={dbConfig?.backup?.destination}
                onChange={(value) => handleConfigChange('backup', 'destination', value)}
                options={backupDestinationOptions}
              />
              <Input
                type="number"
                label="Ritenzione (backup da mantenere)"
                value={dbConfig?.backup?.retention}
                onChange={(e) => handleConfigChange('backup', 'retention', parseInt(e?.target?.value) || 0)}
                min={1}
                max={52}
              />
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="default"
              onClick={handleBackupNow}
              iconName="Download"
              iconPosition="left"
            >
              Crea Backup Ora
            </Button>
            <Button
              variant="outline"
              onClick={handleRestoreBackup}
              iconName="Upload"
              iconPosition="left"
            >
              Ripristina da Backup
            </Button>
          </div>
        </div>
      </div>

      {/* Database Status Summary */}
      <div className="bg-accent/5 border border-accent/10 rounded-lg p-6">
        <h4 className="font-medium text-text-primary mb-4">Stato Database</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            {getStatusIcon(dbConfig?.supabase?.status)}
            <span className="text-text-secondary">Supabase:</span>
            <span className="font-medium text-text-primary">
              {getStatusText(dbConfig?.supabase?.status)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon 
              name={dbConfig?.indexedDB?.enabled ? "CheckCircle" : "Circle"} 
              size={16} 
              className={dbConfig?.indexedDB?.enabled ? "text-success" : "text-text-secondary"} 
            />
            <span className="text-text-secondary">IndexedDB:</span>
            <span className="font-medium text-text-primary">
              {dbConfig?.indexedDB?.enabled ? 'Abilitato' : 'Disabilitato'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon 
              name={dbConfig?.backup?.autoBackup ? "CheckCircle" : "Circle"} 
              size={16} 
              className={dbConfig?.backup?.autoBackup ? "text-success" : "text-text-secondary"} 
            />
            <span className="text-text-secondary">Backup automatico:</span>
            <span className="font-medium text-text-primary">
              {dbConfig?.backup?.autoBackup ? 'Attivo' : 'Inattivo'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseConfigSection;