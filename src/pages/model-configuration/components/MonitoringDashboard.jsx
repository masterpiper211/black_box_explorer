import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MonitoringDashboard = ({ models, endpoints }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('requests');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const metricOptions = [
    { value: 'requests', label: 'Request Volume' },
    { value: 'latency', label: 'Response Latency' },
    { value: 'errors', label: 'Error Rate' },
    { value: 'tokens', label: 'Token Usage' },
    { value: 'cost', label: 'API Costs' }
  ];

  // Mock data for charts
  const performanceData = [
    { time: '00:00', requests: 120, latency: 245, errors: 2, tokens: 15420, cost: 12.45 },
    { time: '04:00', requests: 89, latency: 198, errors: 1, tokens: 11230, cost: 9.87 },
    { time: '08:00', requests: 245, latency: 312, errors: 5, tokens: 28940, cost: 23.12 },
    { time: '12:00', requests: 398, latency: 287, errors: 8, tokens: 45670, cost: 38.90 },
    { time: '16:00', requests: 456, latency: 234, errors: 3, tokens: 52340, cost: 44.67 },
    { time: '20:00', requests: 234, latency: 198, errors: 2, tokens: 29870, cost: 25.43 }
  ];

  const modelUsageData = [
    { name: 'GPT-4', value: 45, color: '#3B82F6' },
    { name: 'GPT-3.5', value: 30, color: '#10B981' },
    { name: 'Claude-3', value: 15, color: '#F59E0B' },
    { name: 'Gemini Pro', value: 10, color: '#EF4444' }
  ];

  const endpointHealthData = endpoints.map(endpoint => ({
    name: endpoint.name,
    uptime: parseFloat(endpoint.uptime?.replace('%', '') || '99.9'),
    latency: parseInt(endpoint.avgLatency?.replace('ms', '') || '245'),
    requests: parseInt(endpoint.requestsToday?.replace(',', '') || '1247'),
    errors: parseFloat(endpoint.errorRate?.replace('%', '') || '0.1')
  }));

  const alertsData = [
    {
      id: 1,
      type: 'warning',
      title: 'High Latency Detected',
      message: 'OpenAI GPT-4 endpoint showing increased response times (avg 450ms)',
      timestamp: '2 minutes ago',
      severity: 'medium'
    },
    {
      id: 2,
      type: 'error',
      title: 'Rate Limit Exceeded',
      message: 'Anthropic Claude endpoint hit rate limit (1000 req/min)',
      timestamp: '5 minutes ago',
      severity: 'high'
    },
    {
      id: 3,
      type: 'info',
      title: 'Model Updated',
      message: 'GPT-4 Turbo model configuration updated successfully',
      timestamp: '15 minutes ago',
      severity: 'low'
    }
  ];

  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        // Simulate data refresh
        console.log('Refreshing monitoring data...');
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [isAutoRefresh, refreshInterval]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return 'XCircle';
      case 'warning': return 'AlertTriangle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'error': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-error/10 text-error';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-accent/10 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-foreground">Performance Monitoring</h3>
          <p className="text-sm text-muted-foreground">Real-time monitoring and health metrics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={isAutoRefresh}
              onChange={(e) => setIsAutoRefresh(e.target.checked)}
              className="rounded border-border"
            />
            <label htmlFor="autoRefresh" className="text-sm text-foreground">Auto-refresh</label>
          </div>
          
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            className="w-32"
          />
          
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-semibold text-foreground">12,847</p>
              <p className="text-xs text-success">+12.5% from yesterday</p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <Icon name="BarChart3" size={24} className="text-accent" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Latency</p>
              <p className="text-2xl font-semibold text-foreground">245ms</p>
              <p className="text-xs text-success">-8.2% from yesterday</p>
            </div>
            <div className="p-3 bg-success/10 rounded-lg">
              <Icon name="Zap" size={24} className="text-success" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Error Rate</p>
              <p className="text-2xl font-semibold text-foreground">0.12%</p>
              <p className="text-xs text-error">+0.03% from yesterday</p>
            </div>
            <div className="p-3 bg-error/10 rounded-lg">
              <Icon name="AlertTriangle" size={24} className="text-error" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">API Costs</p>
              <p className="text-2xl font-semibold text-foreground">$234.56</p>
              <p className="text-xs text-warning">+15.7% from yesterday</p>
            </div>
            <div className="p-3 bg-warning/10 rounded-lg">
              <Icon name="DollarSign" size={24} className="text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Performance Trends</h4>
            <Select
              options={metricOptions}
              value={selectedMetric}
              onChange={setSelectedMetric}
              className="w-40"
            />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)', 
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke="var(--color-accent)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-accent)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Usage Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h4 className="font-medium text-foreground mb-4">Model Usage Distribution</h4>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {modelUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4">
            {modelUsageData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-foreground">{item.name}</span>
                <span className="text-sm text-muted-foreground">({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Endpoint Health */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="font-medium text-foreground mb-4">Endpoint Health Status</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-3 font-medium text-foreground">Endpoint</th>
                <th className="text-left p-3 font-medium text-foreground">Uptime</th>
                <th className="text-left p-3 font-medium text-foreground">Avg Latency</th>
                <th className="text-left p-3 font-medium text-foreground">Requests</th>
                <th className="text-left p-3 font-medium text-foreground">Error Rate</th>
                <th className="text-left p-3 font-medium text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {endpointHealthData.map((endpoint, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3 font-medium text-foreground">{endpoint.name}</td>
                  <td className="p-3">
                    <span className={`text-sm ${endpoint.uptime >= 99 ? 'text-success' : endpoint.uptime >= 95 ? 'text-warning' : 'text-error'}`}>
                      {endpoint.uptime}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-sm ${endpoint.latency <= 300 ? 'text-success' : endpoint.latency <= 500 ? 'text-warning' : 'text-error'}`}>
                      {endpoint.latency}ms
                    </span>
                  </td>
                  <td className="p-3 text-sm text-foreground">{endpoint.requests.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`text-sm ${endpoint.errors <= 1 ? 'text-success' : endpoint.errors <= 5 ? 'text-warning' : 'text-error'}`}>
                      {endpoint.errors}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      endpoint.uptime >= 99 && endpoint.latency <= 300 && endpoint.errors <= 1
                        ? 'text-success bg-success/10'
                        : endpoint.uptime >= 95 && endpoint.latency <= 500 && endpoint.errors <= 5
                        ? 'text-warning bg-warning/10' :'text-error bg-error/10'
                    }`}>
                      {endpoint.uptime >= 99 && endpoint.latency <= 300 && endpoint.errors <= 1 ? 'Healthy' :
                       endpoint.uptime >= 95 && endpoint.latency <= 500 && endpoint.errors <= 5 ? 'Warning' : 'Critical'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground">Recent Alerts</h4>
          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            iconPosition="left"
          >
            Configure Alerts
          </Button>
        </div>
        
        <div className="space-y-3">
          {alertsData.map((alert) => (
            <div key={alert.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
              <Icon 
                name={getAlertIcon(alert.type)} 
                size={20} 
                className={getAlertColor(alert.type)}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h5 className="font-medium text-foreground">{alert.title}</h5>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                className="text-muted-foreground hover:text-foreground"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;