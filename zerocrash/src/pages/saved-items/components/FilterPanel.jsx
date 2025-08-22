import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ filters, onFiltersChange, isCollapsed, onToggleCollapse }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const sourceOptions = [
    { value: 'all', label: 'Tutte le fonti' },
    { value: 'Google', label: 'Google' },
    { value: 'YouTube', label: 'YouTube' },
    { value: 'Reddit', label: 'Reddit' },
    { value: 'SEO', label: 'SEO Generato' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'Tutte le categorie' },
    { value: 'AI/ML', label: 'AI/ML' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
    { value: 'Cloud/DevOps', label: 'Cloud/DevOps' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile Development', label: 'Mobile Development' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'Blockchain', label: 'Blockchain' },
    { value: 'IoT', label: 'IoT' }
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Data (più recente)' },
    { value: 'date_asc', label: 'Data (più vecchia)' },
    { value: 'title_asc', label: 'Titolo (A-Z)' },
    { value: 'title_desc', label: 'Titolo (Z-A)' },
    { value: 'source', label: 'Fonte' },
    { value: 'category', label: 'Categoria' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (type, value) => {
    const newDateRange = { ...localFilters?.dateRange, [type]: value };
    const newFilters = { ...localFilters, dateRange: newDateRange };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      source: 'all',
      category: 'all',
      dateRange: { start: '', end: '' },
      tags: [],
      sortBy: 'date_desc'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return localFilters?.search || 
           localFilters?.source !== 'all' || 
           localFilters?.category !== 'all' ||
           localFilters?.dateRange?.start ||
           localFilters?.dateRange?.end ||
           localFilters?.tags?.length > 0;
  };

  if (isCollapsed) {
    return (
      <div className="bg-surface border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onToggleCollapse}
              className="flex items-center space-x-2"
            >
              <Icon name="Filter" size={20} />
              <span>Filtri</span>
              <Icon name="ChevronDown" size={16} />
            </Button>
            
            {hasActiveFilters() && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">Filtri attivi:</span>
                <div className="flex items-center space-x-2">
                  {localFilters?.search && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      Ricerca: {localFilters?.search}
                    </span>
                  )}
                  {localFilters?.source !== 'all' && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {localFilters?.source}
                    </span>
                  )}
                  {localFilters?.category !== 'all' && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {localFilters?.category}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-error hover:text-error"
                >
                  Cancella tutto
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              options={sortOptions}
              value={localFilters?.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
              placeholder="Ordina per"
              className="w-48"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border-b border-border">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} />
            <h3 className="text-lg font-semibold text-text-primary">Filtri avanzati</h3>
            {hasActiveFilters() && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Attivi
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-error hover:text-error"
              >
                <Icon name="X" size={16} className="mr-1" />
                Cancella filtri
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
            >
              <Icon name="ChevronUp" size={20} />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Input
              type="search"
              label="Ricerca"
              placeholder="Cerca nei contenuti salvati..."
              value={localFilters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
            />
          </div>
          
          <div>
            <Select
              label="Fonte"
              options={sourceOptions}
              value={localFilters?.source}
              onChange={(value) => handleFilterChange('source', value)}
            />
          </div>
          
          <div>
            <Select
              label="Categoria"
              options={categoryOptions}
              value={localFilters?.category}
              onChange={(value) => handleFilterChange('category', value)}
            />
          </div>
          
          <div>
            <Select
              label="Ordina per"
              options={sortOptions}
              value={localFilters?.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Input
              type="date"
              label="Data inizio"
              value={localFilters?.dateRange?.start}
              onChange={(e) => handleDateRangeChange('start', e?.target?.value)}
            />
          </div>
          
          <div>
            <Input
              type="date"
              label="Data fine"
              value={localFilters?.dateRange?.end}
              onChange={(e) => handleDateRangeChange('end', e?.target?.value)}
            />
          </div>
        </div>
        
        {localFilters?.tags && localFilters?.tags?.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-text-primary mb-2">Tag attivi</label>
            <div className="flex flex-wrap gap-2">
              {localFilters?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newTags = localFilters?.tags?.filter((_, i) => i !== index);
                      handleFilterChange('tags', newTags);
                    }}
                    className="w-4 h-4 p-0 hover:bg-primary/20"
                  >
                    <Icon name="X" size={12} />
                  </Button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;