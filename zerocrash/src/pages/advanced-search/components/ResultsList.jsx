import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import ResultCard from './ResultCard';

const ResultsList = ({ 
  results, 
  isLoading, 
  selectedResults, 
  onSelectResult, 
  onSelectAll, 
  onBulkAction,
  pagination,
  onPageChange 
}) => {
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance', 'date', 'popularity'

  const handleSaveResult = (result) => {
    console.log('Saving result:', result?.id);
    // In real app, this would save to backend/localStorage
  };

  const handleCopyResult = (result) => {
    console.log('Copied result:', result?.id);
    // Show toast notification
  };

  const sortedResults = [...results]?.sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.publishedAt) - new Date(a.publishedAt);
      case 'popularity':
        return b?.popularity - a?.popularity;
      case 'relevance':
      default:
        return b?.relevanceScore - a?.relevanceScore;
    }
  });

  const allSelected = results?.length > 0 && selectedResults?.length === results?.length;
  const someSelected = selectedResults?.length > 0 && selectedResults?.length < results?.length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        {[...Array(5)]?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-4 h-4 bg-muted rounded"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-16 h-5 bg-muted rounded-full"></div>
                  <div className="w-12 h-5 bg-muted rounded-full"></div>
                  <div className="w-10 h-5 bg-muted rounded-full"></div>
                </div>
                <div className="w-3/4 h-6 bg-muted rounded mb-2"></div>
                <div className="w-full h-4 bg-muted rounded mb-1"></div>
                <div className="w-2/3 h-4 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results?.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Search" size={48} className="mx-auto text-text-secondary mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">
          Nessun risultato trovato
        </h3>
        <p className="text-text-secondary mb-6">
          Prova a modificare i filtri di ricerca o utilizzare parole chiave diverse.
        </p>
        <Button variant="outline" onClick={() => window.location?.reload()}>
          Nuova ricerca
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(e) => onSelectAll(e?.target?.checked)}
            />
            <span className="text-sm text-text-secondary">
              {selectedResults?.length > 0 
                ? `${selectedResults?.length} di ${results?.length} selezionati`
                : `${results?.length} risultati`
              }
            </span>
          </div>

          {selectedResults?.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('seo')}
                iconName="FileText"
                iconPosition="left"
              >
                Genera SEO ({selectedResults?.length})
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBulkAction('save')}
                iconName="Bookmark"
                iconPosition="left"
              >
                Salva tutto
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBulkAction('export')}
                iconName="Download"
                iconPosition="left"
              >
                Esporta
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-1 border border-border rounded-md text-sm bg-surface"
          >
            <option value="relevance">Rilevanza</option>
            <option value="date">Data</option>
            <option value="popularity">Popolarità</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-md">
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="rounded-r-none"
            >
              <Icon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <Icon name="List" size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Results */}
      <div className={viewMode === 'card' ? 'space-y-6' : 'space-y-4'}>
        {sortedResults?.map((result) => (
          <ResultCard
            key={result?.id}
            result={result}
            isSelected={selectedResults?.includes(result?.id)}
            onSelect={onSelectResult}
            onSave={handleSaveResult}
            onCopy={handleCopyResult}
          />
        ))}
      </div>
      {/* Pagination */}
      {pagination && pagination?.totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div className="text-sm text-text-secondary">
            Pagina {pagination?.currentPage} di {pagination?.totalPages} 
            ({pagination?.totalResults} risultati totali)
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination?.currentPage - 1)}
              disabled={pagination?.currentPage === 1}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Precedente
            </Button>
            
            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, pagination?.totalPages))]?.map((_, index) => {
                const pageNum = Math.max(1, pagination?.currentPage - 2) + index;
                if (pageNum > pagination?.totalPages) return null;
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination?.currentPage ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination?.currentPage + 1)}
              disabled={pagination?.currentPage === pagination?.totalPages}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Successiva
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsList;