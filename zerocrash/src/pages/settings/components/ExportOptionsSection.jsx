import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ExportOptionsSection = ({ onSettingsChange }) => {
  const [exportSettings, setExportSettings] = useState({
    defaultFormat: 'json',
    template: 'standard',
    includeMetadata: true,
    includeImages: false,
    compression: false,
    automation: {
      enabled: false,
      schedule: 'daily',
      destination: 'local'
    },
    csvOptions: {
      delimiter: ',',
      encoding: 'utf-8',
      includeHeaders: true
    },
    pdfOptions: {
      pageSize: 'a4',
      orientation: 'portrait',
      margins: 'normal'
    }
  });

  const formatOptions = [
    { value: 'json', label: 'JSON' },
    { value: 'csv', label: 'CSV' },
    { value: 'pdf', label: 'PDF' },
    { value: 'docx', label: 'Microsoft Word' },
    { value: 'xlsx', label: 'Microsoft Excel' }
  ];

  const templateOptions = [
    { value: 'standard', label: 'Template Standard' },
    { value: 'detailed', label: 'Template Dettagliato' },
    { value: 'minimal', label: 'Template Minimal' },
    { value: 'custom', label: 'Template Personalizzato' }
  ];

  const scheduleOptions = [
    { value: 'daily', label: 'Giornaliero' },
    { value: 'weekly', label: 'Settimanale' },
    { value: 'monthly', label: 'Mensile' }
  ];

  const destinationOptions = [
    { value: 'local', label: 'Download Locale' },
    { value: 'cloud', label: 'Cloud Storage' },
    { value: 'email', label: 'Invio Email' }
  ];

  const csvDelimiterOptions = [
    { value: ',', label: 'Virgola (,)' },
    { value: ';', label: 'Punto e virgola (;)' },
    { value: '\t', label: 'Tab' },
    { value: '|', label: 'Pipe (|)' }
  ];

  const encodingOptions = [
    { value: 'utf-8', label: 'UTF-8' },
    { value: 'iso-8859-1', label: 'ISO-8859-1' },
    { value: 'windows-1252', label: 'Windows-1252' }
  ];

  const pageSizeOptions = [
    { value: 'a4', label: 'A4' },
    { value: 'a3', label: 'A3' },
    { value: 'letter', label: 'Letter' },
    { value: 'legal', label: 'Legal' }
  ];

  const orientationOptions = [
    { value: 'portrait', label: 'Verticale' },
    { value: 'landscape', label: 'Orizzontale' }
  ];

  const marginsOptions = [
    { value: 'narrow', label: 'Stretti' },
    { value: 'normal', label: 'Normali' },
    { value: 'wide', label: 'Larghi' }
  ];

  const handleSettingChange = (key, value, subkey = null) => {
    if (subkey) {
      setExportSettings(prev => ({
        ...prev,
        [key]: {
          ...prev?.[key],
          [subkey]: value
        }
      }));
    } else {
      setExportSettings(prev => ({
        ...prev,
        [key]: value
      }));
    }
    onSettingsChange?.();
  };

  const handlePreviewTemplate = () => {
    // Mock template preview functionality
    alert('Anteprima del template - Funzionalità da implementare');
  };

  const handleTestAutomation = () => {
    // Mock automation test
    alert('Test automazione avviato - Controlla la destinazione configurata');
  };

  return (
    <div className="space-y-8">
      {/* Default Export Settings */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Impostazioni Esportazione Predefinite
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Formato Predefinito"
            value={exportSettings?.defaultFormat}
            onChange={(value) => handleSettingChange('defaultFormat', value)}
            options={formatOptions}
            description="Formato utilizzato di default per le esportazioni"
          />
          <Select
            label="Template Predefinito"
            value={exportSettings?.template}
            onChange={(value) => handleSettingChange('template', value)}
            options={templateOptions}
            description="Template di layout per le esportazioni"
          />
        </div>
      </div>

      {/* Content Options */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Opzioni Contenuto
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="include-metadata"
              checked={exportSettings?.includeMetadata}
              onChange={(e) => handleSettingChange('includeMetadata', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label htmlFor="include-metadata" className="text-sm font-medium text-text-primary">
              Includi metadati (data, fonte, categoria)
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="include-images"
              checked={exportSettings?.includeImages}
              onChange={(e) => handleSettingChange('includeImages', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label htmlFor="include-images" className="text-sm font-medium text-text-primary">
              Includi immagini e media
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="compression"
              checked={exportSettings?.compression}
              onChange={(e) => handleSettingChange('compression', e?.target?.checked)}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label htmlFor="compression" className="text-sm font-medium text-text-primary">
              Comprimi file esportati
            </label>
          </div>
        </div>
      </div>

      {/* CSV-specific Options */}
      {exportSettings?.defaultFormat === 'csv' && (
        <div className="border-t border-border pt-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Opzioni CSV
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              label="Delimitatore"
              value={exportSettings?.csvOptions?.delimiter}
              onChange={(value) => handleSettingChange('csvOptions', value, 'delimiter')}
              options={csvDelimiterOptions}
            />
            <Select
              label="Codifica"
              value={exportSettings?.csvOptions?.encoding}
              onChange={(value) => handleSettingChange('csvOptions', value, 'encoding')}
              options={encodingOptions}
            />
            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="include-headers"
                checked={exportSettings?.csvOptions?.includeHeaders}
                onChange={(e) => handleSettingChange('csvOptions', e?.target?.checked, 'includeHeaders')}
                className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 mr-3"
              />
              <label htmlFor="include-headers" className="text-sm font-medium text-text-primary">
                Includi intestazioni
              </label>
            </div>
          </div>
        </div>
      )}

      {/* PDF-specific Options */}
      {exportSettings?.defaultFormat === 'pdf' && (
        <div className="border-t border-border pt-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Opzioni PDF
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select
              label="Dimensione Pagina"
              value={exportSettings?.pdfOptions?.pageSize}
              onChange={(value) => handleSettingChange('pdfOptions', value, 'pageSize')}
              options={pageSizeOptions}
            />
            <Select
              label="Orientamento"
              value={exportSettings?.pdfOptions?.orientation}
              onChange={(value) => handleSettingChange('pdfOptions', value, 'orientation')}
              options={orientationOptions}
            />
            <Select
              label="Margini"
              value={exportSettings?.pdfOptions?.margins}
              onChange={(value) => handleSettingChange('pdfOptions', value, 'margins')}
              options={marginsOptions}
            />
          </div>
        </div>
      )}

      {/* Template Management */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Gestione Template
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handlePreviewTemplate}
            iconName="Eye"
            iconPosition="left"
          >
            Anteprima Template
          </Button>
          <Button
            variant="outline"
            iconName="Edit"
            iconPosition="left"
          >
            Modifica Template
          </Button>
          <Button
            variant="outline"
            iconName="Plus"
            iconPosition="left"
          >
            Crea Nuovo Template
          </Button>
        </div>
      </div>

      {/* Automation Settings */}
      <div className="border-t border-border pt-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Automazione Esportazioni
        </h3>
        
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="automation-enabled"
              checked={exportSettings?.automation?.enabled}
              onChange={(e) => handleSettingChange('automation', e?.target?.checked, 'enabled')}
              className="h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <label htmlFor="automation-enabled" className="text-sm font-medium text-text-primary">
              Abilita esportazioni automatiche
            </label>
          </div>

          {exportSettings?.automation?.enabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Frequenza"
                  value={exportSettings?.automation?.schedule}
                  onChange={(value) => handleSettingChange('automation', value, 'schedule')}
                  options={scheduleOptions}
                />
                <Select
                  label="Destinazione"
                  value={exportSettings?.automation?.destination}
                  onChange={(value) => handleSettingChange('automation', value, 'destination')}
                  options={destinationOptions}
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleTestAutomation}
                  iconName="Play"
                  iconPosition="left"
                >
                  Testa Automazione
                </Button>
                <Button
                  variant="ghost"
                  iconName="Settings"
                  iconPosition="left"
                >
                  Configura Destinazione
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Settings Summary */}
      <div className="bg-accent/5 border border-accent/10 rounded-lg p-6">
        <h4 className="font-medium text-text-primary mb-4">Riepilogo Configurazione</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">Formato predefinito:</span>
            <span className="ml-2 font-medium text-text-primary">
              {formatOptions?.find(opt => opt?.value === exportSettings?.defaultFormat)?.label}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Template:</span>
            <span className="ml-2 font-medium text-text-primary">
              {templateOptions?.find(opt => opt?.value === exportSettings?.template)?.label}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Metadati inclusi:</span>
            <span className="ml-2 font-medium text-text-primary">
              {exportSettings?.includeMetadata ? 'Sì' : 'No'}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Automazione:</span>
            <span className="ml-2 font-medium text-text-primary">
              {exportSettings?.automation?.enabled 
                ? `${scheduleOptions?.find(opt => opt?.value === exportSettings?.automation?.schedule)?.label}`
                : 'Disabilitata'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportOptionsSection;