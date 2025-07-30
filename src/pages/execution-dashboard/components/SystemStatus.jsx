import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatus = () => {
  const [systemHealth, setSystemHealth] = useState({
    aiInfrastructure: 'healthy',
    monitoring: 'healthy',
    logging: 'warning',
    database: 'healthy',
    apiGateway: 'healthy'
  });

  const [metrics, setMetrics] = useState({
    activeConnections: 247,
    avgResponseTime: 1.2,
    errorRate: 0.03,
    throughput: 1847
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeConnections: prev.activeConnections + Math.floor(Math.random() * 10 - 5),
        avgResponseTime: Math.max(0.1, prev.avgResponseTime + (Math.random() - 0.5) * 0.2),
        errorRate: Math.max(0, Math.min(1, prev.errorRate + (Math.random() - 0.5) * 0.01)),
        throughput: prev.throughput + Math.floor(Math.random() * 100 - 50)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return { color: 'text-success', bg: 'bg-success/10', icon: 'CheckCircle' };
      case 'warning': return { color: 'text-warning', bg: 'bg-warning/10', icon: 'AlertTriangle' };
      case 'error': return { color: 'text-error', bg: 'bg-error/10', icon: 'XCircle' };
      default: return { color: 'text-muted-foreground', bg: 'bg-muted', icon: 'Circle' };
    }
  };

  const services = [
    { key: 'aiInfrastructure', label: 'AI Infrastructure', description: 'Model execution engines' },
    { key: 'monitoring', label: 'Monitoring', description: 'System health tracking' },
    { key: 'logging', label: 'Logging', description: 'Execution audit trails' },
    { key: 'database', label: 'Database', description: 'Session data storage' },
    { key: 'apiGateway', label: 'API Gateway', description: 'Request routing & auth' }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">
          System Status
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-success">Live</span>
        </div>
      </div>

      {/* Service Status */}
      <div className="space-y-3 mb-6">
        {services.map((service) => {
          const status = systemHealth[service.key];
          const statusConfig = getStatusColor(status);
          
          return (
            <div key={service.key} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${statusConfig.bg}`}>
                  <Icon name={statusConfig.icon} size={12} className={statusConfig.color} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{service.label}</p>
                  <p className="text-xs text-muted-foreground">{service.description}</p>
                </div>
              </div>
              <span className={`text-xs font-medium capitalize ${statusConfig.color}`}>
                {status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Key Metrics */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Key Metrics
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/30 rounded">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={14} className="text-primary" />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{metrics.activeConnections}</p>
          </div>
          
          <div className="p-3 bg-muted/30 rounded">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={14} className="text-primary" />
              <span className="text-xs text-muted-foreground">Avg Response</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{metrics.avgResponseTime.toFixed(1)}s</p>
          </div>
          
          <div className="p-3 bg-muted/30 rounded">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={14} className="text-warning" />
              <span className="text-xs text-muted-foreground">Error Rate</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{(metrics.errorRate * 100).toFixed(2)}%</p>
          </div>
          
          <div className="p-3 bg-muted/30 rounded">
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={14} className="text-success" />
              <span className="text-xs text-muted-foreground">Throughput</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{metrics.throughput}/h</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;