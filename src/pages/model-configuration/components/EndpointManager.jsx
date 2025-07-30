import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EndpointManager = ({ endpoints, onEndpointUpdate, onEndpointTest, onEndpointDelete }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEndpoint, setNewEndpoint] = useState({
    name: '',
    url: '',
    provider: '',
    authType: 'api_key',
    apiKey: '',
    region: '',
    timeout: 30000
  });

  const providerOptions = [
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'google', label: 'Google AI' },
    { value: 'azure', label: 'Azure OpenAI' },
    { value: 'aws', label: 'AWS Bedrock' },
    { value: 'custom', label: 'Custom API' }
  ];

  const authTypeOptions = [
    { value: 'api_key', label: 'API Key' },
    { value: 'bearer_token', label: 'Bearer Token' },
    { value: 'oauth2', label: 'OAuth 2.0' },
    { value: 'basic_auth', label: 'Basic Auth' }
  ];

  const handleTestEndpoint = async (endpointId) => {
    setTestResults(prev => ({ ...prev, [endpointId]: { status: 'testing', message: 'Testing connection...' } }));
    
    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setTestResults(prev => ({
        ...prev,
        [endpointId]: {
          status: success ? 'success' : 'error',
          message: success ? 'Connection successful' : 'Connection failed: Timeout after 5s',
          latency: success ? Math.floor(Math.random() * 500) + 100 : null,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    }, 2000);
  };

  const handleAddEndpoint = () => {
    const endpoint = {
      id: Date.now().toString(),
      ...newEndpoint,
      status: 'inactive',
      lastTested: null,
      createdAt: new Date().toISOString()
    };
    
    onEndpointUpdate(endpoint);
    setNewEndpoint({
      name: '',
      url: '',
      provider: '',
      authType: 'api_key',
      apiKey: '',
      region: '',
      timeout: 30000
    });
    setShowAddForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'inactive': return 'text-muted-foreground bg-muted';
      case 'error': return 'text-error bg-error/10';
      case 'testing': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getTestStatusIcon = (result) => {
    if (!result) return 'Circle';
    switch (result.status) {
      case 'testing': return 'Loader';
      case 'success': return 'CheckCircle';
      case 'error': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getTestStatusColor = (result) => {
    if (!result) return 'text-muted-foreground';
    switch (result.status) {
      case 'testing': return 'text-warning animate-spin';
      case 'success': return 'text-success';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-foreground">API Endpoints</h3>
          <p className="text-sm text-muted-foreground">Manage and monitor API endpoint connections</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Add Endpoint
        </Button>
      </div>

      {/* Add Endpoint Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Add New Endpoint</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddForm(false)}
              iconName="X"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Endpoint Name"
              value={newEndpoint.name}
              onChange={(e) => setNewEndpoint(prev => ({ ...prev, name: e.target.value }))}
              placeholder="My API Endpoint"
              required
            />
            
            <Select
              label="Provider"
              options={providerOptions}
              value={newEndpoint.provider}
              onChange={(value) => setNewEndpoint(prev => ({ ...prev, provider: value }))}
              required
            />
            
            <Input
              label="API URL"
              value={newEndpoint.url}
              onChange={(e) => setNewEndpoint(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://api.example.com/v1"
              className="md:col-span-2"
              required
            />
            
            <Select
              label="Authentication Type"
              options={authTypeOptions}
              value={newEndpoint.authType}
              onChange={(value) => setNewEndpoint(prev => ({ ...prev, authType: value }))}
            />
            
            <Input
              label="API Key"
              type="password"
              value={newEndpoint.apiKey}
              onChange={(e) => setNewEndpoint(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="sk-..."
              required
            />
            
            <Input
              label="Region (Optional)"
              value={newEndpoint.region}
              onChange={(e) => setNewEndpoint(prev => ({ ...prev, region: e.target.value }))}
              placeholder="us-east-1"
            />
            
            <Input
              label="Timeout (ms)"
              type="number"
              value={newEndpoint.timeout}
              onChange={(e) => setNewEndpoint(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
              min="1000"
              max="60000"
            />
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddEndpoint}
              disabled={!newEndpoint.name || !newEndpoint.url || !newEndpoint.provider}
            >
              Add Endpoint
            </Button>
          </div>
        </div>
      )}

      {/* Endpoints List */}
      <div className="grid gap-4">
        {endpoints.map((endpoint) => (
          <div key={endpoint.id} className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-foreground">{endpoint.name}</h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(endpoint.status)}`}>
                    {endpoint.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{endpoint.url}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>Provider: {endpoint.provider}</span>
                  <span>Auth: {endpoint.authType}</span>
                  {endpoint.region && <span>Region: {endpoint.region}</span>}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestEndpoint(endpoint.id)}
                  disabled={testResults[endpoint.id]?.status === 'testing'}
                  iconName="Zap"
                  iconPosition="left"
                >
                  Test
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEndpoint(endpoint)}
                  iconName="Settings"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEndpointDelete(endpoint.id)}
                  iconName="Trash2"
                  className="text-error hover:text-error"
                />
              </div>
            </div>

            {/* Test Results */}
            {testResults[endpoint.id] && (
              <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-md">
                <Icon 
                  name={getTestStatusIcon(testResults[endpoint.id])} 
                  size={16} 
                  className={getTestStatusColor(testResults[endpoint.id])}
                />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{testResults[endpoint.id].message}</p>
                  {testResults[endpoint.id].latency && (
                    <p className="text-xs text-muted-foreground">
                      Latency: {testResults[endpoint.id].latency}ms • {testResults[endpoint.id].timestamp}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Health Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">{endpoint.uptime || '99.9%'}</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">{endpoint.avgLatency || '245ms'}</div>
                <div className="text-xs text-muted-foreground">Avg Latency</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">{endpoint.requestsToday || '1,247'}</div>
                <div className="text-xs text-muted-foreground">Requests Today</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-foreground">{endpoint.errorRate || '0.1%'}</div>
                <div className="text-xs text-muted-foreground">Error Rate</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {endpoints.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Globe" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No endpoints configured</h3>
          <p className="text-muted-foreground mb-4">Add your first API endpoint to get started</p>
          <Button
            onClick={() => setShowAddForm(true)}
            iconName="Plus"
            iconPosition="left"
          >
            Add Endpoint
          </Button>
        </div>
      )}
    </div>
  );
};

export default EndpointManager;