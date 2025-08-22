import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ filters, onFiltersChange, isCollapsed, onToggleCollapse }) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    sources: true,
    language: true,
    timeframe: true,
    searchMode: true
  });

  const categories = [
    {
      id: 'ai-ml',
      name: 'AI/ML',
      subcategories: [
        { id: 'machine-learning', name: 'Machine Learning' },
        { id: 'deep-learning', name: 'Deep Learning' },
        { id: 'nlp', name: 'Natural Language Processing' },
        { id: 'computer-vision', name: 'Computer Vision' },
        { id: 'neural-networks', name: 'Neural Networks' }
      ]
    },
    {
      id: 'cybersecurity',
      name: 'Cybersecurity',
      subcategories: [
        { id: 'threat-detection', name: 'Threat Detection' },
        { id: 'penetration-testing', name: 'Penetration Testing' },
        { id: 'encryption', name: 'Encryption' },
        { id: 'network-security', name: 'Network Security' },
        { id: 'compliance', name: 'Compliance' }
      ]
    },
    {
      id: 'cloud-devops',
      name: 'Cloud/DevOps',
      subcategories: [
        { id: 'aws', name: 'AWS' },
        { id: 'azure', name: 'Azure' },
        { id: 'kubernetes', name: 'Kubernetes' },
        { id: 'docker', name: 'Docker' },
        { id: 'ci-cd', name: 'CI/CD' }
      ]
    },
    {
      id: 'web-development',
      name: 'Web Development',
      subcategories: [
        { id: 'react', name: 'React' },
        { id: 'vue', name: 'Vue.js' },
        { id: 'angular', name: 'Angular' },
        { id: 'nodejs', name: 'Node.js' },
        { id: 'typescript', name: 'TypeScript' }
      ]
    },
    {
      id: 'mobile-development',
      name: 'Mobile Development',
      subcategories: [
        { id: 'react-native', name: 'React Native' },
        { id: 'flutter', name: 'Flutter' },
        { id: 'ios', name: 'iOS Development' },
        { id: 'android', name: 'Android Development' },
        { id: 'xamarin', name: 'Xamarin' }
      ]
    },
    {
      id: 'blockchain',
      name: 'Blockchain',
      subcategories: [
        { id: 'ethereum', name: 'Ethereum' },
        { id: 'bitcoin', name: 'Bitcoin' },
        { id: 'smart-contracts', name: 'Smart Contracts' },
        { id: 'defi', name: 'DeFi' },
        { id: 'nft', name: 'NFT' }
      ]
    }
  ];

  const sources = [
    { id: 'google', name: 'Google News', icon: 'Globe' },
    { id: 'youtube', name: 'YouTube', icon: 'Youtube' },
    { id: 'reddit', name: 'Reddit', icon: 'MessageCircle' }
  ];

  const timeframes = [
    { id: '24h', name: 'Ultime 24 ore' },
    { id: '7d', name: 'Ultima settimana' },
    { id: '30d', name: 'Ultimo mese' },
    { id: 'custom', name: 'Personalizzato' }
  ];

  const searchModes = [
    { id: 'fast', name: 'Veloce', description: 'Risultati rapidi con meno dettagli' },
    { id: 'balanced', name: 'Bilanciato', description: 'Equilibrio tra velocità e completezza' },
    { id: 'deep', name: 'Approfondito', description: 'Analisi completa con tutti i dettagli' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handleCategoryChange = (categoryId, checked) => {
    const newCategories = checked 
      ? [...filters?.categories, categoryId]
      : filters?.categories?.filter(id => id !== categoryId);
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleSubcategoryChange = (subcategoryId, checked) => {
    const newSubcategories = checked 
      ? [...filters?.subcategories, subcategoryId]
      : filters?.subcategories?.filter(id => id !== subcategoryId);
    
    onFiltersChange({ ...filters, subcategories: newSubcategories });
  };

  const handleSourceChange = (sourceId, checked) => {
    const newSources = checked 
      ? [...filters?.sources, sourceId]
      : filters?.sources?.filter(id => id !== sourceId);
    
    onFiltersChange({ ...filters, sources: newSources });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      subcategories: [],
      sources: ['google', 'youtube', 'reddit'],
      language: 'it',
      timeframe: '7d',
      searchMode: 'balanced',
      customDateFrom: '',
      customDateTo: ''
    });
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
      >
        <span className="font-medium text-text-primary">{title}</span>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-text-secondary" 
        />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );

  if (isCollapsed) {
    return (
      <div className="w-16 bg-surface border-r border-border h-full">
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-full"
          >
            <Icon name="Filter" size={20} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-surface border-r border-border h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary">Filtri di Ricerca</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-text-secondary hover:text-text-primary"
          >
            Cancella
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
          >
            <Icon name="ChevronLeft" size={16} />
          </Button>
        </div>
      </div>
      {/* Categories */}
      <FilterSection
        title="Categorie"
        isExpanded={expandedSections?.categories}
        onToggle={() => toggleSection('categories')}
      >
        <div className="space-y-3">
          {categories?.map((category) => (
            <div key={category?.id} className="space-y-2">
              <Checkbox
                label={category?.name}
                checked={filters?.categories?.includes(category?.id)}
                onChange={(e) => handleCategoryChange(category?.id, e?.target?.checked)}
                className="font-medium"
              />
              {filters?.categories?.includes(category?.id) && (
                <div className="ml-6 space-y-2">
                  {category?.subcategories?.map((sub) => (
                    <Checkbox
                      key={sub?.id}
                      label={sub?.name}
                      checked={filters?.subcategories?.includes(sub?.id)}
                      onChange={(e) => handleSubcategoryChange(sub?.id, e?.target?.checked)}
                      size="sm"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </FilterSection>
      {/* Sources */}
      <FilterSection
        title="Fonti"
        isExpanded={expandedSections?.sources}
        onToggle={() => toggleSection('sources')}
      >
        <div className="space-y-3">
          {sources?.map((source) => (
            <div key={source?.id} className="flex items-center space-x-3">
              <Checkbox
                checked={filters?.sources?.includes(source?.id)}
                onChange={(e) => handleSourceChange(source?.id, e?.target?.checked)}
              />
              <Icon name={source?.icon} size={16} className="text-text-secondary" />
              <span className="text-text-primary">{source?.name}</span>
            </div>
          ))}
        </div>
      </FilterSection>
      {/* Language */}
      <FilterSection
        title="Lingua"
        isExpanded={expandedSections?.language}
        onToggle={() => toggleSection('language')}
      >
        <div className="space-y-2">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="language"
              value="it"
              checked={filters?.language === 'it'}
              onChange={(e) => onFiltersChange({ ...filters, language: e?.target?.value })}
              className="text-primary"
            />
            <span className="text-text-primary">Italiano</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="language"
              value="en"
              checked={filters?.language === 'en'}
              onChange={(e) => onFiltersChange({ ...filters, language: e?.target?.value })}
              className="text-primary"
            />
            <span className="text-text-primary">English</span>
          </label>
        </div>
      </FilterSection>
      {/* Timeframe */}
      <FilterSection
        title="Periodo"
        isExpanded={expandedSections?.timeframe}
        onToggle={() => toggleSection('timeframe')}
      >
        <div className="space-y-2">
          {timeframes?.map((timeframe) => (
            <label key={timeframe?.id} className="flex items-center space-x-3">
              <input
                type="radio"
                name="timeframe"
                value={timeframe?.id}
                checked={filters?.timeframe === timeframe?.id}
                onChange={(e) => onFiltersChange({ ...filters, timeframe: e?.target?.value })}
                className="text-primary"
              />
              <span className="text-text-primary">{timeframe?.name}</span>
            </label>
          ))}
        </div>
        
        {filters?.timeframe === 'custom' && (
          <div className="mt-4 space-y-3">
            <Input
              type="date"
              label="Da"
              value={filters?.customDateFrom}
              onChange={(e) => onFiltersChange({ ...filters, customDateFrom: e?.target?.value })}
            />
            <Input
              type="date"
              label="A"
              value={filters?.customDateTo}
              onChange={(e) => onFiltersChange({ ...filters, customDateTo: e?.target?.value })}
            />
          </div>
        )}
      </FilterSection>
      {/* Search Mode */}
      <FilterSection
        title="Modalità di Ricerca"
        isExpanded={expandedSections?.searchMode}
        onToggle={() => toggleSection('searchMode')}
      >
        <div className="space-y-3">
          {searchModes?.map((mode) => (
            <label key={mode?.id} className="block">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="searchMode"
                  value={mode?.id}
                  checked={filters?.searchMode === mode?.id}
                  onChange={(e) => onFiltersChange({ ...filters, searchMode: e?.target?.value })}
                  className="text-primary"
                />
                <div>
                  <div className="text-text-primary font-medium">{mode?.name}</div>
                  <div className="text-sm text-text-secondary">{mode?.description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterPanel;