import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ModelGrid = ({ models, onModelUpdate, onModelDelete, onBulkUpdate }) => {
  const [selectedModels, setSelectedModels] = useState([]);
  const [editingModel, setEditingModel] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvider, setFilterProvider] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const providerOptions = [
    { value: '', label: 'All Providers' },
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'google', label: 'Google' },
    { value: 'azure', label: 'Azure OpenAI' },
    { value: 'aws', label: 'AWS Bedrock' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'deprecated', label: 'Deprecated' }
  ];

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         model.version.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider = !filterProvider || model.provider === filterProvider;
    const matchesStatus = !filterStatus || model.status === filterStatus;
    return matchesSearch && matchesProvider && matchesStatus;
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedModels(filteredModels.map(model => model.id));
    } else {
      setSelectedModels([]);
    }
  };

  const handleSelectModel = (modelId, checked) => {
    if (checked) {
      setSelectedModels(prev => [...prev, modelId]);
    } else {
      setSelectedModels(prev => prev.filter(id => id !== modelId));
    }
  };

  const handleEditStart = (model) => {
    setEditingModel(model.id);
    setEditValues({
      name: model.name,
      version: model.version,
      rateLimit: model.rateLimit,
      costPerToken: model.costPerToken,
      status: model.status
    });
  };

  const handleEditSave = () => {
    onModelUpdate(editingModel, editValues);
    setEditingModel(null);
    setEditValues({});
  };

  const handleEditCancel = () => {
    setEditingModel(null);
    setEditValues({});
  };

  const handleBulkAction = (action) => {
    if (selectedModels.length === 0) return;
    onBulkUpdate(selectedModels, action);
    setSelectedModels([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'inactive': return 'text-muted-foreground bg-muted';
      case 'maintenance': return 'text-warning bg-warning/10';
      case 'deprecated': return 'text-error bg-error/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case 'openai': return 'Bot';
      case 'anthropic': return 'Brain';
      case 'google': return 'Search';
      case 'azure': return 'Cloud';
      case 'aws': return 'Server';
      default: return 'Cpu';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search models by name or version..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-4">
          <Select
            options={providerOptions}
            value={filterProvider}
            onChange={setFilterProvider}
            placeholder="Filter by provider"
            className="w-48"
          />
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filter by status"
            className="w-48"
          />
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedModels.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <span className="text-sm font-medium text-foreground">
            {selectedModels.length} model{selectedModels.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('activate')}
              iconName="Play"
              iconPosition="left"
            >
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('deactivate')}
              iconName="Pause"
              iconPosition="left"
            >
              Deactivate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('maintenance')}
              iconName="Settings"
              iconPosition="left"
            >
              Maintenance
            </Button>
          </div>
        </div>
      )}

      {/* Models Grid */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={selectedModels.length === filteredModels.length && filteredModels.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-border"
                  />
                </th>
                <th className="text-left p-4 font-medium text-foreground">Model</th>
                <th className="text-left p-4 font-medium text-foreground">Provider</th>
                <th className="text-left p-4 font-medium text-foreground">Version</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Rate Limit</th>
                <th className="text-left p-4 font-medium text-foreground">Cost/Token</th>
                <th className="text-left p-4 font-medium text-foreground">Last Updated</th>
                <th className="text-right p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredModels.map((model) => (
                <tr key={model.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedModels.includes(model.id)}
                      onChange={(e) => handleSelectModel(model.id, e.target.checked)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    {editingModel === model.id ? (
                      <Input
                        value={editValues.name}
                        onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full"
                      />
                    ) : (
                      <div>
                        <div className="font-medium text-foreground">{model.name}</div>
                        <div className="text-sm text-muted-foreground">{model.description}</div>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Icon name={getProviderIcon(model.provider)} size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground capitalize">{model.provider}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {editingModel === model.id ? (
                      <Input
                        value={editValues.version}
                        onChange={(e) => setEditValues(prev => ({ ...prev, version: e.target.value }))}
                        className="w-24"
                      />
                    ) : (
                      <span className="text-sm font-mono text-foreground">{model.version}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingModel === model.id ? (
                      <Select
                        options={statusOptions.slice(1)}
                        value={editValues.status}
                        onChange={(value) => setEditValues(prev => ({ ...prev, status: value }))}
                        className="w-32"
                      />
                    ) : (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(model.status)}`}>
                        {model.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingModel === model.id ? (
                      <Input
                        type="number"
                        value={editValues.rateLimit}
                        onChange={(e) => setEditValues(prev => ({ ...prev, rateLimit: e.target.value }))}
                        className="w-24"
                      />
                    ) : (
                      <span className="text-sm text-foreground">{model.rateLimit}/min</span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingModel === model.id ? (
                      <Input
                        type="number"
                        step="0.000001"
                        value={editValues.costPerToken}
                        onChange={(e) => setEditValues(prev => ({ ...prev, costPerToken: e.target.value }))}
                        className="w-28"
                      />
                    ) : (
                      <span className="text-sm font-mono text-foreground">${model.costPerToken}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">{model.lastUpdated}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2">
                      {editingModel === model.id ? (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleEditSave}
                            iconName="Check"
                            className="text-success hover:text-success"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleEditCancel}
                            iconName="X"
                            className="text-error hover:text-error"
                          />
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditStart(model)}
                            iconName="Edit"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onModelDelete(model.id)}
                            iconName="Trash2"
                            className="text-error hover:text-error"
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No models found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ModelGrid;