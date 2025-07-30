import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MetricCard from './components/MetricCard';
import FilterPanel from './components/FilterPanel';
import PerformanceChart from './components/PerformanceChart';
import AlertsPanel from './components/AlertsPanel';
import ComparisonModal from './components/ComparisonModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PerformanceAnalytics = () => {
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [isAlertsCollapsed, setIsAlertsCollapsed] = useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data for metrics
  const [metricsData] = useState([
    {
      title: 'Average Response Time',
      value: '1.24s',
      change: '+12%',
      changeType: 'negative',
      icon: 'Clock',
      color: 'primary'
    },
    {
      title: 'Total API Calls',
      value: '847K',
      change: '+23%',
      changeType: 'positive',
      icon: 'Activity',
      color: 'success'
    },
    {
      title: 'Error Rate',
      value: '0.3%',
      change: '-45%',
      changeType: 'positive',
      icon: 'AlertTriangle',
      color: 'error'
    },
    {
      title: 'Daily Cost',
      value: '$523.40',
      change: '+8%',
      changeType: 'negative',
      icon: 'DollarSign',
      color: 'warning'
    },
    {
      title: 'Token Usage',
      value: '2.4M',
      change: '+15%',
      changeType: 'positive',
      icon: 'Hash',
      color: 'accent'
    },
    {
      title: 'Active Sessions',
      value: '47',
      change: '-5%',
      changeType: 'negative',
      icon: 'Users',
      color: 'secondary'
    }
  ]);

  // Mock chart data
  const [chartData] = useState({
    latency: [
      { time: '00:00', latency: 1200, p95: 1800, p99: 2400 },
      { time: '04:00', latency: 980, p95: 1450, p99: 1920 },
      { time: '08:00', latency: 1450, p95: 2100, p99: 2800 },
      { time: '12:00', latency: 1680, p95: 2350, p99: 3100 },
      { time: '16:00', latency: 1520, p95: 2200, p99: 2900 },
      { time: '20:00', latency: 1320, p95: 1950, p99: 2600 }
    ],
    usage: [
      { time: '00:00', tokens: 15000, requests: 320, cost: 45.2 },
      { time: '04:00', tokens: 12000, requests: 280, cost: 38.5 },
      { time: '08:00', tokens: 18500, requests: 420, cost: 52.8 },
      { time: '12:00', tokens: 22000, requests: 580, cost: 68.4 },
      { time: '16:00', tokens: 19500, requests: 480, cost: 58.2 },
      { time: '20:00', tokens: 16800, requests: 380, cost: 48.6 }
    ],
    errors: [
      { time: '00:00', errors: 2, timeouts: 1, failures: 0 },
      { time: '04:00', errors: 1, timeouts: 0, failures: 1 },
      { time: '08:00', errors: 4, timeouts: 2, failures: 1 },
      { time: '12:00', errors: 6, timeouts: 3, failures: 2 },
      { time: '16:00', errors: 3, timeouts: 1, failures: 1 },
      { time: '20:00', errors: 2, timeouts: 1, failures: 0 }
    ],
    models: [
      { time: '00:00', 'gpt-4': 45, 'gpt-3.5': 120, 'claude-3': 85, 'llama-2': 70 },
      { time: '04:00', 'gpt-4': 38, 'gpt-3.5': 95, 'claude-3': 72, 'llama-2': 55 },
      { time: '08:00', 'gpt-4': 62, 'gpt-3.5': 145, 'claude-3': 98, 'llama-2': 85 },
      { time: '12:00', 'gpt-4': 78, 'gpt-3.5': 180, 'claude-3': 125, 'llama-2': 110 },
      { time: '16:00', 'gpt-4': 68, 'gpt-3.5': 155, 'claude-3': 108, 'llama-2': 95 },
      { time: '20:00', 'gpt-4': 52, 'gpt-3.5': 128, 'claude-3': 88, 'llama-2': 75 }
    ]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleFiltersChange = (filters) => {
    console.log('Filters changed:', filters);
    // Update charts and metrics based on filters
  };

  const handleExportReport = () => {
    console.log('Exporting comprehensive report...');
  };

  const handleScheduleReport = () => {
    console.log('Opening report scheduling...');
  };

  const getMainContentWidth = () => {
    const filterWidth = isFilterCollapsed ? 48 : 320;
    const alertsWidth = isAlertsCollapsed ? 48 : 320;
    return `calc(100% - ${filterWidth + alertsWidth}px)`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex pt-16">
        {/* Filter Panel */}
        <FilterPanel
          onFiltersChange={handleFiltersChange}
          isCollapsed={isFilterCollapsed}
          onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
        />

        {/* Main Content */}
        <main 
          className="flex-1 p-6 overflow-y-auto max-h-screen"
          style={{ width: getMainContentWidth() }}
        >
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Performance Analytics</h1>
                <p className="text-muted-foreground">
                  Comprehensive insights into AI model execution performance and optimization opportunities
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="RefreshCw" size={16} />
                  <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsComparisonModalOpen(true)}
                  iconName="GitCompare"
                  iconPosition="left"
                >
                  Compare Periods
                </Button>
                <Button
                  variant="outline"
                  onClick={handleScheduleReport}
                  iconName="Calendar"
                  iconPosition="left"
                >
                  Schedule Report
                </Button>
                <Button
                  variant="default"
                  onClick={handleExportReport}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export Report
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Icon name="Zap" size={16} className="text-accent" />
                <span className="text-sm font-medium text-foreground">Quick Actions:</span>
              </div>
              <Button variant="ghost" size="sm">
                <Icon name="Target" size={14} className="mr-1" />
                Set Alerts
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="Settings" size={14} className="mr-1" />
                Configure Dashboard
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="Share" size={14} className="mr-1" />
                Share Insights
              </Button>
              <div className="flex items-center space-x-2 ml-auto">
                <span className="text-sm text-muted-foreground">Auto-refresh:</span>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="text-sm bg-muted border border-border rounded px-2 py-1"
                >
                  <option value={10}>10s</option>
                  <option value={30}>30s</option>
                  <option value={60}>1m</option>
                  <option value={300}>5m</option>
                </select>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {metricsData.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                changeType={metric.changeType}
                icon={metric.icon}
                color={metric.color}
              />
            ))}
          </div>

          {/* Charts Grid */}
          <div className="space-y-8">
            {/* Latency Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart
                title="Response Latency Trends"
                data={chartData.latency}
                type="line"
                height={350}
              />
              <PerformanceChart
                title="Usage & Cost Analysis"
                data={chartData.usage}
                type="area"
                height={350}
              />
            </div>

            {/* Error Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart
                title="Error Rate Analysis"
                data={chartData.errors}
                type="bar"
                height={350}
              />
              <PerformanceChart
                title="Model Usage Distribution"
                data={chartData.models}
                type="pie"
                height={350}
              />
            </div>

            {/* Detailed Performance Breakdown */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Detailed Performance Breakdown</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Icon name="Filter" size={14} className="mr-1" />
                    Filter Models
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icon name="MoreHorizontal" size={14} />
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Model</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Avg Latency</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">P95 Latency</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Success Rate</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total Requests</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cost/Request</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { model: 'GPT-4', latency: '1.24s', p95: '2.1s', success: '99.8%', requests: '45.2K', cost: '$0.032', status: 'excellent' },
                      { model: 'GPT-3.5 Turbo', latency: '0.89s', p95: '1.5s', success: '99.9%', requests: '128.5K', cost: '$0.008', status: 'excellent' },
                      { model: 'Claude-3', latency: '1.45s', p95: '2.3s', success: '99.7%', requests: '32.1K', cost: '$0.028', status: 'good' },
                      { model: 'Llama-2', latency: '2.1s', p95: '3.2s', success: '99.5%', requests: '18.7K', cost: '$0.015', status: 'average' }
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon name="Cpu" size={16} className="text-primary" />
                            </div>
                            <span className="font-medium text-foreground">{row.model}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-foreground">{row.latency}</td>
                        <td className="py-3 px-4 text-foreground">{row.p95}</td>
                        <td className="py-3 px-4 text-foreground">{row.success}</td>
                        <td className="py-3 px-4 text-foreground">{row.requests}</td>
                        <td className="py-3 px-4 text-foreground">{row.cost}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            row.status === 'excellent' ? 'bg-success/10 text-success' :
                            row.status === 'good' ? 'bg-accent/10 text-accent' :
                            row.status === 'average'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {/* Alerts Panel */}
        <AlertsPanel
          isCollapsed={isAlertsCollapsed}
          onToggleCollapse={() => setIsAlertsCollapsed(!isAlertsCollapsed)}
        />
      </div>

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
      />
    </div>
  );
};

export default PerformanceAnalytics;