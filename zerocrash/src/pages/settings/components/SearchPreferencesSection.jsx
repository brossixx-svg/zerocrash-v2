import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';


const SearchPreferencesSection = ({ onSettingsChange }) => {
  const [preferences, setPreferences] = useState({
    defaultTimeframe: '30d',
    sourcePriority: ['google', 'youtube', 'reddit'],
    resultLimits: {
      google: 50,
      youtube: 20,
      reddit: 30
    },
    caching: {
      enabled: true,
      duration: 24,
      maxSize: 100
    },
    filters: {
      language: 'all',
      region: 'all',
      safeSearch: 'moderate'
    }
  });

  const timeframeOptions = [
    { value: '1d', label: 'Ultimo giorno' },
    { value: '7d', label: 'Ultima settimana' },
    { value: '30d', label: 'Ultimo mese' },
    { value: '90d', label: 'Ultimi 3 mesi' },
    { value: '1y', label: 'Ultimo anno' },
    { value: 'all', label: 'Tutto il tempo' }
  ];

  const languageOptions = [
    { value: 'all', label: 'Tutte le lingue' },
    { value: 'it', label: 'Italiano' },
    { value: 'en', label: 'Inglese' },
    { value: 'fr', label: 'Francese' },
    { value: 'de', label: 'Tedesco' },
    { value: 'es', label: 'Spagnolo' }
  ];

  const regionOptions = [
    { value: 'all', label: 'Tutte le regioni' },
    { value: 'it', label: 'Italia' },
    { value: 'us', label: 'Stati Uniti' },
    { value: 'uk', label: 'Regno Unito' },
    { value: 'fr', label: 'Francia' },
    { value: 'de', label: 'Germania' }
  ];

  const safeSearchOptions = [
    { value: 'off', label: 'Disattivato' },
    { value: 'moderate', label: 'Moderato' },
    { value: 'strict', label: 'Rigoroso' }
  ];

  const handlePreferenceChange = (key, value, subkey = null) => {
    if (subkey) {
      setPreferences(prev => ({
        ...prev,
        [key]: {
          ...prev?.[key],
          [subkey]: value
        }
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));
    }
    onSettingsChange?.();
  };

  const handleSourcePriorityChange = (sourceIndex, newIndex) => {
    const newPriority = [...preferences?.sourcePriority];
    const [movedSource] = newPriority?.splice(sourceIndex, 1);
    newPriority?.splice(newIndex, 0, movedSource);
    
    setPreferences(prev => ({
      ...prev,
      sourcePriority: newPriority
    }));
    onSettingsChange?.();
  };

  const sourceLabels = {
    google: 'Google Search',
    youtube: 'YouTube',
    reddit: 'Reddit'
  };

  return (
    <div className="space-y-8">
      {/* Default Timeframes */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Timeframe Predefinito
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Periodo di Ricerca Predefinito"
            value={preferences?.defaultTimeframe}
            onChange={(value) => handlePreferenceChange('defaultTimeframe', value)}
            options={timeframeOptions}
            description="Seleziona il periodo temporale predefinito per le ricerche"
          />
        </div>
      </div>

      {/* Source Priorities */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Priorità delle Fonti
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          Trascina per riordinare le fonti in base alla priorità. La prima fonte verrà utilizzata per prima nelle ricerche.
        </p>
        
        <div className="space-y-3">
          {preferences?.sourcePriority?.map((source, index) => (
            <div key={source} className="flex items-center gap-4 bg-accent/5 border border-border rounded-lg p-4">
              <div className="text-lg font-medium text-text-secondary w-6">
                {index + 1}
              </div>
              <div className="flex-1">
                <span className="font-medium text-text-primary">
                  {sourceLabels?.[source]}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSourcePriorityChange(index, Math.max(0, index - 1))}
                  disabled={index === 0}
                  iconName="ChevronUp"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSourcePriorityChange(index, Math.min(preferences?.sourcePriority?.length - 1, index + 1))}
                  disabled={index === preferences?.sourcePriority?.length - 1}
                  iconName="ChevronDown"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Result Limits */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Limiti dei Risultati
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          Configura il numero massimo di risultati per ciascuna fonte
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(preferences?.resultLimits)?.map(([source, limit]) => (
            <Input
              key={source}
              type="number"
              label={`Limite ${sourceLabels?.[source]}`}
              value={limit}
              onChange={(e) => handlePreferenceChange('resultLimits', parseInt(e?.target?.value) || 0, source)}
              min={1}
              max={200}
            />
          ))}
        </div>
      </div>

      {/* Caching Settings */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Impostazioni Cache
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="caching-enabled"
              checked={preferences?.caching?.enabled}
              onChange={(e) => handlePreferenceChange('caching', e?.target?.checked, 'enabled')}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label htmlFor="caching-enabled" className="text-sm font-medium text-text-primary">
              Abilita cache per i risultati di ricerca
            </label>
          </div>

          {preferences?.caching?.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="number"
                label="Durata Cache (ore)"
                value={preferences?.caching?.duration}
                onChange={(e) => handlePreferenceChange('caching', parseInt(e?.target?.value) || 0, 'duration')}
                min={1}
                max={168}
                description="Per quanto tempo mantenere i risultati in cache"
              />
              <Input
                type="number"
                label="Dimensione Massima Cache (MB)"
                value={preferences?.caching?.maxSize}
                onChange={(e) => handlePreferenceChange('caching', parseInt(e?.target?.value) || 0, 'maxSize')}
                min={10}
                max={1000}
                description="Spazio massimo utilizzabile per la cache"
              />
            </div>
          )}
        </div>
      </div>

      {/* Search Filters */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Filtri di Ricerca Predefiniti
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Lingua"
            value={preferences?.filters?.language}
            onChange={(value) => handlePreferenceChange('filters', value, 'language')}
            options={languageOptions}
          />
          <Select
            label="Regione"
            value={preferences?.filters?.region}
            onChange={(value) => handlePreferenceChange('filters', value, 'region')}
            options={regionOptions}
          />
          <Select
            label="SafeSearch"
            value={preferences?.filters?.safeSearch}
            onChange={(value) => handlePreferenceChange('filters', value, 'safeSearch')}
            options={safeSearchOptions}
          />
        </div>
      </div>

      {/* Summary Panel */}
      <div className="bg-accent/5 border border-accent/10 rounded-lg p-6">
        <h4 className="font-medium text-text-primary mb-4">Riepilogo Preferenze</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">Timeframe predefinito:</span>
            <span className="ml-2 font-medium text-text-primary">
              {timeframeOptions?.find(opt => opt?.value === preferences?.defaultTimeframe)?.label}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Cache:</span>
            <span className="ml-2 font-medium text-text-primary">
              {preferences?.caching?.enabled ? `Attiva (${preferences?.caching?.duration}h)` : 'Disattivata'}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Fonte prioritaria:</span>
            <span className="ml-2 font-medium text-text-primary">
              {sourceLabels?.[preferences?.sourcePriority?.[0]]}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Lingua:</span>
            <span className="ml-2 font-medium text-text-primary">
              {languageOptions?.find(opt => opt?.value === preferences?.filters?.language)?.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPreferencesSection;