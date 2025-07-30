import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsPanel = ({ isCollapsed, onToggleCollapse }) => {
  const [alerts] = useState([
    {
      id: 1,
      type: 'error',
      title: 'High Latency Detected',
      message: 'GPT-4 model showing average response time of 4.2s (threshold: 3s)',
      timestamp: '2 min ago',
      severity: 'high',
      acknowledged: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Cost Threshold Exceeded',
      message: 'Daily API costs have exceeded $500 budget limit',
      timestamp: '15 min ago',
      severity: 'medium',
      acknowledged: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Performance Improved',
      message: 'Claude-3 model latency reduced by 23% after optimization',
      timestamp: '1 hour ago',
      severity: 'low',
      acknowledged: true
    },
    {
      id: 4,
      type: 'warning',
      title: 'Memory Usage Alert',
      message: 'Session #1247 using 85% of allocated memory',
      timestamp: '2 hours ago',
      severity: 'medium',
      acknowledged: false
    }
  ]);

  const [kpis] = useState([
    {
      label: 'Avg Response Time',
      value: '1.2s',
      target: '< 2s',
      status: 'good',
      trend: 'down'
    },
    {
      label: 'Success Rate',
      value: '99.7%',
      target: '> 99%',
      status: 'excellent',
      trend: 'up'
    },
    {
      label: 'Daily Cost',
      value: '$523',
      target: '< $500',
      status: 'warning',
      trend: 'up'
    },
    {
      label: 'Active Sessions',
      value: '47',
      target: '< 100',
      status: 'good',
      trend: 'stable'
    }
  ]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return 'AlertCircle';
      case 'warning': return 'AlertTriangle';
      case 'success': return 'CheckCircle';
      default: return 'Info';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'error': return 'text-error bg-error/10 border-error/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'success': return 'text-success bg-success/10 border-success/20';
      default: return 'text-accent bg-accent/10 border-accent/20';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-error text-error-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getKpiStatus = (status) => {
    switch (status) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-accent';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      case 'stable': return 'Minus';
      default: return 'Minus';
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-card border-l border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <Icon name="ChevronLeft" size={20} />
        </Button>
        <div className="flex flex-col space-y-2">
          <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center relative">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full animate-pulse"></div>
          </div>
          <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={16} className="text-success" />
          </div>
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={16} className="text-accent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-l border-border overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Alerts & KPIs</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
          >
            <Icon name="ChevronRight" size={20} />
          </Button>
        </div>
      </div>

      {/* KPIs Section */}
      <div className="p-6 border-b border-border">
        <h3 className="text-sm font-medium text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={16} className="mr-2" />
          Key Performance Indicators
        </h3>
        <div className="space-y-4">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
                <Icon 
                  name={getTrendIcon(kpi.trend)} 
                  size={12} 
                  className={getKpiStatus(kpi.status)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-lg font-bold ${getKpiStatus(kpi.status)}`}>
                  {kpi.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  Target: {kpi.target}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground flex items-center">
            <Icon name="AlertCircle" size={16} className="mr-2" />
            Recent Alerts
          </h3>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 transition-all duration-fast ${
                alert.acknowledged ? 'opacity-60' : ''
              } ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start space-x-3">
                <Icon name={getAlertIcon(alert.type)} size={16} className="mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {alert.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp}
                    </span>
                    {!alert.acknowledged && (
                      <Button variant="ghost" size="sm" className="text-xs">
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alert Actions */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Icon name="Settings" size={14} className="mr-1" />
              Configure
            </Button>
            <Button variant="ghost" size="sm" className="flex-1">
              <Icon name="History" size={14} className="mr-1" />
              History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;