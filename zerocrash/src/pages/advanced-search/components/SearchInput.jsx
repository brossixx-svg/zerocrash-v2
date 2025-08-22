import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SearchInput = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const mockSuggestions = [
    'Intelligenza artificiale 2024',
    'Machine learning trends',
    'Cybersecurity best practices',
    'Cloud computing AWS',
    'React 18 features',
    'DevOps automation tools',
    'Blockchain development',
    'Python data science',
    'Kubernetes deployment',
    'TypeScript migration guide'
  ];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query?.length > 2) {
        const filtered = mockSuggestions?.filter(suggestion =>
          suggestion?.toLowerCase()?.includes(query?.toLowerCase())
        );
        setSuggestions(filtered?.slice(0, 5));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query?.trim()) {
      onSearch(query?.trim());
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions?.length === 0) return;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions?.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e?.preventDefault();
          handleSuggestionClick(suggestions?.[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleInputBlur = (e) => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 200);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            type="search"
            placeholder="Cerca trend, tecnologie, parole chiave..."
            value={query}
            onChange={(e) => setQuery(e?.target?.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            onFocus={() => query?.length > 2 && setShowSuggestions(true)}
            className="pl-12 pr-24 h-14 text-lg"
            disabled={isLoading}
          />
          
          <Icon 
            name="Search" 
            size={20} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" 
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                  inputRef?.current?.focus();
                }}
                className="h-8 w-8"
              >
                <Icon name="X" size={16} />
              </Button>
            )}
            
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={!query?.trim() || isLoading}
              loading={isLoading}
              className="h-10 px-4"
            >
              {isLoading ? 'Ricerca...' : 'Cerca'}
            </Button>
          </div>
        </div>
      </form>
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions?.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-elevation-2 z-50 max-h-60 overflow-y-auto"
        >
          {suggestions?.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center space-x-3 ${
                index === selectedSuggestionIndex ? 'bg-muted' : ''
              }`}
            >
              <Icon name="Search" size={16} className="text-text-secondary flex-shrink-0" />
              <span className="text-text-primary">{suggestion}</span>
            </button>
          ))}
          
          <div className="px-4 py-2 border-t border-border bg-muted/50">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Usa ↑↓ per navigare, Enter per selezionare</span>
              <span>ESC per chiudere</span>
            </div>
          </div>
        </div>
      )}
      {/* Advanced Query Builder Hint */}
      <div className="mt-3 flex items-center space-x-4 text-sm text-text-secondary">
        <div className="flex items-center space-x-2">
          <Icon name="Info" size={14} />
          <span>Suggerimenti:</span>
        </div>
        <div className="flex items-center space-x-4">
          <span><code className="bg-muted px-1 rounded">"frase esatta"</code></span>
          <span><code className="bg-muted px-1 rounded">termine1 OR termine2</code></span>
          <span><code className="bg-muted px-1 rounded">-escludi</code></span>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;