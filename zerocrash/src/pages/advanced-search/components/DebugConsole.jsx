import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DebugConsole = ({ apiResponses, searchQuery, filters, isVisible, onToggle }) => {
  const [activeTab, setActiveTab] = useState('request');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const formatJson = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 400 && status < 500) return 'text-yellow-600';
    if (status >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  const getResponseTime = (response) => {
    return response?.responseTime ? `${response?.responseTime}ms` : 'N/A';
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-30">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggle}
          iconName="Terminal"
          iconPosition="left"
          className="shadow-elevation-2"
        >
          Debug Console
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border shadow-elevation-2 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
        <div className="flex items-center space-x-3">
          <Icon name="Terminal" size={20} className="text-text-primary" />
          <h3 className="font-semibold text-text-primary">Debug Console</h3>
          <div className="flex items-center space-x-2">
            {apiResponses?.map((response, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  response?.status >= 200 && response?.status < 300 
                    ? 'bg-green-500' :'bg-red-500'
                }`}
                title={`${response?.source}: ${response?.status}`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const debugData = {
                query: searchQuery,
                filters,
                responses: apiResponses,
                timestamp: new Date()?.toISOString()
              };
              navigator.clipboard?.writeText(formatJson(debugData));
            }}
            iconName="Copy"
          >
            Copia
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            iconName="X"
          />
        </div>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-border">
        {['request', 'responses', 'timing', 'errors']?.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab === 'request' && 'Richiesta'}
            {tab === 'responses' && 'Risposte'}
            {tab === 'timing' && 'Timing'}
            {tab === 'errors' && 'Errori'}
          </button>
        ))}
      </div>
      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-64 bg-gray-900 text-green-400 font-mono text-sm">
        {activeTab === 'request' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-white mb-2">Query di ricerca:</h4>
              <pre className="bg-gray-800 p-3 rounded overflow-x-auto">
                {searchQuery || 'Nessuna query'}
              </pre>
            </div>
            
            <div>
              <h4 className="text-white mb-2">Filtri applicati:</h4>
              <pre className="bg-gray-800 p-3 rounded overflow-x-auto">
                {formatJson(filters)}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'responses' && (
          <div className="space-y-4">
            {apiResponses?.map((response, index) => (
              <div key={index} className="border border-gray-700 rounded">
                <button
                  onClick={() => toggleSection(`response-${index}`)}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-semibold capitalize">
                      {response?.source}
                    </span>
                    <span className={`text-sm ${getStatusColor(response?.status)}`}>
                      {response?.status}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {getResponseTime(response)}
                    </span>
                  </div>
                  <Icon 
                    name={expandedSections?.[`response-${index}`] ? "ChevronUp" : "ChevronDown"} 
                    size={16} 
                  />
                </button>
                
                {expandedSections?.[`response-${index}`] && (
                  <div className="p-3 border-t border-gray-700 bg-gray-800">
                    <pre className="overflow-x-auto text-xs">
                      {formatJson(response?.data)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timing' && (
          <div className="space-y-3">
            <h4 className="text-white mb-3">Performance delle API:</h4>
            {apiResponses?.map((response, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                <span className="text-white capitalize">{response?.source}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">{getResponseTime(response)}</span>
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        response?.responseTime < 1000 ? 'bg-green-500' :
                        response?.responseTime < 3000 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (response?.responseTime / 5000) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'errors' && (
          <div className="space-y-3">
            {apiResponses?.filter(r => r?.status >= 400)?.length === 0 ? (
              <div className="text-green-400 text-center py-8">
                <Icon name="CheckCircle" size={24} className="mx-auto mb-2" />
                <p>Nessun errore rilevato</p>
              </div>
            ) : (
              apiResponses?.filter(r => r?.status >= 400)?.map((response, index) => (
                  <div key={index} className="bg-red-900/20 border border-red-500/30 rounded p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="AlertCircle" size={16} className="text-red-400" />
                      <span className="text-red-400 font-semibold capitalize">
                        {response?.source}
                      </span>
                      <span className="text-red-300">
                        Error {response?.status}
                      </span>
                    </div>
                    <pre className="text-red-200 text-xs overflow-x-auto">
                      {response?.error || 'Errore sconosciuto'}
                    </pre>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugConsole;