import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TemplateManager = ({ templates, onTemplateCreate, onTemplateUpdate, onTemplateDelete, onTemplateApply }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'general',
    parameters: {
      temperature: 0.7,
      maxTokens: 2048,
      topP: 1.0,
      frequencyPenalty: 0.0,
      presencePenalty: 0.0
    },
    systemMessage: '',
    tags: []
  });

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'creative', label: 'Creative Writing' },
    { value: 'analytical', label: 'Analytical' },
    { value: 'code', label: 'Code Generation' },
    { value: 'chat', label: 'Chat/Conversation' },
    { value: 'custom', label: 'Custom' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = () => {
    const template = {
      id: Date.now().toString(),
      ...newTemplate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };
    
    onTemplateCreate(template);
    setNewTemplate({
      name: '',
      description: '',
      category: 'general',
      parameters: {
        temperature: 0.7,
        maxTokens: 2048,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0
      },
      systemMessage: '',
      tags: []
    });
    setShowCreateForm(false);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'creative': return 'text-purple-600 bg-purple-100';
      case 'analytical': return 'text-blue-600 bg-blue-100';
      case 'code': return 'text-green-600 bg-green-100';
      case 'chat': return 'text-orange-600 bg-orange-100';
      case 'custom': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'creative': return 'Palette';
      case 'analytical': return 'BarChart3';
      case 'code': return 'Code';
      case 'chat': return 'MessageCircle';
      case 'custom': return 'Wrench';
      default: return 'FileText';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-foreground">Configuration Templates</h3>
          <p className="text-sm text-muted-foreground">Manage reusable configuration templates</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Create Template
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          options={categoryOptions}
          value={filterCategory}
          onChange={setFilterCategory}
          placeholder="Filter by category"
          className="w-48"
        />
      </div>

      {/* Create Template Form */}
      {showCreateForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Create New Template</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateForm(false)}
              iconName="X"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Template Name"
              value={newTemplate.name}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
              placeholder="My Custom Template"
              required
            />
            
            <Select
              label="Category"
              options={categoryOptions.slice(1)}
              value={newTemplate.category}
              onChange={(value) => setNewTemplate(prev => ({ ...prev, category: value }))}
            />
            
            <div className="md:col-span-2">
              <Input
                label="Description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this template is used for..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <Input
              label="Temperature"
              type="number"
              step="0.1"
              min="0"
              max="2"
              value={newTemplate.parameters.temperature}
              onChange={(e) => setNewTemplate(prev => ({
                ...prev,
                parameters: { ...prev.parameters, temperature: parseFloat(e.target.value) }
              }))}
            />
            
            <Input
              label="Max Tokens"
              type="number"
              min="1"
              max="32768"
              value={newTemplate.parameters.maxTokens}
              onChange={(e) => setNewTemplate(prev => ({
                ...prev,
                parameters: { ...prev.parameters, maxTokens: parseInt(e.target.value) }
              }))}
            />
            
            <Input
              label="Top P"
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={newTemplate.parameters.topP}
              onChange={(e) => setNewTemplate(prev => ({
                ...prev,
                parameters: { ...prev.parameters, topP: parseFloat(e.target.value) }
              }))}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">System Message</label>
            <textarea
              value={newTemplate.systemMessage}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, systemMessage: e.target.value }))}
              placeholder="Enter system message for this template..."
              className="w-full h-24 p-3 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTemplate}
              disabled={!newTemplate.name}
            >
              Create Template
            </Button>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getCategoryColor(template.category)}`}>
                  <Icon name={getCategoryIcon(template.category)} size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{template.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{template.category}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTemplate(template)}
                  iconName="Eye"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTemplateDelete(template.id)}
                  iconName="Trash2"
                  className="text-error hover:text-error"
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {template.description}
            </p>

            {/* Parameter Preview */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className="bg-muted/30 p-2 rounded">
                <span className="text-muted-foreground">Temp:</span>
                <span className="font-mono ml-1 text-foreground">{template.parameters.temperature}</span>
              </div>
              <div className="bg-muted/30 p-2 rounded">
                <span className="text-muted-foreground">Tokens:</span>
                <span className="font-mono ml-1 text-foreground">{template.parameters.maxTokens}</span>
              </div>
              <div className="bg-muted/30 p-2 rounded">
                <span className="text-muted-foreground">Top P:</span>
                <span className="font-mono ml-1 text-foreground">{template.parameters.topP}</span>
              </div>
              <div className="bg-muted/30 p-2 rounded">
                <span className="text-muted-foreground">Used:</span>
                <span className="font-mono ml-1 text-foreground">{template.usageCount || 0}x</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Updated {new Date(template.updatedAt).toLocaleDateString()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTemplateApply(template)}
                iconName="Download"
                iconPosition="left"
              >
                Apply
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || filterCategory ? 'Try adjusting your search or filter criteria' : 'Create your first configuration template'}
          </p>
          {!searchTerm && !filterCategory && (
            <Button
              onClick={() => setShowCreateForm(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Create Template
            </Button>
          )}
        </div>
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-foreground">{selectedTemplate.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTemplate(null)}
                  iconName="X"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedTemplate.description}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Parameters</label>
                  <pre className="bg-muted p-3 rounded-md text-sm font-mono text-foreground mt-1 overflow-x-auto">
                    {JSON.stringify(selectedTemplate.parameters, null, 2)}
                  </pre>
                </div>
                
                {selectedTemplate.systemMessage && (
                  <div>
                    <label className="text-sm font-medium text-foreground">System Message</label>
                    <p className="text-sm text-muted-foreground mt-1 bg-muted p-3 rounded-md">
                      {selectedTemplate.systemMessage}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      onTemplateApply(selectedTemplate);
                      setSelectedTemplate(null);
                    }}
                    iconName="Download"
                    iconPosition="left"
                  >
                    Apply Template
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManager;