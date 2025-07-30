import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExecutionGrid = ({ 
  executions, 
  selectedSessions, 
  onSessionSelect, 
  onSessionClick, 
  filters,
  sortConfig,
  onSort 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return { icon: 'Play', color: 'text-warning', bg: 'bg-warning/10' };
      case 'completed': return { icon: 'CheckCircle', color: 'text-success', bg: 'bg-success/10' };
      case 'failed': return { icon: 'XCircle', color: 'text-error', bg: 'bg-error/10' };
      case 'queued': return { icon: 'Clock', color: 'text-muted-foreground', bg: 'bg-muted' };
      case 'cancelled': return { icon: 'StopCircle', color: 'text-muted-foreground', bg: 'bg-muted' };
      default: return { icon: 'Circle', color: 'text-muted-foreground', bg: 'bg-muted' };
    }
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const formatTokenCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = executions.map(exec => exec.id);
      onSessionSelect(allIds);
    } else {
      onSessionSelect([]);
    }
  };

  const isAllSelected = executions.length > 0 && selectedSessions.length === executions.length;
  const isPartiallySelected = selectedSessions.length > 0 && selectedSessions.length < executions.length;

  const columns = [
    { key: 'sessionId', label: 'Session ID', width: 'w-32', sortable: true },
    { key: 'model', label: 'Model', width: 'w-36', sortable: true },
    { key: 'user', label: 'User', width: 'w-32', sortable: true },
    { key: 'startTime', label: 'Start Time', width: 'w-40', sortable: true },
    { key: 'duration', label: 'Duration', width: 'w-24', sortable: true },
    { key: 'status', label: 'Status', width: 'w-28', sortable: true },
    { key: 'tokens', label: 'Tokens', width: 'w-24', sortable: true },
    { key: 'cost', label: 'Cost', width: 'w-24', sortable: true },
    { key: 'performance', label: 'Performance', width: 'w-32', sortable: false },
    { key: 'actions', label: 'Actions', width: 'w-24', sortable: false }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-foreground">
              Execution Sessions
            </h2>
            <span className="text-sm text-muted-foreground">
              {executions.length} sessions
            </span>
          </div>
          
          {selectedSessions.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedSessions.length} selected
              </span>
              <Button variant="outline" size="sm">
                <Icon name="Download" size={16} className="mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Icon name="Archive" size={16} className="mr-2" />
                Archive
              </Button>
              <Button variant="destructive" size="sm">
                <Icon name="StopCircle" size={16} className="mr-2" />
                Terminate
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-3 text-left">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isPartiallySelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              {columns.map((column) => (
                <th key={column.key} className={`${column.width} p-3 text-left`}>
                  {column.sortable ? (
                    <button
                      onClick={() => onSort(column.key)}
                      className="flex items-center space-x-1 hover:text-foreground transition-colors group"
                    >
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                        {column.label}
                      </span>
                      <Icon 
                        name={getSortIcon(column.key)} 
                        size={14} 
                        className="text-muted-foreground group-hover:text-foreground"
                      />
                    </button>
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">
                      {column.label}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {executions.map((execution) => {
              const statusConfig = getStatusIcon(execution.status);
              const isSelected = selectedSessions.includes(execution.id);
              const isHovered = hoveredRow === execution.id;
              
              return (
                <tr
                  key={execution.id}
                  className={`border-b border-border hover:bg-muted/30 transition-colors cursor-pointer ${
                    isSelected ? 'bg-primary/5' : ''
                  }`}
                  onMouseEnter={() => setHoveredRow(execution.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => onSessionClick(execution)}
                >
                  <td className="p-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation();
                        const newSelected = e.target.checked
                          ? [...selectedSessions, execution.id]
                          : selectedSessions.filter(id => id !== execution.id);
                        onSessionSelect(newSelected);
                      }}
                    />
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm text-foreground">
                        {execution.sessionId}
                      </span>
                      {execution.status === 'running' && (
                        <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                        <Icon name="Bot" size={12} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {execution.model}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                        <Icon name="User" size={12} className="text-muted-foreground" />
                      </div>
                      <span className="text-sm text-foreground">{execution.user}</span>
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="text-sm text-foreground">
                      {new Date(execution.startTime).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {execution.relativeTime}
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <span className="text-sm font-mono text-foreground">
                      {execution.status === 'running' ? (
                        <span className="text-warning">Running...</span>
                      ) : (
                        formatDuration(execution.duration)
                      )}
                    </span>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${statusConfig.bg}`}>
                        <Icon name={statusConfig.icon} size={12} className={statusConfig.color} />
                      </div>
                      <span className={`text-sm font-medium ${statusConfig.color}`}>
                        {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="text-sm font-mono text-foreground">
                      {formatTokenCount(execution.tokens)}
                    </div>
                    {execution.tokensPerSecond && (
                      <div className="text-xs text-muted-foreground">
                        {execution.tokensPerSecond}/s
                      </div>
                    )}
                  </td>
                  
                  <td className="p-3">
                    <span className="text-sm font-mono text-foreground">
                      ${execution.cost.toFixed(3)}
                    </span>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            execution.performance >= 90 ? 'bg-success' :
                            execution.performance >= 70 ? 'bg-warning' : 'bg-error'
                          }`}
                          style={{ width: `${execution.performance}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {execution.performance}%
                      </span>
                    </div>
                  </td>
                  
                  <td className="p-3">
                    <div className="flex items-center space-x-1">
                      {execution.hasErrors && (
                        <Icon name="AlertTriangle" size={16} className="text-warning" />
                      )}
                      {isHovered && (
                        <Button variant="ghost" size="icon" className="w-6 h-6">
                          <Icon name="ExternalLink" size={12} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing 1-{executions.length} of {executions.length} sessions
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <Icon name="ChevronLeft" size={16} />
            </Button>
            <span className="text-sm text-foreground px-3 py-1 bg-primary text-primary-foreground rounded">
              1
            </span>
            <Button variant="outline" size="sm" disabled>
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionGrid;