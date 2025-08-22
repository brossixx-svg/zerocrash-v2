import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

import { cn } from '../../../utils/cn';

const AppearanceSection = ({ onSettingsChange }) => {
  const [appearance, setAppearance] = useState({
    theme: 'light',
    accentColor: 'blue',
    typography: {
      fontSize: 'medium',
      fontFamily: 'inter'
    },
    dashboard: {
      layout: 'default',
      sidebar: 'expanded',
      compactMode: false
    },
    animations: {
      enabled: true,
      reducedMotion: false
    }
  });

  const themeOptions = [
    { value: 'light', label: 'Tema Chiaro' },
    { value: 'dark', label: 'Tema Scuro' },
    { value: 'system', label: 'Sistema (Auto)' }
  ];

  const accentColors = [
    { value: 'blue', label: 'Blu', color: 'bg-blue-500' },
    { value: 'green', label: 'Verde', color: 'bg-green-500' },
    { value: 'purple', label: 'Viola', color: 'bg-purple-500' },
    { value: 'orange', label: 'Arancione', color: 'bg-orange-500' },
    { value: 'red', label: 'Rosso', color: 'bg-red-500' },
    { value: 'teal', label: 'Verde Acqua', color: 'bg-teal-500' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Piccolo' },
    { value: 'medium', label: 'Medio' },
    { value: 'large', label: 'Grande' }
  ];

  const fontFamilyOptions = [
    { value: 'inter', label: 'Inter' },
    { value: 'roboto', label: 'Roboto' },
    { value: 'system', label: 'Sistema' }
  ];

  const layoutOptions = [
    { value: 'default', label: 'Layout Standard' },
    { value: 'compact', label: 'Layout Compatto' },
    { value: 'spacious', label: 'Layout Ampio' }
  ];

  const sidebarOptions = [
    { value: 'expanded', label: 'Espansa' },
    { value: 'collapsed', label: 'Compressa' },
    { value: 'auto', label: 'Automatica' }
  ];

  const handleAppearanceChange = (section, field, value) => {
    if (typeof section === 'object') {
      // Direct state update
      setAppearance(prev => ({ ...prev, ...section }));
    } else if (field) {
      // Nested update
      setAppearance(prev => ({
        ...prev,
        [section]: {
          ...prev?.[section],
          [field]: value
        }
      }));
    } else {
      // Simple field update
      setAppearance(prev => ({
        ...prev,
        [section]: value
      }));
    }
    onSettingsChange?.();
  };

  const previewTheme = (theme) => {
    // Mock theme preview functionality
    document.documentElement?.setAttribute('data-theme-preview', theme);
    setTimeout(() => {
      document.documentElement?.removeAttribute('data-theme-preview');
    }, 2000);
  };

  const resetToDefaults = () => {
    setAppearance({
      theme: 'light',
      accentColor: 'blue',
      typography: {
        fontSize: 'medium',
        fontFamily: 'inter'
      },
      dashboard: {
        layout: 'default',
        sidebar: 'expanded',
        compactMode: false
      },
      animations: {
        enabled: true,
        reducedMotion: false
      }
    });
    onSettingsChange?.();
  };

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Selezione Tema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Tema Applicazione"
            value={appearance?.theme}
            onChange={(value) => handleAppearanceChange('theme', null, value)}
            options={themeOptions}
            description="Scegli il tema visivo dell'applicazione"
          />
          <div className="space-y-3">
            <div className="text-sm font-medium text-text-primary">Anteprima Rapida</div>
            <div className="flex gap-2">
              {themeOptions?.map(theme => (
                <Button
                  key={theme?.value}
                  variant="outline"
                  size="sm"
                  onClick={() => previewTheme(theme?.value)}
                >
                  {theme?.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Accent Color */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Colore Principale
        </h3>
        <div className="space-y-4">
          <div className="text-sm text-text-secondary mb-3">
            Seleziona il colore principale utilizzato per pulsanti, link e elementi interattivi
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {accentColors?.map(color => (
              <button
                key={color?.value}
                onClick={() => handleAppearanceChange('accentColor', null, color?.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors",
                  appearance?.accentColor === color?.value
                    ? "border-primary bg-primary/5" :"border-border hover:border-accent"
                )}
              >
                <div className={cn("w-8 h-8 rounded-full", color?.color)} />
                <span className="text-xs font-medium text-text-primary">
                  {color?.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Tipografia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Dimensione Carattere"
            value={appearance?.typography?.fontSize}
            onChange={(value) => handleAppearanceChange('typography', 'fontSize', value)}
            options={fontSizeOptions}
          />
          <Select
            label="Famiglia Font"
            value={appearance?.typography?.fontFamily}
            onChange={(value) => handleAppearanceChange('typography', 'fontFamily', value)}
            options={fontFamilyOptions}
          />
        </div>
      </div>

      {/* Dashboard Customization */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Personalizzazione Dashboard
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Layout Dashboard"
              value={appearance?.dashboard?.layout}
              onChange={(value) => handleAppearanceChange('dashboard', 'layout', value)}
              options={layoutOptions}
            />
            <Select
              label="Sidebar Predefinita"
              value={appearance?.dashboard?.sidebar}
              onChange={(value) => handleAppearanceChange('dashboard', 'sidebar', value)}
              options={sidebarOptions}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="compact-mode"
              checked={appearance?.dashboard?.compactMode}
              onChange={(e) => handleAppearanceChange('dashboard', 'compactMode', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label htmlFor="compact-mode" className="text-sm font-medium text-text-primary">
              Modalità compatta per dashboard (più elementi per riga)
            </label>
          </div>
        </div>
      </div>

      {/* Animation Preferences */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Preferenze Animazioni
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="animations-enabled"
              checked={appearance?.animations?.enabled}
              onChange={(e) => handleAppearanceChange('animations', 'enabled', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label htmlFor="animations-enabled" className="text-sm font-medium text-text-primary">
              Abilita animazioni e transizioni
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="reduced-motion"
              checked={appearance?.animations?.reducedMotion}
              onChange={(e) => handleAppearanceChange('animations', 'reducedMotion', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label htmlFor="reduced-motion" className="text-sm font-medium text-text-primary">
              Riduci animazioni (accessibilità)
            </label>
          </div>
        </div>
      </div>

      {/* Preview and Reset */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Azioni
        </h3>
        <div className="flex gap-3">
          <Button
            variant="default"
            iconName="Eye"
            iconPosition="left"
          >
            Anteprima Completa
          </Button>
          <Button
            variant="outline"
            onClick={resetToDefaults}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Ripristina Predefiniti
          </Button>
          <Button
            variant="ghost"
            iconName="Palette"
            iconPosition="left"
          >
            Crea Tema Personalizzato
          </Button>
        </div>
      </div>

      {/* Current Settings Summary */}
      <div className="bg-accent/5 border border-accent/10 rounded-lg p-6">
        <h4 className="font-medium text-text-primary mb-4">Impostazioni Correnti</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">Tema:</span>
            <span className="ml-2 font-medium text-text-primary">
              {themeOptions?.find(opt => opt?.value === appearance?.theme)?.label}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Colore principale:</span>
            <span className="ml-2 font-medium text-text-primary">
              {accentColors?.find(opt => opt?.value === appearance?.accentColor)?.label}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Dimensione font:</span>
            <span className="ml-2 font-medium text-text-primary">
              {fontSizeOptions?.find(opt => opt?.value === appearance?.typography?.fontSize)?.label}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Layout:</span>
            <span className="ml-2 font-medium text-text-primary">
              {layoutOptions?.find(opt => opt?.value === appearance?.dashboard?.layout)?.label}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Animazioni:</span>
            <span className="ml-2 font-medium text-text-primary">
              {appearance?.animations?.enabled ? 'Abilitate' : 'Disabilitate'}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Modalità compatta:</span>
            <span className="ml-2 font-medium text-text-primary">
              {appearance?.dashboard?.compactMode ? 'Attiva' : 'Disattiva'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSection;