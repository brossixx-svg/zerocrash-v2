import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const OutputSection = ({ 
  generatedTitles, 
  generatedDescriptions, 
  isGenerating, 
  onSaveTitle, 
  onEditTitle, 
  onCopyTitle,
  onGenerateDescriptions 
}) => {
  const [editingTitle, setEditingTitle] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [selectedTitleForDesc, setSelectedTitleForDesc] = useState(null);

  const handleEditStart = (index, title) => {
    setEditingTitle(index);
    setEditedText(title?.text);
  };

  const handleEditSave = (index) => {
    onEditTitle(index, editedText);
    setEditingTitle(null);
    setEditedText('');
  };

  const handleEditCancel = () => {
    setEditingTitle(null);
    setEditedText('');
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Contenuto Generato</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Esporta
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Save"
            iconPosition="left"
          >
            Salva Tutto
          </Button>
        </div>
      </div>
      {/* Generated Titles Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-text-primary">Titoli SEO Generati</h3>
          {generatedTitles?.length > 0 && (
            <span className="text-sm text-text-secondary">{generatedTitles?.length} variazioni</span>
          )}
        </div>

        {isGenerating ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5]?.map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : generatedTitles?.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nessun titolo generato</p>
            <p className="text-sm mt-1">Inserisci contenuto e clicca "Genera Contenuto SEO"</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {generatedTitles?.map((title, index) => (
              <div key={index} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    {editingTitle === index ? (
                      <div className="space-y-2">
                        <Input
                          type="text"
                          value={editedText}
                          onChange={(e) => setEditedText(e?.target?.value)}
                          className="text-sm"
                        />
                        <div className="flex space-x-2">
                          <Button
                            variant="default"
                            size="sm"
                            iconName="Check"
                            onClick={() => handleEditSave(index)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            iconName="X"
                            onClick={handleEditCancel}
                          />
                        </div>
                      </div>
                    ) : (
                      <h4 className="text-sm font-medium text-text-primary leading-relaxed">
                        {title?.text}
                      </h4>
                    )}
                  </div>
                  
                  {editingTitle !== index && (
                    <div className="flex items-center space-x-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit2"
                        onClick={() => handleEditStart(index, title)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Copy"
                        onClick={() => onCopyTitle(title?.text)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Heart"
                        onClick={() => onSaveTitle(title)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="ArrowRight"
                        onClick={() => {
                          setSelectedTitleForDesc(title);
                          onGenerateDescriptions(title?.text);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Scoring Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className={`p-2 rounded-lg ${getScoreBgColor(title?.scores?.readability)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Leggibilità</span>
                      <span className={`text-sm font-medium ${getScoreColor(title?.scores?.readability)}`}>
                        {title?.scores?.readability}%
                      </span>
                    </div>
                  </div>
                  
                  <div className={`p-2 rounded-lg ${getScoreBgColor(title?.scores?.length)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Lunghezza</span>
                      <span className={`text-sm font-medium ${getScoreColor(title?.scores?.length)}`}>
                        {title?.scores?.length}%
                      </span>
                    </div>
                  </div>
                  
                  <div className={`p-2 rounded-lg ${getScoreBgColor(title?.scores?.keywords)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Keywords</span>
                      <span className={`text-sm font-medium ${getScoreColor(title?.scores?.keywords)}`}>
                        {title?.scores?.keywords}%
                      </span>
                    </div>
                  </div>
                  
                  <div className={`p-2 rounded-lg ${getScoreBgColor(title?.scores?.trendFit)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-secondary">Trend Fit</span>
                      <span className={`text-sm font-medium ${getScoreColor(title?.scores?.trendFit)}`}>
                        {title?.scores?.trendFit}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-xs text-text-secondary">
                  Caratteri: {title?.text?.length} | Parole: {title?.text?.split(' ')?.length}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Meta Descriptions Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-text-primary">Meta Description</h3>
          {selectedTitleForDesc && (
            <span className="text-sm text-text-secondary">
              Per: "{selectedTitleForDesc?.text?.substring(0, 30)}..."
            </span>
          )}
        </div>

        {generatedDescriptions?.length === 0 ? (
          <div className="text-center py-8 text-text-secondary border border-dashed border-border rounded-lg">
            <Icon name="FileText" size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Seleziona un titolo per generare meta description</p>
          </div>
        ) : (
          <div className="space-y-3">
            {generatedDescriptions?.map((desc, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-text-primary flex-1 leading-relaxed">{desc?.text}</p>
                  <div className="flex items-center space-x-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Copy"
                      onClick={() => onCopyTitle(desc?.text)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Heart"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>Caratteri: {desc?.text?.length}/160</span>
                  <div className="flex items-center space-x-4">
                    <span>Score: <span className={getScoreColor(desc?.score)}>{desc?.score}%</span></span>
                    <div className={`w-2 h-2 rounded-full ${
                      desc?.text?.length <= 160 ? 'bg-success' : 'bg-error'
                    }`}></div>
                  </div>
                </div>
                
                {/* Preview Snippet */}
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="text-xs text-text-secondary mb-1">Anteprima SERP:</div>
                  <div className="text-sm text-primary font-medium">
                    {selectedTitleForDesc?.text || 'Titolo SEO'}
                  </div>
                  <div className="text-xs text-success">www.example.com</div>
                  <div className="text-xs text-text-secondary mt-1">{desc?.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputSection;