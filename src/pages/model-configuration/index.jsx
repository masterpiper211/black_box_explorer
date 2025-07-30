import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ConfigurationTabs from './components/ConfigurationTabs';
import ModelGrid from './components/ModelGrid';
import EndpointManager from './components/EndpointManager';
import ParameterEditor from './components/ParameterEditor';
import TemplateManager from './components/TemplateManager';
import MonitoringDashboard from './components/MonitoringDashboard';
import SecuritySettings from './components/SecuritySettings';

const ModelConfiguration = () => {
  const [activeTab, setActiveTab] = useState('models');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  // Mock data for models
  const [models, setModels] = useState([
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      description: 'Latest GPT-4 model with improved performance and reduced costs',
      provider: 'openai',
      version: '1106-preview',
      status: 'active',
      rateLimit: 10000,
      costPerToken: 0.00003,
      lastUpdated: '2025-01-30',
      parameters: {
        temperature: 0.7,
        maxTokens: 4096,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        stopSequences: [],
        systemMessage: 'You are a helpful AI assistant.',
        contextWindow: 128000,
        batchSize: 1,
        retryAttempts: 3,
        timeout: 30000
      }
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Fast and efficient model for most conversational tasks',
      provider: 'openai',
      version: '0125',
      status: 'active',
      rateLimit: 60000,
      costPerToken: 0.0000015,
      lastUpdated: '2025-01-29',
      parameters: {
        temperature: 0.7,
        maxTokens: 4096,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        stopSequences: [],
        systemMessage: '',
        contextWindow: 16385,
        batchSize: 1,
        retryAttempts: 3,
        timeout: 30000
      }
    },
    {
      id: 'claude-3-opus',
      name: 'Claude-3 Opus',
      description: 'Most capable model for complex reasoning and analysis',
      provider: 'anthropic',
      version: '20240229',
      status: 'active',
      rateLimit: 5000,
      costPerToken: 0.000075,
      lastUpdated: '2025-01-28',
      parameters: {
        temperature: 0.7,
        maxTokens: 4096,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        stopSequences: [],
        systemMessage: '',
        contextWindow: 200000,
        batchSize: 1,
        retryAttempts: 3,
        timeout: 30000
      }
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      description: 'Google\'s advanced multimodal AI model',
      provider: 'google',
      version: '1.0',
      status: 'maintenance',
      rateLimit: 15000,
      costPerToken: 0.000025,
      lastUpdated: '2025-01-27',
      parameters: {
        temperature: 0.9,
        maxTokens: 2048,
        topP: 0.95,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        stopSequences: [],
        systemMessage: '',
        contextWindow: 32768,
        batchSize: 1,
        retryAttempts: 3,
        timeout: 30000
      }
    },
    {
      id: 'azure-gpt-4',
      name: 'Azure GPT-4',
      description: 'GPT-4 deployed on Microsoft Azure infrastructure',
      provider: 'azure',
      version: '0613',
      status: 'inactive',
      rateLimit: 8000,
      costPerToken: 0.00006,
      lastUpdated: '2025-01-26',
      parameters: {
        temperature: 0.7,
        maxTokens: 8192,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        stopSequences: [],
        systemMessage: '',
        contextWindow: 8192,
        batchSize: 1,
        retryAttempts: 3,
        timeout: 30000
      }
    }
  ]);

  // Mock data for endpoints
  const [endpoints, setEndpoints] = useState([
    {
      id: 'openai-main',
      name: 'OpenAI Primary',
      url: 'https://api.openai.com/v1',
      provider: 'openai',
      authType: 'api_key',
      region: 'us-east-1',
      status: 'active',
      timeout: 30000,
      uptime: '99.9%',
      avgLatency: '245ms',
      requestsToday: '12,847',
      errorRate: '0.1%',
      lastTested: '2025-01-30T08:45:00Z'
    },
    {
      id: 'anthropic-main',
      name: 'Anthropic Claude',
      url: 'https://api.anthropic.com/v1',
      provider: 'anthropic',
      authType: 'api_key',
      region: 'us-west-2',
      status: 'active',
      timeout: 30000,
      uptime: '99.7%',
      avgLatency: '312ms',
      requestsToday: '8,234',
      errorRate: '0.2%',
      lastTested: '2025-01-30T08:40:00Z'
    },
    {
      id: 'google-ai',
      name: 'Google AI Studio',
      url: 'https://generativelanguage.googleapis.com/v1',
      provider: 'google',
      authType: 'api_key',
      region: 'us-central1',
      status: 'maintenance',
      timeout: 30000,
      uptime: '98.5%',
      avgLatency: '198ms',
      requestsToday: '3,456',
      errorRate: '1.2%',
      lastTested: '2025-01-30T07:30:00Z'
    }
  ]);

  // Mock data for templates
  const [templates, setTemplates] = useState([
    {
      id: 'creative-writing',
      name: 'Creative Writing',
      description: 'Optimized for creative content generation with high creativity',
      category: 'creative',
      parameters: {
        temperature: 0.9,
        maxTokens: 4096,
        topP: 0.95,
        frequencyPenalty: 0.3,
        presencePenalty: 0.1
      },
      systemMessage: 'You are a creative writing assistant. Help users craft engaging, imaginative content with vivid descriptions and compelling narratives.',
      tags: ['creative', 'writing', 'storytelling'],
      createdAt: '2025-01-25T10:00:00Z',
      updatedAt: '2025-01-28T14:30:00Z',
      usageCount: 45
    },
    {
      id: 'code-generation',
      name: 'Code Generation',
      description: 'Precise settings for generating clean, functional code',
      category: 'code',
      parameters: {
        temperature: 0.1,
        maxTokens: 8192,
        topP: 0.95,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      },
      systemMessage: 'You are an expert software engineer. Write clean, efficient, and well-documented code following best practices.',
      tags: ['code', 'programming', 'development'],
      createdAt: '2025-01-20T09:15:00Z',
      updatedAt: '2025-01-29T11:45:00Z',
      usageCount: 78
    },
    {
      id: 'analytical-tasks',
      name: 'Analytical Tasks',
      description: 'Low temperature for factual, analytical responses',
      category: 'analytical',
      parameters: {
        temperature: 0.2,
        maxTokens: 2048,
        topP: 0.8,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      },
      systemMessage: 'You are an analytical assistant. Provide factual, well-reasoned responses based on data and evidence.',
      tags: ['analysis', 'facts', 'research'],
      createdAt: '2025-01-22T16:20:00Z',
      updatedAt: '2025-01-30T08:00:00Z',
      usageCount: 32
    }
  ]);

  useEffect(() => {
    // Set first model as selected by default for parameter editor
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0]);
    }
  }, [models, selectedModel]);

  const handleModelUpdate = (modelId, updates) => {
    setModels(prev => prev.map(model => 
      model.id === modelId ? { ...model, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : model
    ));
    setHasUnsavedChanges(true);
  };

  const handleModelDelete = (modelId) => {
    if (window.confirm('Are you sure you want to delete this model configuration?')) {
      setModels(prev => prev.filter(model => model.id !== modelId));
      if (selectedModel?.id === modelId) {
        setSelectedModel(models.find(m => m.id !== modelId) || null);
      }
      setHasUnsavedChanges(true);
    }
  };

  const handleBulkUpdate = (modelIds, action) => {
    const updates = {};
    switch (action) {
      case 'activate':
        updates.status = 'active';
        break;
      case 'deactivate':
        updates.status = 'inactive';
        break;
      case 'maintenance':
        updates.status = 'maintenance';
        break;
      default:
        return;
    }

    setModels(prev => prev.map(model => 
      modelIds.includes(model.id) 
        ? { ...model, ...updates, lastUpdated: new Date().toISOString().split('T')[0] }
        : model
    ));
    setHasUnsavedChanges(true);
  };

  const handleEndpointUpdate = (endpoint) => {
    if (endpoint.id) {
      // Update existing endpoint
      setEndpoints(prev => prev.map(ep => ep.id === endpoint.id ? endpoint : ep));
    } else {
      // Add new endpoint
      setEndpoints(prev => [...prev, endpoint]);
    }
    setHasUnsavedChanges(true);
  };

  const handleEndpointDelete = (endpointId) => {
    if (window.confirm('Are you sure you want to delete this endpoint?')) {
      setEndpoints(prev => prev.filter(ep => ep.id !== endpointId));
      setHasUnsavedChanges(true);
    }
  };

  const handleParameterUpdate = (modelId, parameters) => {
    setModels(prev => prev.map(model => 
      model.id === modelId 
        ? { ...model, parameters, lastUpdated: new Date().toISOString().split('T')[0] }
        : model
    ));
    setHasUnsavedChanges(true);
  };

  const handleTemplateCreate = (template) => {
    setTemplates(prev => [...prev, template]);
    setHasUnsavedChanges(true);
  };

  const handleTemplateUpdate = (templateId, updates) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, ...updates, updatedAt: new Date().toISOString() }
        : template
    ));
    setHasUnsavedChanges(true);
  };

  const handleTemplateDelete = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(template => template.id !== templateId));
      setHasUnsavedChanges(true);
    }
  };

  const handleTemplateApply = (template) => {
    if (selectedModel) {
      const updatedParameters = { ...selectedModel.parameters, ...template.parameters };
      handleParameterUpdate(selectedModel.id, updatedParameters);
      
      // Update template usage count
      setTemplates(prev => prev.map(t => 
        t.id === template.id 
          ? { ...t, usageCount: (t.usageCount || 0) + 1 }
          : t
      ));
    }
  };

  const handleSecurityUpdate = (securitySettings) => {
    console.log('Security settings updated:', securitySettings);
    setHasUnsavedChanges(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'models':
        return (
          <ModelGrid
            models={models}
            onModelUpdate={handleModelUpdate}
            onModelDelete={handleModelDelete}
            onBulkUpdate={handleBulkUpdate}
          />
        );
      
      case 'endpoints':
        return (
          <EndpointManager
            endpoints={endpoints}
            onEndpointUpdate={handleEndpointUpdate}
            onEndpointTest={(endpointId) => console.log('Testing endpoint:', endpointId)}
            onEndpointDelete={handleEndpointDelete}
          />
        );
      
      case 'parameters':
        return (
          <ParameterEditor
            selectedModel={selectedModel}
            onParameterUpdate={handleParameterUpdate}
            onTemplateApply={handleTemplateApply}
          />
        );
      
      case 'templates':
        return (
          <TemplateManager
            templates={templates}
            onTemplateCreate={handleTemplateCreate}
            onTemplateUpdate={handleTemplateUpdate}
            onTemplateDelete={handleTemplateDelete}
            onTemplateApply={handleTemplateApply}
          />
        );
      
      case 'monitoring':
        return (
          <MonitoringDashboard
            models={models}
            endpoints={endpoints}
          />
        );
      
      case 'security':
        return (
          <SecuritySettings
            onSecurityUpdate={handleSecurityUpdate}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        <ConfigurationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          modelCount={models.length}
          endpointCount={endpoints.length}
          hasUnsavedChanges={hasUnsavedChanges}
        />
        
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ModelConfiguration;