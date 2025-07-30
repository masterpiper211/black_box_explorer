import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventDetailsPanel = ({ selectedEvent, onClose, onRelatedEvents }) => {
  const [activeTab, setActiveTab] = useState('details');

  if (!selectedEvent) {
    return (
      <div className="w-full h-full bg-surface border-l border-border flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Event Selected</h3>
          <p className="text-sm">Select an audit event from the log to view detailed information</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'Details', icon: 'Info' },
    { id: 'context', label: 'Context', icon: 'Layers' },
    { id: 'related', label: 'Related', icon: 'Link' },
    { id: 'raw', label: 'Raw Data', icon: 'Code' }
  ];

  const relatedEvents = [
    {
      id: 'rel-1',
      timestamp: new Date(Date.now() - 300000),
      action: 'session_create',
      user: selectedEvent.user,
      outcome: 'success',
      relation: 'Previous Action'
    },
    {
      id: 'rel-2',
      timestamp: new Date(Date.now() + 120000),
      action: 'data_export',
      user: selectedEvent.user,
      outcome: 'success',
      relation: 'Subsequent Action'
    },
    {
      id: 'rel-3',
      timestamp: new Date(Date.now() - 60000),
      action: 'permission_check',
      user: 'system',
      outcome: 'success',
      relation: 'System Validation'
    }
  ];

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'info': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'failure': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const renderDetailsTab = () => (
    <div className="space-y-6">
      {/* Event Summary */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center">
          <Icon name="Activity" size={18} className="mr-2" />
          Event Summary
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Event ID:</span>
            <p className="font-mono text-foreground mt-1">{selectedEvent.id}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Timestamp:</span>
            <p className="text-foreground mt-1">{formatTimestamp(selectedEvent.timestamp)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">User:</span>
            <p className="text-foreground mt-1 flex items-center">
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-2">
                <Icon name="User" size={10} color="white" />
              </div>
              {selectedEvent.user}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Action:</span>
            <p className="text-foreground mt-1">{selectedEvent.action.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Status Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-muted-foreground text-sm">Outcome</span>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-1 ${getOutcomeColor(selectedEvent.outcome)}`}>
              <Icon 
                name={selectedEvent.outcome === 'success' ? 'CheckCircle' : selectedEvent.outcome === 'failure' ? 'XCircle' : 'AlertTriangle'} 
                size={14} 
                className="mr-1" 
              />
              {selectedEvent.outcome}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground text-sm">Severity</span>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-1 ${getSeverityColor(selectedEvent.severity)}`}>
              {selectedEvent.severity}
            </div>
          </div>
        </div>
      </div>

      {/* Resource Information */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Resource Information</h4>
        <div className="bg-surface border border-border rounded-lg p-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Resource:</span>
            <p className="text-foreground mt-1 font-mono">{selectedEvent.resource}</p>
          </div>
          {selectedEvent.resourceType && (
            <div className="text-sm mt-3">
              <span className="text-muted-foreground">Type:</span>
              <p className="text-foreground mt-1">{selectedEvent.resourceType}</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h4 className="font-medium text-foreground mb-3">Performance Metrics</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-surface border border-border rounded-lg p-3 text-center">
            <Icon name="Clock" size={16} className="mx-auto mb-1 text-muted-foreground" />
            <p className="text-muted-foreground">Duration</p>
            <p className="font-semibold text-foreground">{selectedEvent.duration}ms</p>
          </div>
          <div className="bg-surface border border-border rounded-lg p-3 text-center">
            <Icon name="Database" size={16} className="mx-auto mb-1 text-muted-foreground" />
            <p className="text-muted-foreground">Data Size</p>
            <p className="font-semibold text-foreground">{selectedEvent.dataSize}</p>
          </div>
          <div className="bg-surface border border-border rounded-lg p-3 text-center">
            <Icon name="Cpu" size={16} className="mx-auto mb-1 text-muted-foreground" />
            <p className="text-muted-foreground">CPU Usage</p>
            <p className="font-semibold text-foreground">12%</p>
          </div>
        </div>
      </div>

      {/* Error Information */}
      {selectedEvent.errorMessage && (
        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center">
            <Icon name="AlertCircle" size={16} className="mr-2 text-red-600" />
            Error Information
          </h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm font-mono">{selectedEvent.errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderContextTab = () => (
    <div className="space-y-6">
      {/* Network Information */}
      <div>
        <h4 className="font-medium text-foreground mb-3 flex items-center">
          <Icon name="Globe" size={16} className="mr-2" />
          Network Information
        </h4>
        <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
          <div className="text-sm">
            <span className="text-muted-foreground">IP Address:</span>
            <p className="text-foreground mt-1 font-mono">{selectedEvent.ipAddress}</p>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">User Agent:</span>
            <p className="text-foreground mt-1 text-xs break-all">{selectedEvent.userAgent}</p>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Location:</span>
            <p className="text-foreground mt-1">San Francisco, CA, US</p>
          </div>
        </div>
      </div>

      {/* Session Information */}
      <div>
        <h4 className="font-medium text-foreground mb-3 flex items-center">
          <Icon name="Monitor" size={16} className="mr-2" />
          Session Information
        </h4>
        <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Session ID:</span>
            <p className="text-foreground mt-1 font-mono">{selectedEvent.sessionId}</p>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Request ID:</span>
            <p className="text-foreground mt-1 font-mono">{selectedEvent.requestId}</p>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Session Duration:</span>
            <p className="text-foreground mt-1">2h 34m</p>
          </div>
        </div>
      </div>

      {/* Compliance Information */}
      <div>
        <h4 className="font-medium text-foreground mb-3 flex items-center">
          <Icon name="Shield" size={16} className="mr-2" />
          Compliance Information
        </h4>
        <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Category:</span>
            <p className="text-foreground mt-1">{selectedEvent.category}</p>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Retention Period:</span>
            <p className="text-foreground mt-1">7 years</p>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Compliance Tags:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">SOX</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">GDPR</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">HIPAA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRelatedTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">Related Events</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRelatedEvents(selectedEvent.id)}
        >
          <Icon name="Search" size={14} className="mr-1" />
          Find More
        </Button>
      </div>
      
      <div className="space-y-3">
        {relatedEvents.map((event) => (
          <div key={event.id} className="bg-surface border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={event.outcome === 'success' ? 'CheckCircle' : event.outcome === 'failure' ? 'XCircle' : 'AlertTriangle'} 
                  size={14} 
                  className={event.outcome === 'success' ? 'text-green-600' : event.outcome === 'failure' ? 'text-red-600' : 'text-yellow-600'} 
                />
                <span className="text-sm font-medium text-foreground">{event.action.replace('_', ' ')}</span>
              </div>
              <span className="text-xs text-muted-foreground">{event.relation}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <span>{event.user}</span> • <span>{formatTimestamp(event.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRawTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-foreground">Raw Event Data</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigator.clipboard.writeText(JSON.stringify(selectedEvent, null, 2))}
        >
          <Icon name="Copy" size={14} className="mr-1" />
          Copy
        </Button>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-4 overflow-auto">
        <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
          {JSON.stringify(selectedEvent, null, 2)}
        </pre>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-surface border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Event Details</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1 mt-4 bg-muted rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-surface text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'details' && renderDetailsTab()}
        {activeTab === 'context' && renderContextTab()}
        {activeTab === 'related' && renderRelatedTab()}
        {activeTab === 'raw' && renderRawTab()}
      </div>

      {/* Actions */}
      <div className="border-t border-border p-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => console.log('Export event:', selectedEvent.id)}
          >
            <Icon name="Download" size={14} className="mr-1" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => console.log('Flag event:', selectedEvent.id)}
          >
            <Icon name="Flag" size={14} className="mr-1" />
            Flag
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPanel;