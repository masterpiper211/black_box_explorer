import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AuditHeader = ({ 
  totalEvents, 
  filteredEvents, 
  onRefresh, 
  onExport, 
  onGenerateReport,
  refreshRate,
  onRefreshRateChange,
  connectionStatus 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const refreshRateOptions = [
    { value: 'manual', label: 'Manual Only' },
    { value: '5', label: 'Every 5 seconds' },
    { value: '10', label: 'Every 10 seconds' },
    { value: '30', label: 'Every 30 seconds' },
    { value: '60', label: 'Every minute' },
    { value: '300', label: 'Every 5 minutes' }
  ];

  const exportFormats = [
    { id: 'csv', label: 'CSV Export', icon: 'FileText', description: 'Comma-separated values for spreadsheet analysis' },
    { id: 'json', label: 'JSON Export', icon: 'Code', description: 'Structured data for programmatic processing' },
    { id: 'pdf', label: 'PDF Report', icon: 'FileText', description: 'Formatted report for documentation and sharing' }
  ];

  const handleExport = async (format) => {
    setIsExporting(true);
    setShowExportOptions(false);
    
    try {
      await onExport(format);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600 bg-green-50';
      case 'connecting': return 'text-yellow-600 bg-yellow-50';
      case 'disconnected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'Wifi';
      case 'connecting': return 'Loader';
      case 'disconnected': return 'WifiOff';
      default: return 'Wifi';
    }
  };

  return (
    <div className="bg-surface border-b border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center">
            <Icon name="FileText" size={28} className="mr-3" />
            Audit Trail Viewer
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive compliance and activity tracking interface
          </p>
        </div>

        {/* Connection Status */}
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${getConnectionStatusColor()}`}>
          <Icon 
            name={getConnectionStatusIcon()} 
            size={16} 
            className={connectionStatus === 'connecting' ? 'animate-spin' : ''} 
          />
          <span className="text-sm font-medium capitalize">{connectionStatus}</span>
        </div>
      </div>

      {/* Stats and Controls */}
      <div className="flex items-center justify-between">
        {/* Event Statistics */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Events:</span>
            <span className="font-semibold text-foreground">{totalEvents.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filtered:</span>
            <span className="font-semibold text-foreground">{filteredEvents.toLocaleString()}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Last Updated:</span>
            <span className="font-semibold text-foreground">
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Refresh Rate */}
          <div className="flex items-center space-x-2">
            <Icon name="RefreshCw" size={16} className="text-muted-foreground" />
            <Select
              options={refreshRateOptions}
              value={refreshRate}
              onChange={onRefreshRateChange}
              className="w-40"
            />
          </div>

          {/* Manual Refresh */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={connectionStatus === 'disconnected'}
          >
            <Icon name="RefreshCw" size={14} className="mr-1" />
            Refresh
          </Button>

          {/* Export Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportOptions(!showExportOptions)}
              disabled={isExporting || filteredEvents === 0}
            >
              {isExporting ? (
                <>
                  <Icon name="Loader" size={14} className="mr-1 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Icon name="Download" size={14} className="mr-1" />
                  Export
                  <Icon name="ChevronDown" size={12} className="ml-1" />
                </>
              )}
            </Button>

            {showExportOptions && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-modal z-50">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-border mb-2">
                    <h3 className="font-medium text-foreground">Export Options</h3>
                    <p className="text-xs text-muted-foreground">
                      Export {filteredEvents.toLocaleString()} filtered events
                    </p>
                  </div>
                  
                  {exportFormats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => handleExport(format.id)}
                      className="w-full flex items-start space-x-3 px-3 py-3 text-left hover:bg-muted rounded-md transition-colors"
                    >
                      <Icon name={format.icon} size={16} className="text-muted-foreground mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{format.label}</p>
                        <p className="text-xs text-muted-foreground">{format.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Generate Report */}
          <Button
            variant="default"
            size="sm"
            onClick={onGenerateReport}
          >
            <Icon name="FileText" size={14} className="mr-1" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-border">
        <span className="text-sm font-medium text-muted-foreground">Quick Filters:</span>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => console.log('Filter: Today')}
        >
          <Icon name="Calendar" size={12} className="mr-1" />
          Today
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => console.log('Filter: Errors')}
        >
          <Icon name="AlertCircle" size={12} className="mr-1" />
          Errors Only
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => console.log('Filter: Security')}
        >
          <Icon name="Shield" size={12} className="mr-1" />
          Security Events
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => console.log('Filter: High Severity')}
        >
          <Icon name="AlertTriangle" size={12} className="mr-1" />
          High Severity
        </Button>

        <div className="flex-1"></div>

        {/* Real-time Indicator */}
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Real-time monitoring active</span>
        </div>
      </div>
    </div>
  );
};

export default AuditHeader;