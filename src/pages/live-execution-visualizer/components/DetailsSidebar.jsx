import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DetailsSidebar = ({ selectedNode, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!selectedNode) {
    return (
      <div className="w-80 h-full bg-white border-l border-gray-200 flex flex-col items-center justify-center text-gray-500">
        <Icon name="MousePointer" size={48} className="mb-4 opacity-50" />
        <p className="text-sm text-center px-4">
          Select a node from the canvas to view detailed information
        </p>
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-white border-l border-gray-200 flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="mb-4"
        >
          <Icon name="ChevronLeft" size={20} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'content', label: 'Content', icon: 'FileText' },
    { id: 'metrics', label: 'Metrics', icon: 'BarChart3' },
    { id: 'logs', label: 'Logs', icon: 'Terminal' }
  ];

  const getNodeTypeIcon = (type) => {
    const icons = {
      prompt: 'MessageSquare',
      model: 'Brain',
      tool: 'Wrench',
      memory: 'Database',
      output: 'Send',
      error: 'AlertTriangle'
    };
    return icons[type] || 'Circle';
  };

  const getNodeTypeColor = (type) => {
    const colors = {
      prompt: 'text-blue-600 bg-blue-100',
      model: 'text-green-600 bg-green-100',
      tool: 'text-orange-600 bg-orange-100',
      memory: 'text-purple-600 bg-purple-100',
      output: 'text-gray-600 bg-gray-100',
      error: 'text-red-600 bg-red-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  const mockLogs = [
    { timestamp: '08:56:45.123', level: 'INFO', message: 'Node execution started' },
    { timestamp: '08:56:45.145', level: 'DEBUG', message: 'Input validation completed' },
    { timestamp: '08:56:45.167', level: 'INFO', message: 'Processing request with GPT-4' },
    { timestamp: '08:56:46.234', level: 'DEBUG', message: 'Token generation in progress' },
    { timestamp: '08:56:46.890', level: 'INFO', message: 'Response generated successfully' },
    { timestamp: '08:56:46.912', level: 'DEBUG', message: 'Confidence score calculated: 0.89' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            {/* Node Header */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${getNodeTypeColor(selectedNode.type)}`}>
                <Icon name={getNodeTypeIcon(selectedNode.type)} size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedNode.title}</h3>
                <p className="text-sm text-gray-600 capitalize">{selectedNode.type} Node</p>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">Status</h4>
              <div className="flex items-center space-x-2">
                <Icon
                  name={
                    selectedNode.status === 'completed' ? 'CheckCircle' :
                    selectedNode.status === 'processing' ? 'Loader' :
                    selectedNode.status === 'error' ? 'XCircle' : 'Clock'
                  }
                  size={16}
                  className={
                    selectedNode.status === 'completed' ? 'text-green-600' :
                    selectedNode.status === 'processing' ? 'text-blue-600' :
                    selectedNode.status === 'error' ? 'text-red-600' : 'text-gray-400'
                  }
                />
                <span className="text-sm capitalize font-medium">
                  {selectedNode.status}
                </span>
              </div>
            </div>

            {/* Timestamp */}
            {selectedNode.timestamp && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900">Execution Time</h4>
                <p className="text-sm text-gray-600">
                  {selectedNode.timestamp.toLocaleString()}
                </p>
              </div>
            )}

            {/* Quick Metrics */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">Quick Metrics</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Latency</p>
                  <p className="text-sm font-semibold">{selectedNode.metrics.latency}ms</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600">Tokens</p>
                  <p className="text-sm font-semibold">{selectedNode.metrics.tokens}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded col-span-2">
                  <p className="text-xs text-gray-600">Confidence</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${selectedNode.metrics.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">
                      {(selectedNode.metrics.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connections */}
            {selectedNode.connections && selectedNode.connections.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900">Connections</h4>
                <div className="space-y-1">
                  {selectedNode.connections.map((connId, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <Icon name="ArrowRight" size={14} />
                      <span>{connId}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'content':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">Node Content</h4>
              <div className="p-3 bg-gray-50 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {selectedNode.content}
                </pre>
              </div>
            </div>

            {/* Content Analysis */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">Content Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Character Count:</span>
                  <span className="font-medium">{selectedNode.content.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Word Count:</span>
                  <span className="font-medium">
                    {selectedNode.content.split(/\s+/).filter(word => word.length > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Line Count:</span>
                  <span className="font-medium">
                    {selectedNode.content.split('\n').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Copy Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(selectedNode.content)}
              className="w-full"
            >
              <Icon name="Copy" size={16} className="mr-2" />
              Copy Content
            </Button>
          </div>
        );

      case 'metrics':
        return (
          <div className="space-y-4">
            {/* Performance Metrics */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Performance Metrics</h4>
              
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Execution Latency</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedNode.metrics.latency}ms
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        selectedNode.metrics.latency < 500 ? 'bg-green-500' :
                        selectedNode.metrics.latency < 1000 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (selectedNode.metrics.latency / 2000) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Token Count</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedNode.metrics.tokens}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (selectedNode.metrics.tokens / 200) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Confidence Score</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {(selectedNode.metrics.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${selectedNode.metrics.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900">Additional Metrics</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-gray-600">Memory Usage</p>
                  <p className="font-semibold">2.4 MB</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-gray-600">CPU Time</p>
                  <p className="font-semibold">145ms</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-gray-600">Network I/O</p>
                  <p className="font-semibold">1.2 KB</p>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <p className="text-gray-600">Cache Hits</p>
                  <p className="font-semibold">3/5</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'logs':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">Execution Logs</h4>
              <Button variant="ghost" size="sm">
                <Icon name="Download" size={14} className="mr-1" />
                Export
              </Button>
            </div>
            
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {mockLogs.map((log, index) => (
                <div
                  key={index}
                  className="p-2 text-xs font-mono bg-gray-50 rounded border-l-2 border-gray-300"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-gray-500">{log.timestamp}</span>
                    <span className={`px-1 rounded text-xs font-semibold ${
                      log.level === 'ERROR' ? 'bg-red-100 text-red-800' :
                      log.level === 'WARN' ? 'bg-yellow-100 text-yellow-800' :
                      log.level === 'INFO'? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {log.level}
                    </span>
                  </div>
                  <p className="text-gray-700">{log.message}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-80 h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Node Details</h2>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(true)}
            >
              <Icon name="ChevronRight" size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon name={tab.icon} size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DetailsSidebar;