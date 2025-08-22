import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const InputSection = ({ 
  selectedText, 
  onTextChange, 
  onConfigChange, 
  config, 
  batchItems, 
  onRemoveBatchItem,
  onGenerateContent 
}) => {
  const [activeTab, setActiveTab] = useState('text');
  const [manualText, setManualText] = useState('');

  const languageOptions = [
    { value: 'it', label: 'Italiano' },
    { value: 'en', label: 'English' }
  ];

  const contentTypeOptions = [
    { value: 'blog', label: 'Blog Post' },
    { value: 'social', label: 'Social Media' },
    { value: 'technical', label: 'Technical Documentation' },
    { value: 'news', label: 'News Article' },
    { value: 'product', label: 'Product Description' }
  ];

  const keywordDensityOptions = [
    { value: 'low', label: 'Bassa (1-2%)' },
    { value: 'medium', label: 'Media (2-3%)' },
    { value: 'high', label: 'Alta (3-4%)' }
  ];

  const handleTextInput = (value) => {
    setManualText(value);
    onTextChange(value);
  };

  const handleImportFromSearch = () => {
    // Simulate importing from saved search results
    const mockImportedText = `L'intelligenza artificiale sta rivoluzionando il settore IT con nuove tecnologie di machine learning e deep learning. Le aziende stanno investendo massicciamente in soluzioni AI per automatizzare processi e migliorare l'efficienza operativa.`;
    setManualText(mockImportedText);
    onTextChange(mockImportedText);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Input Content</h2>
        <Button
          variant="outline"
          size="sm"
          iconName="FileText"
          iconPosition="left"
          onClick={handleImportFromSearch}
        >
          Importa da Ricerca
        </Button>
      </div>
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'text' ?'bg-surface text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Icon name="Type" size={16} className="inline mr-2" />
          Testo Manuale
        </button>
        <button
          onClick={() => setActiveTab('batch')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'batch' ?'bg-surface text-text-primary shadow-sm' :'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Icon name="List" size={16} className="inline mr-2" />
          Batch ({batchItems?.length})
        </button>
      </div>
      {/* Content Area */}
      <div className="mb-6">
        {activeTab === 'text' && (
          <div className="space-y-4">
            <Input
              label="Contenuto da Ottimizzare"
              type="text"
              placeholder="Inserisci il testo per generare titoli e meta description SEO..."
              value={manualText}
              onChange={(e) => handleTextInput(e?.target?.value)}
              description="Incolla qui il contenuto dai risultati di ricerca o scrivi manualmente"
              className="min-h-32"
            />
            
            {selectedText && (
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-accent">Testo Selezionato</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    onClick={() => onTextChange('')}
                  />
                </div>
                <p className="text-sm text-text-secondary">{selectedText}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'batch' && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {batchItems?.length === 0 ? (
              <div className="text-center py-8 text-text-secondary">
                <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nessun elemento nella coda batch</p>
                <p className="text-sm mt-1">Aggiungi contenuti dai risultati di ricerca</p>
              </div>
            ) : (
              batchItems?.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {item?.source}
                      </span>
                      <span className="text-xs text-text-secondary">{item?.date}</span>
                    </div>
                    <h4 className="text-sm font-medium text-text-primary truncate">{item?.title}</h4>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">{item?.content}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    onClick={() => onRemoveBatchItem(index)}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {/* Configuration Panel */}
      <div className="border-t border-border pt-6 space-y-4">
        <h3 className="text-lg font-medium text-text-primary mb-4">Configurazione SEO</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Lingua Target"
            options={languageOptions}
            value={config?.language}
            onChange={(value) => onConfigChange({ ...config, language: value })}
          />
          
          <Select
            label="Tipo di Contenuto"
            options={contentTypeOptions}
            value={config?.contentType}
            onChange={(value) => onConfigChange({ ...config, contentType: value })}
          />
        </div>

        <Select
          label="Densità Parole Chiave"
          options={keywordDensityOptions}
          value={config?.keywordDensity}
          onChange={(value) => onConfigChange({ ...config, keywordDensity: value })}
        />

        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">Opzioni di Scoring</label>
          <div className="space-y-2">
            <Checkbox
              label="Analisi Leggibilità"
              checked={config?.includeReadability}
              onChange={(e) => onConfigChange({ ...config, includeReadability: e?.target?.checked })}
            />
            <Checkbox
              label="Ottimizzazione Lunghezza"
              checked={config?.includeLengthOptimization}
              onChange={(e) => onConfigChange({ ...config, includeLengthOptimization: e?.target?.checked })}
            />
            <Checkbox
              label="Analisi Trend Fit"
              checked={config?.includeTrendFit}
              onChange={(e) => onConfigChange({ ...config, includeTrendFit: e?.target?.checked })}
            />
          </div>
        </div>

        <Button
          variant="default"
          fullWidth
          iconName="Sparkles"
          iconPosition="left"
          onClick={onGenerateContent}
          disabled={!manualText && batchItems?.length === 0}
        >
          Genera Contenuto SEO
        </Button>
      </div>
    </div>
  );
};

export default InputSection;