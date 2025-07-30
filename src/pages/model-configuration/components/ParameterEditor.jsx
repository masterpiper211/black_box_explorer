import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ParameterEditor = ({ selectedModel, onParameterUpdate, onTemplateApply }) => {
  const [parameters, setParameters] = useState({
    temperature: selectedModel?.parameters?.temperature || 0.7,
    maxTokens: selectedModel?.parameters?.maxTokens || 2048,
    topP: selectedModel?.parameters?.topP || 1.0,
    frequencyPenalty: selectedModel?.parameters?.frequencyPenalty || 0.0,
    presencePenalty: selectedModel?.parameters?.presencePenalty || 0.0,
    stopSequences: selectedModel?.parameters?.stopSequences || [],
    systemMessage: selectedModel?.parameters?.systemMessage || '',
    contextWindow: selectedModel?.parameters?.contextWindow || 4096,
    batchSize: selectedModel?.parameters?.batchSize || 1,
    retryAttempts: selectedModel?.parameters?.retryAttempts || 3,
    timeout: selectedModel?.parameters?.timeout || 30000
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [newStopSequence, setNewStopSequence] = useState('');

  const templates = [
    {
      id: 'creative',
      name: 'Creative Writing',
      description: 'High creativity for content generation',
      parameters: {
        temperature: 0.9,
        topP: 0.95,
        frequencyPenalty: 0.3,
        presencePenalty: 0.1
      }
    },
    {
      id: 'analytical',
      name: 'Analytical Tasks',
      description: 'Low temperature for factual responses',
      parameters: {
        temperature: 0.2,
        topP: 0.8,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      }
    },
    {
      id: 'balanced',
      name: 'Balanced',
      description: 'Balanced settings for general use',
      parameters: {
        temperature: 0.7,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      }
    },
    {
      id: 'code',
      name: 'Code Generation',
      description: 'Optimized for code generation tasks',
      parameters: {
        temperature: 0.1,
        topP: 0.95,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      }
    }
  ];

  const validateParameters = () => {
    const errors = {};
    
    if (parameters.temperature < 0 || parameters.temperature > 2) {
      errors.temperature = 'Temperature must be between 0 and 2';
    }
    
    if (parameters.maxTokens < 1 || parameters.maxTokens > 32768) {
      errors.maxTokens = 'Max tokens must be between 1 and 32,768';
    }
    
    if (parameters.topP < 0 || parameters.topP > 1) {
      errors.topP = 'Top P must be between 0 and 1';
    }
    
    if (parameters.frequencyPenalty < -2 || parameters.frequencyPenalty > 2) {
      errors.frequencyPenalty = 'Frequency penalty must be between -2 and 2';
    }
    
    if (parameters.presencePenalty < -2 || parameters.presencePenalty > 2) {
      errors.presencePenalty = 'Presence penalty must be between -2 and 2';
    }

    if (parameters.contextWindow < 1 || parameters.contextWindow > 128000) {
      errors.contextWindow = 'Context window must be between 1 and 128,000';
    }

    if (parameters.batchSize < 1 || parameters.batchSize > 100) {
      errors.batchSize = 'Batch size must be between 1 and 100';
    }

    if (parameters.retryAttempts < 0 || parameters.retryAttempts > 10) {
      errors.retryAttempts = 'Retry attempts must be between 0 and 10';
    }

    if (parameters.timeout < 1000 || parameters.timeout > 300000) {
      errors.timeout = 'Timeout must be between 1,000 and 300,000 ms';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleParameterChange = (key, value) => {
    setParameters(prev => ({ ...prev, [key]: value }));
    
    // Clear validation error for this field
    if (validationErrors[key]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    if (validateParameters()) {
      onParameterUpdate(selectedModel.id, parameters);
    }
  };

  const handleTemplateApply = (template) => {
    const newParameters = { ...parameters, ...template.parameters };
    setParameters(newParameters);
    setValidationErrors({});
  };

  const handleAddStopSequence = () => {
    if (newStopSequence.trim() && !parameters.stopSequences.includes(newStopSequence.trim())) {
      setParameters(prev => ({
        ...prev,
        stopSequences: [...prev.stopSequences, newStopSequence.trim()]
      }));
      setNewStopSequence('');
    }
  };

  const handleRemoveStopSequence = (index) => {
    setParameters(prev => ({
      ...prev,
      stopSequences: prev.stopSequences.filter((_, i) => i !== index)
    }));
  };

  const generatePreview = () => {
    return `{
  "model": "${selectedModel?.name || 'gpt-4'}",
  "temperature": ${parameters.temperature},
  "max_tokens": ${parameters.maxTokens},
  "top_p": ${parameters.topP},
  "frequency_penalty": ${parameters.frequencyPenalty},
  "presence_penalty": ${parameters.presencePenalty},
  "stop": [${parameters.stopSequences.map(seq => `"${seq}"`).join(', ')}],
  "system_message": "${parameters.systemMessage}",
  "context_window": ${parameters.contextWindow},
  "batch_size": ${parameters.batchSize},
  "retry_attempts": ${parameters.retryAttempts},
  "timeout": ${parameters.timeout}
}`;
  };

  if (!selectedModel) {
    return (
      <div className="text-center py-12">
        <Icon name="Settings" size={48} className="mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No model selected</h3>
        <p className="text-muted-foreground">Select a model from the Models tab to configure parameters</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-foreground">Parameter Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Configuring parameters for <span className="font-medium">{selectedModel.name}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            iconName={previewMode ? "Edit" : "Eye"}
            iconPosition="left"
          >
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={Object.keys(validationErrors).length > 0}
            iconName="Save"
            iconPosition="left"
          >
            Save Parameters
          </Button>
        </div>
      </div>

      {/* Templates */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-3">Quick Templates</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleTemplateApply(template)}
              className="p-3 text-left border border-border rounded-lg hover:bg-muted/50 transition-colors focus-ring"
            >
              <div className="font-medium text-foreground text-sm mb-1">{template.name}</div>
              <div className="text-xs text-muted-foreground">{template.description}</div>
            </button>
          ))}
        </div>
      </div>

      {previewMode ? (
        /* Preview Mode */
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Configuration Preview</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(generatePreview())}
              iconName="Copy"
              iconPosition="left"
            >
              Copy JSON
            </Button>
          </div>
          <pre className="bg-muted p-4 rounded-md text-sm font-mono text-foreground overflow-x-auto">
            {generatePreview()}
          </pre>
        </div>
      ) : (
        /* Edit Mode */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Core Parameters */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h4 className="font-medium text-foreground mb-4">Core Parameters</h4>
            <div className="space-y-4">
              <Input
                label="Temperature"
                type="number"
                step="0.1"
                min="0"
                max="2"
                value={parameters.temperature}
                onChange={(e) => handleParameterChange('temperature', parseFloat(e.target.value))}
                error={validationErrors.temperature}
                description="Controls randomness. Lower values make output more focused and deterministic."
              />
              
              <Input
                label="Max Tokens"
                type="number"
                min="1"
                max="32768"
                value={parameters.maxTokens}
                onChange={(e) => handleParameterChange('maxTokens', parseInt(e.target.value))}
                error={validationErrors.maxTokens}
                description="Maximum number of tokens to generate in the response."
              />
              
              <Input
                label="Top P"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={parameters.topP}
                onChange={(e) => handleParameterChange('topP', parseFloat(e.target.value))}
                error={validationErrors.topP}
                description="Nucleus sampling parameter. Controls diversity via nucleus sampling."
              />
              
              <Input
                label="Frequency Penalty"
                type="number"
                step="0.1"
                min="-2"
                max="2"
                value={parameters.frequencyPenalty}
                onChange={(e) => handleParameterChange('frequencyPenalty', parseFloat(e.target.value))}
                error={validationErrors.frequencyPenalty}
                description="Reduces likelihood of repeating tokens based on frequency."
              />
              
              <Input
                label="Presence Penalty"
                type="number"
                step="0.1"
                min="-2"
                max="2"
                value={parameters.presencePenalty}
                onChange={(e) => handleParameterChange('presencePenalty', parseFloat(e.target.value))}
                error={validationErrors.presencePenalty}
                description="Reduces likelihood of repeating any token that has appeared."
              />
            </div>
          </div>

          {/* Advanced Parameters */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h4 className="font-medium text-foreground mb-4">Advanced Parameters</h4>
            <div className="space-y-4">
              <Input
                label="Context Window"
                type="number"
                min="1"
                max="128000"
                value={parameters.contextWindow}
                onChange={(e) => handleParameterChange('contextWindow', parseInt(e.target.value))}
                error={validationErrors.contextWindow}
                description="Maximum context length in tokens."
              />
              
              <Input
                label="Batch Size"
                type="number"
                min="1"
                max="100"
                value={parameters.batchSize}
                onChange={(e) => handleParameterChange('batchSize', parseInt(e.target.value))}
                error={validationErrors.batchSize}
                description="Number of requests to process in parallel."
              />
              
              <Input
                label="Retry Attempts"
                type="number"
                min="0"
                max="10"
                value={parameters.retryAttempts}
                onChange={(e) => handleParameterChange('retryAttempts', parseInt(e.target.value))}
                error={validationErrors.retryAttempts}
                description="Number of retry attempts on failure."
              />
              
              <Input
                label="Timeout (ms)"
                type="number"
                min="1000"
                max="300000"
                value={parameters.timeout}
                onChange={(e) => handleParameterChange('timeout', parseInt(e.target.value))}
                error={validationErrors.timeout}
                description="Request timeout in milliseconds."
              />
            </div>
          </div>

          {/* System Message */}
          <div className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
            <h4 className="font-medium text-foreground mb-4">System Message</h4>
            <textarea
              value={parameters.systemMessage}
              onChange={(e) => handleParameterChange('systemMessage', e.target.value)}
              placeholder="Enter system message to set the behavior and context for the AI model..."
              className="w-full h-32 p-3 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              System message helps define the AI's role and behavior throughout the conversation.
            </p>
          </div>

          {/* Stop Sequences */}
          <div className="bg-card border border-border rounded-lg p-6 lg:col-span-2">
            <h4 className="font-medium text-foreground mb-4">Stop Sequences</h4>
            <div className="flex space-x-2 mb-3">
              <Input
                value={newStopSequence}
                onChange={(e) => setNewStopSequence(e.target.value)}
                placeholder="Enter stop sequence..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleAddStopSequence()}
              />
              <Button
                onClick={handleAddStopSequence}
                disabled={!newStopSequence.trim()}
                iconName="Plus"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {parameters.stopSequences.map((sequence, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-full text-sm"
                >
                  <span className="text-foreground font-mono">"{sequence}"</span>
                  <button
                    onClick={() => handleRemoveStopSequence(index)}
                    className="text-muted-foreground hover:text-error transition-colors"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
              ))}
            </div>
            
            {parameters.stopSequences.length === 0 && (
              <p className="text-sm text-muted-foreground">No stop sequences configured</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParameterEditor;