import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PerformanceChart = ({ title, data, type = 'line', height = 300, showControls = true }) => {
  const [chartType, setChartType] = useState(type);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const colors = {
    primary: '#1E40AF',
    secondary: '#64748B',
    accent: '#0EA5E9',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626'
  };

  const pieColors = ['#1E40AF', '#0EA5E9', '#059669', '#D97706', '#DC2626', '#64748B'];

  const chartTypes = [
    { value: 'line', label: 'Line', icon: 'TrendingUp' },
    { value: 'area', label: 'Area', icon: 'AreaChart' },
    { value: 'bar', label: 'Bar', icon: 'BarChart3' },
    { value: 'pie', label: 'Pie', icon: 'PieChart' }
  ];

  const formatTooltipValue = (value, name) => {
    if (name === 'latency') return [`${value}ms`, 'Latency'];
    if (name === 'tokens') return [`${value.toLocaleString()}`, 'Tokens'];
    if (name === 'cost') return [`$${value.toFixed(4)}`, 'Cost'];
    if (name === 'requests') return [`${value.toLocaleString()}`, 'Requests'];
    if (name === 'errors') return [`${value}`, 'Errors'];
    return [value, name];
  };

  const exportChart = (format) => {
    // Mock export functionality
    console.log(`Exporting chart as ${format}`);
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
            <YAxis stroke="#64748B" fontSize={12} />
            <Tooltip 
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {Object.keys(data[0] || {}).filter(key => key !== 'time').map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={Object.values(colors)[index % Object.values(colors).length]}
                fill={Object.values(colors)[index % Object.values(colors).length]}
                fillOpacity={0.3}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
            <YAxis stroke="#64748B" fontSize={12} />
            <Tooltip 
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {Object.keys(data[0] || {}).filter(key => key !== 'time').map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={Object.values(colors)[index % Object.values(colors).length]}
              />
            ))}
          </BarChart>
        );

      case 'pie':
        const pieData = Object.keys(data[0] || {})
          .filter(key => key !== 'time')
          .map((key, index) => ({
            name: key,
            value: data.reduce((sum, item) => sum + (item[key] || 0), 0),
            fill: pieColors[index % pieColors.length]
          }));

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={formatTooltipValue} />
          </PieChart>
        );

      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
            <YAxis stroke="#64748B" fontSize={12} />
            <Tooltip 
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            {Object.keys(data[0] || {}).filter(key => key !== 'time').map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={Object.values(colors)[index % Object.values(colors).length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {showControls && (
            <div className="flex items-center space-x-2">
              {/* Chart Type Selector */}
              <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                {chartTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={chartType === type.value ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setChartType(type.value)}
                    iconName={type.icon}
                    className="px-2"
                  >
                    {type.label}
                  </Button>
                ))}
              </div>

              {/* Export Options */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => exportChart('png')}
                  title="Export as PNG"
                >
                  <Icon name="Download" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  <Icon name={isFullscreen ? 'Minimize2' : 'Maximize2'} size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div style={{ width: '100%', height: isFullscreen ? 'calc(100vh - 200px)' : height }}>
          <ResponsiveContainer>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {isFullscreen && (
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(false)}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;