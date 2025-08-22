import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickImportPanel = ({ onImportContent, onAddToBatch }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('saved');

  const sourceOptions = [
    { value: 'saved', label: 'Ricerche Salvate' },
    { value: 'recent', label: 'Ricerche Recenti' },
    { value: 'trending', label: 'Trend Attuali' }
  ];

  const mockSavedSearches = [
    {
      id: 1,
      title: 'Intelligenza Artificiale nel 2024',
      content: `L'intelligenza artificiale sta rivoluzionando il settore IT con nuove tecnologie di machine learning e deep learning. Le aziende stanno investendo massicciamente in soluzioni AI per automatizzare processi e migliorare l'efficienza operativa.`,
      source: 'Google News',
      date: '2024-08-20',
      keywords: ['AI', 'Machine Learning', 'Automazione'],
      popularity: 95
    },
    {
      id: 2,
      title: 'Cybersecurity: Nuove Minacce e Difese',
      content: `La cybersecurity diventa sempre più critica con l'emergere di nuove minacce informatiche. Le aziende devono implementare strategie di sicurezza avanzate per proteggere i propri dati e sistemi.`,
      source: 'Reddit',date: '2024-08-19',
      keywords: ['Cybersecurity', 'Sicurezza', 'Protezione Dati'],
      popularity: 87
    },
    {
      id: 3,
      title: 'Cloud Computing: Tendenze e Innovazioni',
      content: `Il cloud computing continua a evolversi con nuove soluzioni serverless e edge computing. Le organizzazioni stanno migrando sempre più servizi verso architetture cloud-native.`,
      source: 'YouTube',date: '2024-08-18',
      keywords: ['Cloud', 'Serverless', 'Edge Computing'],
      popularity: 78
    }
  ];

  const filteredSearches = mockSavedSearches?.filter(search =>
    search?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    search?.keywords?.some(keyword => 
      keyword?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    )
  );

  const handleImport = (search) => {
    onImportContent(search?.content);
    setIsExpanded(false);
  };

  const handleAddToBatch = (search) => {
    onAddToBatch({
      title: search?.title,
      content: search?.content,
      source: search?.source,
      date: search?.date,
      keywords: search?.keywords
    });
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'Google News': return 'Globe';
      case 'YouTube': return 'Play';
      case 'Reddit': return 'MessageCircle';
      default: return 'FileText';
    }
  };

  const getPopularityColor = (popularity) => {
    if (popularity >= 90) return 'text-success';
    if (popularity >= 70) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <Icon name="Import" size={20} className="text-primary" />
          <div>
            <h3 className="text-sm font-medium text-text-primary">Importazione Rapida</h3>
            <p className="text-xs text-text-secondary">
              Importa contenuto dalle ricerche salvate
            </p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-text-secondary" 
        />
      </div>
      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Search and Filter */}
          <div className="flex space-x-3">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Cerca nelle ricerche salvate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
              />
            </div>
            <Select
              options={sourceOptions}
              value={selectedSource}
              onChange={setSelectedSource}
              className="w-48"
            />
          </div>

          {/* Results */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {filteredSearches?.length === 0 ? (
              <div className="text-center py-6 text-text-secondary">
                <Icon name="Search" size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nessun risultato trovato</p>
              </div>
            ) : (
              filteredSearches?.map((search) => (
                <div key={search?.id} className="border border-border rounded-lg p-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon 
                          name={getSourceIcon(search?.source)} 
                          size={14} 
                          className="text-text-secondary" 
                        />
                        <span className="text-xs text-text-secondary">{search?.source}</span>
                        <span className="text-xs text-text-secondary">•</span>
                        <span className="text-xs text-text-secondary">{search?.date}</span>
                        <div className={`text-xs font-medium ${getPopularityColor(search?.popularity)}`}>
                          {search?.popularity}%
                        </div>
                      </div>
                      <h4 className="text-sm font-medium text-text-primary mb-1 line-clamp-1">
                        {search?.title}
                      </h4>
                      <p className="text-xs text-text-secondary line-clamp-2 mb-2">
                        {search?.content}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {search?.keywords?.slice(0, 3)?.map((keyword, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary"
                          >
                            {keyword}
                          </span>
                        ))}
                        {search?.keywords?.length > 3 && (
                          <span className="text-xs text-text-secondary">
                            +{search?.keywords?.length - 3} altri
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Plus"
                      onClick={() => handleAddToBatch(search)}
                    >
                      Batch
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Import"
                      onClick={() => handleImport(search)}
                    >
                      Importa
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-text-secondary">
              {filteredSearches?.length} risultati trovati
            </span>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="RefreshCw"
                onClick={() => setSearchQuery('')}
              >
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="ExternalLink"
                onClick={() => window.open('/saved-items', '_blank')}
              >
                Vedi Tutti
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickImportPanel;