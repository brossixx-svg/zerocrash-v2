import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BatchProcessingModal = ({ isOpen, onClose, batchItems, onStartBatch }) => {
  const [processingStatus, setProcessingStatus] = useState('idle'); // idle, processing, completed
  const [currentItem, setCurrentItem] = useState(0);
  const [results, setResults] = useState([]);
  const [exportFormat, setExportFormat] = useState('csv');

  const exportOptions = [
    { value: 'csv', label: 'CSV File' },
    { value: 'json', label: 'JSON File' },
    { value: 'wordpress', label: 'WordPress Ready' },
    { value: 'pdf', label: 'PDF Report' }
  ];

  const handleStartProcessing = async () => {
    setProcessingStatus('processing');
    setCurrentItem(0);
    setResults([]);

    // Simulate batch processing
    for (let i = 0; i < batchItems?.length; i++) {
      setCurrentItem(i + 1);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock results
      const mockResult = {
        id: i,
        originalTitle: batchItems?.[i]?.title,
        generatedTitles: [
          {
            text: `SEO Ottimizzato: ${batchItems?.[i]?.title}`,
            score: Math.floor(Math.random() * 30) + 70
          },
          {
            text: `Guida Completa: ${batchItems?.[i]?.title?.substring(0, 40)}...`,
            score: Math.floor(Math.random() * 30) + 60
          }
        ],
        metaDescription: {
          text: `Scopri tutto su ${batchItems?.[i]?.title?.substring(0, 50)}... Guida completa con esempi pratici e best practices per professionisti IT.`,
          score: Math.floor(Math.random() * 30) + 75
        },
        status: 'completed'
      };
      
      setResults(prev => [...prev, mockResult]);
    }
    
    setProcessingStatus('completed');
  };

  const handleExport = () => {
    console.log(`Exporting results in ${exportFormat} format`);
    // In real app, this would trigger file download
  };

  const getProgressPercentage = () => {
    if (processingStatus === 'idle') return 0;
    if (processingStatus === 'completed') return 100;
    return Math.floor((currentItem / batchItems?.length) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-surface border border-border rounded-lg shadow-elevation-2 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Elaborazione Batch</h2>
            <p className="text-sm text-text-secondary mt-1">
              {batchItems?.length} elementi in coda per l'elaborazione
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {processingStatus === 'idle' && (
            <div className="space-y-6">
              {/* Batch Items Preview */}
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-4">Elementi da Elaborare</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {batchItems?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-text-primary truncate">{item?.title}</h4>
                        <p className="text-xs text-text-secondary">{item?.source} • {item?.date}</p>
                      </div>
                      <Icon name="FileText" size={16} className="text-text-secondary" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Format Selection */}
              <div>
                <Select
                  label="Formato di Esportazione"
                  options={exportOptions}
                  value={exportFormat}
                  onChange={setExportFormat}
                  description="Scegli il formato per esportare i risultati"
                />
              </div>

              {/* Start Button */}
              <Button
                variant="default"
                fullWidth
                iconName="Play"
                iconPosition="left"
                onClick={handleStartProcessing}
              >
                Avvia Elaborazione Batch
              </Button>
            </div>
          )}

          {processingStatus === 'processing' && (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">
                    Elaborazione in corso...
                  </span>
                  <span className="text-sm text-text-secondary">
                    {currentItem}/{batchItems?.length} ({getProgressPercentage()}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Item */}
              {currentItem > 0 && currentItem <= batchItems?.length && (
                <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin">
                      <Icon name="Loader2" size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        Elaborando: {batchItems?.[currentItem - 1]?.title}
                      </p>
                      <p className="text-xs text-text-secondary">
                        Generazione titoli SEO e meta description...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Completed Results */}
              {results?.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-4">Risultati Completati</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {results?.map((result, index) => (
                      <div key={index} className="p-3 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-text-primary">
                              {result?.originalTitle}
                            </h4>
                            <p className="text-xs text-success mt-1">
                              ✓ {result?.generatedTitles?.length} titoli generati
                            </p>
                          </div>
                          <Icon name="CheckCircle" size={16} className="text-success" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {processingStatus === 'completed' && (
            <div className="space-y-6">
              {/* Completion Summary */}
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircle" size={32} className="text-success" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Elaborazione Completata!
                </h3>
                <p className="text-text-secondary">
                  {results?.length} elementi elaborati con successo
                </p>
              </div>

              {/* Results Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {results?.reduce((acc, r) => acc + r?.generatedTitles?.length, 0)}
                  </div>
                  <div className="text-sm text-text-secondary">Titoli Generati</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{results?.length}</div>
                  <div className="text-sm text-text-secondary">Meta Description</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(results?.reduce((acc, r) => acc + r?.metaDescription?.score, 0) / results?.length)}%
                  </div>
                  <div className="text-sm text-text-secondary">Score Medio</div>
                </div>
              </div>

              {/* Export Options */}
              <div className="flex space-x-3">
                <Button
                  variant="default"
                  fullWidth
                  iconName="Download"
                  iconPosition="left"
                  onClick={handleExport}
                >
                  Esporta Risultati ({exportFormat?.toUpperCase()})
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  iconName="Save"
                  iconPosition="left"
                >
                  Salva nei Preferiti
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchProcessingModal;