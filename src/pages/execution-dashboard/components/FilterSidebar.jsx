import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFiltersChange, executionCounts }) => {
  const [expandedSections, setExpandedSections] = useState({
    models: true,
    users: true,
    status: true,
    timeRange: true
  });

  const modelOptions = [
    { value: 'gpt-4', label: 'GPT-4', count: 45 },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', count: 32 },
    { value: 'claude-3', label: 'Claude 3', count: 28 },
    { value: 'llama-2', label: 'LLaMA 2', count: 15 },
    { value: 'gemini-pro', label: 'Gemini Pro', count: 12 }
  ];

  const userOptions = [
    { value: 'alex.chen', label: 'Alex Chen', count: 23 },
    { value: 'sarah.kim', label: 'Sarah Kim', count: 18 },
    { value: 'mike.johnson', label: 'Mike Johnson', count: 15 },
    { value: 'emma.davis', label: 'Emma Davis', count: 12 },
    { value: 'david.wilson', label: 'David Wilson', count: 8 }
  ];

  const statusOptions = [
    { value: 'running', label: 'Running', count: 12, color: 'text-warning' },
    { value: 'completed', label: 'Completed', count: 89, color: 'text-success' },
    { value: 'failed', label: 'Failed', count: 7, color: 'text-error' },
    { value: 'queued', label: 'Queued', count: 4, color: 'text-muted-foreground' },
    { value: 'cancelled', label: 'Cancelled', count: 3, color: 'text-muted-foreground' }
  ];

  const timeRangeOptions = [
    { value: 'last-hour', label: 'Last Hour' },
    { value: 'last-24h', label: 'Last 24 Hours' },
    { value: 'last-7d', label: 'Last 7 Days' },
    { value: 'last-30d', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (type, value, checked = null) => {
    if (type === 'models' || type === 'users' || type === 'status') {
      const currentValues = filters[type] || [];
      let newValues;
      
      if (checked !== null) {
        newValues = checked 
          ? [...currentValues, value]
          : currentValues.filter(v => v !== value);
      } else {
        newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
      }
      
      onFiltersChange({ ...filters, [type]: newValues });
    } else {
      onFiltersChange({ ...filters, [type]: value });
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({
      models: [],
      users: [],
      status: [],
      timeRange: 'last-24h',
      search: ''
    });
  };

  const getActiveFilterCount = () => {
    const { models = [], users = [], status = [], search = '' } = filters;
    return models.length + users.length + status.length + (search ? 1 : 0);
  };

  const FilterSection = ({ title, isExpanded, onToggle, children, count }) => (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium text-foreground">{title}</span>
          {count > 0 && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {count}
            </span>
          )}
        </div>
        <Icon 
          name={isExpanded ? "ChevronDown" : "ChevronRight"} 
          size={16} 
          className="text-muted-foreground"
        />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-full bg-surface border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Filters</h2>
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
        
        {/* Search */}
        <Input
          type="search"
          placeholder="Search sessions..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="mb-4"
        />

        {/* Active Filters Count */}
        {getActiveFilterCount() > 0 && (
          <div className="text-xs text-muted-foreground">
            {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
          </div>
        )}
      </div>

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Time Range */}
        <FilterSection
          title="Time Range"
          isExpanded={expandedSections.timeRange}
          onToggle={() => toggleSection('timeRange')}
        >
          <Select
            options={timeRangeOptions}
            value={filters.timeRange || 'last-24h'}
            onChange={(value) => handleFilterChange('timeRange', value)}
            placeholder="Select time range"
          />
          
          {filters.timeRange === 'custom' && (
            <div className="mt-3 space-y-2">
              <Input
                type="datetime-local"
                label="Start Date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
              <Input
                type="datetime-local"
                label="End Date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          )}
        </FilterSection>

        {/* Status */}
        <FilterSection
          title="Status"
          isExpanded={expandedSections.status}
          onToggle={() => toggleSection('status')}
          count={filters.status?.length || 0}
        >
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <div key={status.value} className="flex items-center justify-between">
                <Checkbox
                  label={
                    <div className="flex items-center space-x-2">
                      <span className={status.color}>{status.label}</span>
                    </div>
                  }
                  checked={filters.status?.includes(status.value) || false}
                  onChange={(e) => handleFilterChange('status', status.value, e.target.checked)}
                />
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {status.count}
                </span>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Models */}
        <FilterSection
          title="Models"
          isExpanded={expandedSections.models}
          onToggle={() => toggleSection('models')}
          count={filters.models?.length || 0}
        >
          <div className="space-y-2">
            {modelOptions.map((model) => (
              <div key={model.value} className="flex items-center justify-between">
                <Checkbox
                  label={model.label}
                  checked={filters.models?.includes(model.value) || false}
                  onChange={(e) => handleFilterChange('models', model.value, e.target.checked)}
                />
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {model.count}
                </span>
              </div>
            ))}
          </div>
        </FilterSection>

        {/* Users */}
        <FilterSection
          title="Users"
          isExpanded={expandedSections.users}
          onToggle={() => toggleSection('users')}
          count={filters.users?.length || 0}
        >
          <div className="space-y-2">
            {userOptions.map((user) => (
              <div key={user.value} className="flex items-center justify-between">
                <Checkbox
                  label={user.label}
                  checked={filters.users?.includes(user.value) || false}
                  onChange={(e) => handleFilterChange('users', user.value, e.target.checked)}
                />
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {user.count}
                </span>
              </div>
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Total Sessions:</span>
            <span className="font-medium">{executionCounts.total || 132}</span>
          </div>
          <div className="flex justify-between">
            <span>Active:</span>
            <span className="font-medium text-warning">{executionCounts.active || 12}</span>
          </div>
          <div className="flex justify-between">
            <span>Completed Today:</span>
            <span className="font-medium text-success">{executionCounts.completedToday || 45}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;