import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterPanel = ({ onFiltersChange, isCollapsed, onToggleCollapse }) => {
  const [filters, setFilters] = useState({
    timeRange: '7d',
    modelTypes: [],
    userGroups: [],
    performanceThreshold: 'all',
    dateRange: {
      start: '2025-01-23',
      end: '2025-01-30'
    }
  });

  const timeRangeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const modelTypeOptions = [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-3', label: 'Claude 3' },
    { value: 'llama-2', label: 'Llama 2' },
    { value: 'gemini-pro', label: 'Gemini Pro' }
  ];

  const userGroupOptions = [
    { value: 'ml-engineers', label: 'ML Engineers' },
    { value: 'data-scientists', label: 'Data Scientists' },
    { value: 'product-managers', label: 'Product Managers' },
    { value: 'qa-engineers', label: 'QA Engineers' },
    { value: 'devops', label: 'DevOps Team' }
  ];

  const performanceThresholdOptions = [
    { value: 'all', label: 'All Performance Levels' },
    { value: 'excellent', label: 'Excellent (< 500ms)' },
    { value: 'good', label: 'Good (500ms - 1s)' },
    { value: 'average', label: 'Average (1s - 3s)' },
    { value: 'poor', label: 'Poor (> 3s)' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (field, value) => {
    const newDateRange = { ...filters.dateRange, [field]: value };
    const newFilters = { ...filters, dateRange: newDateRange };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      timeRange: '7d',
      modelTypes: [],
      userGroups: [],
      performanceThreshold: 'all',
      dateRange: {
        start: '2025-01-23',
        end: '2025-01-30'
      }
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-card border-r border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <Icon name="ChevronRight" size={20} />
        </Button>
        <div className="flex flex-col space-y-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Filter" size={16} className="text-primary" />
          </div>
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={16} className="text-accent" />
          </div>
          <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Users" size={16} className="text-success" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-r border-border p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
        >
          <Icon name="ChevronLeft" size={20} />
        </Button>
      </div>

      <div className="space-y-6">
        {/* Time Range */}
        <div>
          <Select
            label="Time Range"
            options={timeRangeOptions}
            value={filters.timeRange}
            onChange={(value) => handleFilterChange('timeRange', value)}
          />
        </div>

        {/* Custom Date Range */}
        {filters.timeRange === 'custom' && (
          <div className="space-y-4">
            <Input
              label="Start Date"
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => handleDateRangeChange('start', e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => handleDateRangeChange('end', e.target.value)}
            />
          </div>
        )}

        {/* Model Types */}
        <div>
          <Select
            label="Model Types"
            options={modelTypeOptions}
            value={filters.modelTypes}
            onChange={(value) => handleFilterChange('modelTypes', value)}
            multiple
            searchable
            placeholder="Select models..."
          />
        </div>

        {/* User Groups */}
        <div>
          <Select
            label="User Groups"
            options={userGroupOptions}
            value={filters.userGroups}
            onChange={(value) => handleFilterChange('userGroups', value)}
            multiple
            searchable
            placeholder="Select user groups..."
          />
        </div>

        {/* Performance Threshold */}
        <div>
          <Select
            label="Performance Threshold"
            options={performanceThresholdOptions}
            value={filters.performanceThreshold}
            onChange={(value) => handleFilterChange('performanceThreshold', value)}
          />
        </div>

        {/* Quick Filters */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Quick Filters</h3>
          <div className="space-y-3">
            <Checkbox
              label="Show only errors"
              checked={filters.showOnlyErrors || false}
              onChange={(e) => handleFilterChange('showOnlyErrors', e.target.checked)}
            />
            <Checkbox
              label="High cost executions"
              checked={filters.highCostOnly || false}
              onChange={(e) => handleFilterChange('highCostOnly', e.target.checked)}
            />
            <Checkbox
              label="Long running sessions"
              checked={filters.longRunningOnly || false}
              onChange={(e) => handleFilterChange('longRunningOnly', e.target.checked)}
            />
            <Checkbox
              label="Peak usage hours"
              checked={filters.peakHoursOnly || false}
              onChange={(e) => handleFilterChange('peakHoursOnly', e.target.checked)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-border space-y-2">
          <Button
            variant="outline"
            onClick={resetFilters}
            className="w-full"
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset Filters
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            iconName="Download"
            iconPosition="left"
          >
            Export Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;