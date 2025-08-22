import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportModal = ({ isOpen, onClose, selectedItems, onExport }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportOptions, setExportOptions] = useState({
    includeMetadata: true,
    includeContent: true,
    includeThumbnails: false,
    includeTimestamps: true,
    includeCategories: true,
    includeTags: true
  });
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'csv', label: 'CSV (Excel compatibile)' },
    { value: 'json', label: 'JSON (Dati strutturati)' },
    { value: 'pdf', label: 'PDF (Report formattato)' },
    { value: 'wordpress', label: 'WordPress (Post pronti)' },
    { value: 'markdown', label: 'Markdown (Documentazione)' }
  ];

  const handleOptionChange = (option, checked) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport({
        format: exportFormat,
        options: exportOptions,
        items: selectedItems
      });
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getEstimatedSize = () => {
    const itemCount = selectedItems?.length;
    const baseSize = itemCount * 2; // KB per item base
    
    let multiplier = 1;
    if (exportOptions?.includeContent) multiplier += 0.5;
    if (exportOptions?.includeThumbnails) multiplier += 2;
    if (exportOptions?.includeMetadata) multiplier += 0.3;
    
    const estimatedKB = Math.round(baseSize * multiplier);
    
    if (estimatedKB > 1024) {
      return `~${(estimatedKB / 1024)?.toFixed(1)} MB`;
    }
    return `~${estimatedKB} KB`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-card border border-border rounded-lg shadow-elevation-2 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Esporta elementi</h2>
            <p className="text-sm text-text-secondary mt-1">
              {selectedItems?.length} elementi selezionati • Dimensione stimata: {getEstimatedSize()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <Select
              label="Formato di esportazione"
              description="Scegli il formato più adatto alle tue esigenze"
              options={formatOptions}
              value={exportFormat}
              onChange={setExportFormat}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-4">Opzioni di esportazione</h3>
            <div className="space-y-3">
              <Checkbox
                label="Includi metadati"
                description="Data di salvataggio, fonte, categoria, ecc."
                checked={exportOptions?.includeMetadata}
                onChange={(e) => handleOptionChange('includeMetadata', e?.target?.checked)}
              />
              
              <Checkbox
                label="Includi contenuto completo"
                description="Descrizioni complete e testo degli articoli"
                checked={exportOptions?.includeContent}
                onChange={(e) => handleOptionChange('includeContent', e?.target?.checked)}
              />
              
              <Checkbox
                label="Includi miniature"
                description="Immagini di anteprima (aumenta la dimensione del file)"
                checked={exportOptions?.includeThumbnails}
                onChange={(e) => handleOptionChange('includeThumbnails', e?.target?.checked)}
              />
              
              <Checkbox
                label="Includi timestamp"
                description="Date e orari di creazione e modifica"
                checked={exportOptions?.includeTimestamps}
                onChange={(e) => handleOptionChange('includeTimestamps', e?.target?.checked)}
              />
              
              <Checkbox
                label="Includi categorie"
                description="Informazioni sulla categorizzazione"
                checked={exportOptions?.includeCategories}
                onChange={(e) => handleOptionChange('includeCategories', e?.target?.checked)}
              />
              
              <Checkbox
                label="Includi tag"
                description="Tag personalizzati e etichette"
                checked={exportOptions?.includeTags}
                onChange={(e) => handleOptionChange('includeTags', e?.target?.checked)}
              />
            </div>
          </div>
          
          {exportFormat === 'wordpress' && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} className="text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-text-primary">Esportazione WordPress</h4>
                  <p className="text-sm text-text-secondary mt-1">
                    I contenuti verranno formattati come bozze di post WordPress con metadati SEO inclusi. 
                    Potrai importarli direttamente nel tuo sito.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {exportFormat === 'pdf' && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="FileText" size={20} className="text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-text-primary">Report PDF</h4>
                  <p className="text-sm text-text-secondary mt-1">
                    Verrà generato un report professionale con grafici, statistiche e contenuti formattati 
                    per la presentazione.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <div className="text-sm text-text-secondary">
            Formato: <span className="font-medium">{formatOptions?.find(f => f?.value === exportFormat)?.label}</span>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isExporting}
            >
              Annulla
            </Button>
            <Button
              onClick={handleExport}
              loading={isExporting}
              iconName="Download"
              iconPosition="left"
            >
              {isExporting ? 'Esportazione...' : 'Esporta'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;