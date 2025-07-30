import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionSummary = ({ selectedSession, onClose }) => {
  if (!selectedSession) {
    return (
      <div className="w-full h-full bg-surface border-l border-border flex items-center justify-center">
        <div className="text-center">
          <Icon name="MousePointer" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select a Session</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Click on any execution session from the grid to view detailed information and quick actions.
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-warning';
      case 'completed': return 'text-success';
      case 'failed': return 'text-error';
      case 'queued': return 'text-muted-foreground';
      case 'cancelled': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const StatCard = ({ icon, label, value, subValue, color = "text-foreground" }) => (
    <div className="p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name={icon} size={20} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className={`text-lg font-semibold ${color}`}>{value}</p>
          {subValue && (
            <p className="text-xs text-muted-foreground">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-surface border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Session Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm text-foreground">{selectedSession.sessionId}</span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              selectedSession.status === 'running' ? 'bg-warning/10 text-warning' :
              selectedSession.status === 'completed' ? 'bg-success/10 text-success' :
              selectedSession.status === 'failed'? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'
            }`}>
              {selectedSession.status.charAt(0).toUpperCase() + selectedSession.status.slice(1)}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Started {new Date(selectedSession.startTime).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Key Statistics */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">Key Statistics</h3>
          <div className="grid grid-cols-1 gap-4">
            <StatCard
              icon="Clock"
              label="Duration"
              value={selectedSession.status === 'running' ? 'Running...' : formatDuration(selectedSession.duration)}
              subValue={selectedSession.status === 'running' ? `Started ${selectedSession.relativeTime}` : `Completed ${selectedSession.relativeTime}`}
              color={selectedSession.status === 'running' ? 'text-warning' : 'text-foreground'}
            />
            
            <StatCard
              icon="Zap"
              label="Tokens Processed"
              value={selectedSession.tokens.toLocaleString()}
              subValue={selectedSession.tokensPerSecond ? `${selectedSession.tokensPerSecond}/sec average` : undefined}
            />
            
            <StatCard
              icon="DollarSign"
              label="Cost"
              value={`$${selectedSession.cost.toFixed(3)}`}
              subValue={`$${(selectedSession.cost / selectedSession.tokens * 1000).toFixed(4)}/1K tokens`}
            />
            
            <StatCard
              icon="TrendingUp"
              label="Performance"
              value={`${selectedSession.performance}%`}
              subValue="Overall efficiency score"
              color={
                selectedSession.performance >= 90 ? 'text-success' :
                selectedSession.performance >= 70 ? 'text-warning' : 'text-error'
              }
            />
          </div>
        </div>

        {/* Model Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">Model Information</h3>
          <div className="p-4 bg-muted/30 rounded-lg space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                <Icon name="Bot" size={16} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedSession.model}</p>
                <p className="text-xs text-muted-foreground">Large Language Model</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Temperature</p>
                <p className="font-medium text-foreground">{selectedSession.temperature || '0.7'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Max Tokens</p>
                <p className="font-medium text-foreground">{selectedSession.maxTokens || '2048'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">User Information</h3>
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">{selectedSession.user}</p>
                <p className="text-xs text-muted-foreground">ML Engineer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Information */}
        {selectedSession.hasErrors && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">Issues</h3>
            <div className="p-4 bg-error/5 border border-error/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-error">Performance Warning</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Token generation rate below expected threshold. Consider model optimization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">Recent Activity</h3>
          <div className="space-y-2">
            {[
              { time: '2 min ago', action: 'Token generation completed', icon: 'CheckCircle', color: 'text-success' },
              { time: '5 min ago', action: 'Processing prompt chain', icon: 'Play', color: 'text-warning' },
              { time: '8 min ago', action: 'Session initialized', icon: 'PlayCircle', color: 'text-primary' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 hover:bg-muted/30 rounded">
                <Icon name={activity.icon} size={14} className={activity.color} />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wide mb-3">Quick Actions</h3>
        
        <Button variant="outline" fullWidth className="justify-start">
          <Icon name="Eye" size={16} className="mr-2" />
          View Live Visualizer
        </Button>
        
        <Button variant="outline" fullWidth className="justify-start">
          <Icon name="Download" size={16} className="mr-2" />
          Export Session Data
        </Button>
        
        <Button variant="outline" fullWidth className="justify-start">
          <Icon name="Copy" size={16} className="mr-2" />
          Clone Configuration
        </Button>
        
        {selectedSession.status === 'running' && (
          <Button variant="destructive" fullWidth className="justify-start">
            <Icon name="StopCircle" size={16} className="mr-2" />
            Terminate Session
          </Button>
        )}
      </div>
    </div>
  );
};

export default SessionSummary;