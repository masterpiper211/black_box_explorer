import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ComparisonModal = ({ isOpen, onClose }) => {
  const [comparisonData] = useState({
    period1: {
      name: 'Last 7 Days',
      data: [
        { time: '00:00', latency: 1200, tokens: 15000, cost: 45.2, requests: 320 },
        { time: '04:00', latency: 980, tokens: 12000, cost: 38.5, requests: 280 },
        { time: '08:00', latency: 1450, tokens: 18500, cost: 52.8, requests: 420 },
        { time: '12:00', latency: 1680, tokens: 22000, cost: 68.4, requests: 580 },
        { time: '16:00', latency: 1520, tokens: 19500, cost: 58.2, requests: 480 },
        { time: '20:00', latency: 1320, tokens: 16800, cost: 48.6, requests: 380 }
      ]
    },
    period2: {
      name: 'Previous 7 Days',
      data: [
        { time: '00:00', latency: 1350, tokens: 14200, cost: 42.8, requests: 300 },
        { time: '04:00', latency: 1120, tokens: 11500, cost: 36.2, requests: 260 },
        { time: '08:00', latency: 1580, tokens: 17800, cost: 49.6, requests: 390 },
        { time: '12:00', latency: 1820, tokens: 21200, cost: 65.8, requests: 550 },
        { time: '16:00', latency: 1680, tokens: 18900, cost: 55.4, requests: 460 },
        { time: '20:00', latency: 1480, tokens: 16200, cost: 46.8, requests: 360 }
      ]
    }
  });

  const [selectedMetric, setSelectedMetric] = useState('latency');
  const [comparisonType, setComparisonType] = useState('overlay');

  const metricOptions = [
    { value: 'latency', label: 'Response Latency' },
    { value: 'tokens', label: 'Token Usage' },
    { value: 'cost', label: 'API Costs' },
    { value: 'requests', label: 'Request Volume' }
  ];

  const comparisonTypeOptions = [
    { value: 'overlay', label: 'Overlay Comparison' },
    { value: 'sidebyside', label: 'Side by Side' },
    { value: 'difference', label: 'Difference Analysis' }
  ];

  const calculateDifference = () => {
    const period1Avg = comparisonData.period1.data.reduce((sum, item) => sum + item[selectedMetric], 0) / comparisonData.period1.data.length;
    const period2Avg = comparisonData.period2.data.reduce((sum, item) => sum + item[selectedMetric], 0) / comparisonData.period2.data.length;
    const difference = ((period1Avg - period2Avg) / period2Avg) * 100;
    return {
      period1Avg,
      period2Avg,
      difference,
      isImprovement: difference < 0 && (selectedMetric === 'latency' || selectedMetric === 'cost') || 
                     difference > 0 && (selectedMetric === 'tokens' || selectedMetric === 'requests')
    };
  };

  const formatValue = (value, metric) => {
    switch (metric) {
      case 'latency': return `${value}ms`;
      case 'tokens': return value.toLocaleString();
      case 'cost': return `$${value.toFixed(2)}`;
      case 'requests': return value.toLocaleString();
      default: return value;
    }
  };

  const renderChart = () => {
    if (comparisonType === 'difference') {
      const differenceData = comparisonData.period1.data.map((item, index) => ({
        time: item.time,
        difference: item[selectedMetric] - comparisonData.period2.data[index][selectedMetric]
      }));

      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={differenceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
            <YAxis stroke="#64748B" fontSize={12} />
            <Tooltip 
              formatter={(value) => [formatValue(value, selectedMetric), 'Difference']}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px'
              }}
            />
            <Line
              type="monotone"
              dataKey="difference"
              stroke="#DC2626"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
          <YAxis stroke="#64748B" fontSize={12} />
          <Tooltip 
            formatter={(value, name) => [formatValue(value, selectedMetric), name]}
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line
            data={comparisonData.period1.data}
            type="monotone"
            dataKey={selectedMetric}
            stroke="#1E40AF"
            strokeWidth={2}
            name={comparisonData.period1.name}
            dot={{ r: 4 }}
          />
          <Line
            data={comparisonData.period2.data}
            type="monotone"
            dataKey={selectedMetric}
            stroke="#0EA5E9"
            strokeWidth={2}
            strokeDasharray="5 5"
            name={comparisonData.period2.name}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const stats = calculateDifference();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-modal w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="GitCompare" size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Performance Comparison</h2>
                <p className="text-sm text-muted-foreground">Compare metrics across different time periods</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Metric to Compare"
              options={metricOptions}
              value={selectedMetric}
              onChange={setSelectedMetric}
            />
            <Select
              label="Comparison Type"
              options={comparisonTypeOptions}
              value={comparisonType}
              onChange={setComparisonType}
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="p-6 border-b border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {formatValue(stats.period1Avg, selectedMetric)}
              </div>
              <div className="text-sm text-muted-foreground">{comparisonData.period1.name}</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-1 ${stats.isImprovement ? 'text-success' : 'text-error'}`}>
                {stats.difference > 0 ? '+' : ''}{stats.difference.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center">
                <Icon 
                  name={stats.isImprovement ? 'TrendingUp' : 'TrendingDown'} 
                  size={16} 
                  className={`mr-1 ${stats.isImprovement ? 'text-success' : 'text-error'}`}
                />
                Change
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary mb-1">
                {formatValue(stats.period2Avg, selectedMetric)}
              </div>
              <div className="text-sm text-muted-foreground">{comparisonData.period2.name}</div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-6">
          {renderChart()}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Icon name="Download" size={16} className="mr-2" />
                Export Report
              </Button>
              <Button variant="ghost" size="sm">
                <Icon name="Share" size={16} className="mr-2" />
                Share Analysis
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button variant="default">
                Save Comparison
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;