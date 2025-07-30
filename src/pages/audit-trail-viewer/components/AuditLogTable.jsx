import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AuditLogTable = ({ auditLogs, onEventSelect, selectedEvent, onBulkAction }) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [expandedRows, setExpandedRows] = useState(new Set());

  const sortedLogs = useMemo(() => {
    const sortableItems = [...auditLogs];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [auditLogs, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRowSelect = (eventId) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(eventId)) {
      newSelected.delete(eventId);
    } else {
      newSelected.add(eventId);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === auditLogs.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(auditLogs.map(log => log.id)));
    }
  };

  const toggleRowExpansion = (eventId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedRows(newExpanded);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      case 'info': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case 'success': return <Icon name="CheckCircle" size={16} className="text-green-600" />;
      case 'failure': return <Icon name="XCircle" size={16} className="text-red-600" />;
      case 'warning': return <Icon name="AlertTriangle" size={16} className="text-yellow-600" />;
      default: return <Icon name="Info" size={16} className="text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Bulk Actions Bar */}
      {selectedRows.size > 0 && (
        <div className="bg-accent/10 border-b border-border p-3 flex items-center justify-between">
          <span className="text-sm text-foreground">
            {selectedRows.size} event{selectedRows.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('export', Array.from(selectedRows))}
            >
              <Icon name="Download" size={14} className="mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction('tag', Array.from(selectedRows))}
            >
              <Icon name="Tag" size={14} className="mr-1" />
              Tag
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRows(new Set())}
            >
              <Icon name="X" size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="bg-muted border-b border-border">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              checked={selectedRows.size === auditLogs.length && auditLogs.length > 0}
              onChange={handleSelectAll}
              className="rounded border-border"
            />
          </div>
          <div className="col-span-2">
            <button
              onClick={() => handleSort('timestamp')}
              className="flex items-center hover:text-foreground transition-colors"
            >
              Timestamp
              <Icon 
                name={sortConfig.key === 'timestamp' && sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                size={12} 
                className="ml-1" 
              />
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => handleSort('user')}
              className="flex items-center hover:text-foreground transition-colors"
            >
              User
              <Icon 
                name={sortConfig.key === 'user' && sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                size={12} 
                className="ml-1" 
              />
            </button>
          </div>
          <div className="col-span-2">Action</div>
          <div className="col-span-2">Resource</div>
          <div className="col-span-1">Outcome</div>
          <div className="col-span-1">Severity</div>
          <div className="col-span-1">Details</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto">
        {sortedLogs.map((log) => (
          <React.Fragment key={log.id}>
            <div
              className={`grid grid-cols-12 gap-4 px-4 py-3 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors ${
                selectedEvent?.id === log.id ? 'bg-accent/10' : ''
              }`}
              onClick={() => onEventSelect(log)}
            >
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedRows.has(log.id)}
                  onChange={() => handleRowSelect(log.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded border-border"
                />
              </div>
              <div className="col-span-2 text-sm text-foreground">
                {formatTimestamp(log.timestamp)}
              </div>
              <div className="col-span-2 text-sm">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-2">
                    <Icon name="User" size={12} color="white" />
                  </div>
                  <span className="text-foreground">{log.user}</span>
                </div>
              </div>
              <div className="col-span-2 text-sm">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary">
                  {log.action.replace('_', ' ')}
                </span>
              </div>
              <div className="col-span-2 text-sm text-muted-foreground truncate">
                {log.resource}
              </div>
              <div className="col-span-1 flex items-center">
                {getOutcomeIcon(log.outcome)}
              </div>
              <div className="col-span-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                  {log.severity}
                </span>
              </div>
              <div className="col-span-1 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRowExpansion(log.id);
                  }}
                  className="h-6 w-6"
                >
                  <Icon 
                    name={expandedRows.has(log.id) ? "ChevronUp" : "ChevronDown"} 
                    size={14} 
                  />
                </Button>
              </div>
            </div>

            {/* Expanded Row Details */}
            {expandedRows.has(log.id) && (
              <div className="bg-muted/30 border-b border-border px-4 py-3">
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Event Details</h4>
                    <div className="space-y-1">
                      <div><span className="text-muted-foreground">IP Address:</span> {log.ipAddress}</div>
                      <div><span className="text-muted-foreground">User Agent:</span> {log.userAgent}</div>
                      <div><span className="text-muted-foreground">Session ID:</span> {log.sessionId}</div>
                      <div><span className="text-muted-foreground">Request ID:</span> {log.requestId}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Additional Context</h4>
                    <div className="space-y-1">
                      <div><span className="text-muted-foreground">Category:</span> {log.category}</div>
                      <div><span className="text-muted-foreground">Duration:</span> {log.duration}ms</div>
                      <div><span className="text-muted-foreground">Data Size:</span> {log.dataSize}</div>
                      {log.errorMessage && (
                        <div><span className="text-muted-foreground">Error:</span> <span className="text-red-600">{log.errorMessage}</span></div>
                      )}
                    </div>
                  </div>
                </div>
                {log.description && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <h4 className="font-medium text-foreground mb-1">Description</h4>
                    <p className="text-muted-foreground text-sm">{log.description}</p>
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Table Footer */}
      <div className="bg-muted border-t border-border px-4 py-3 flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {sortedLogs.length} of {auditLogs.length} events
        </div>
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <select className="border border-border rounded px-2 py-1 bg-surface text-foreground">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AuditLogTable;