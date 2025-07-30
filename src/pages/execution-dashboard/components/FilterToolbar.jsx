import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterToolbar = ({ filters, onFiltersChange, onSavedFilterLoad, onSavedFilterSave }) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  const savedFilters = [
    { value: 'recent-failures', label: 'Recent Failures', description: 'Failed sessions in last 24h' },
    { value: 'high-cost', label: 'High Cost Sessions', description: 'Sessions over $1.00' },
    { value: 'long-running', label: 'Long Running', description: 'Sessions over 5 minutes' },
    { value: 'my-sessions', label: 'My Sessions', description: 'Sessions by current user' }
  ];

  const statusChips = [
    { value: 'running', label: 'Running', count: 12, color: 'bg-warning/10 text-warning border-warning/20' },
    { value: 'completed', label: 'Completed', count: 89, color: 'bg-success/10 text-success border-success/20' },
    { value: 'failed', label: 'Failed', count: 7, color: 'bg-error/10 text-error border-error/20' },
    { value: 'queued', label: 'Queued', count: 4, color: 'bg-muted text-muted-foreground border-border' }
  ];

  const handleStatusChipClick = (status) => {
    const currentStatus = filters.status || [];
    const newStatus = currentStatus.includes(status)
      ? currentStatus.filter(s => s !== status)
      : [...currentStatus, status];
    
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handleSaveFilter = () => {
    if (filterName.trim()) {
      onSavedFilterSave(filterName.trim(), filters);
      setFilterName('');
      setShowSaveDialog(false);
    }
  };

  const getActiveFilterCount = () => {
    const { models = [], users = [], status = [], search = '' } = filters;
    return models.length + users.length + status.length + (search ? 1 : 0);
  };

  return (
    <div className="bg-surface border-b border-border">
      {/* Main Toolbar */}
      <div className="p-4 space-y-4">
        {/* Top Row - Search and Saved Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search sessions, users, models..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              options={[
                { value: '', label: 'Load Saved Filter...' },
                ...savedFilters
              ]}
              value=""
              onChange={(value) => value && onSavedFilterLoad(value)}
              placeholder="Saved Filters"
            />
            
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(true)}
              disabled={getActiveFilterCount() === 0}
            >
              <Icon name="Save" size={16} className="mr-2" />
              Save Filter
            </Button>
            
            <Button variant="outline">
              <Icon name="Download" size={16} className="mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Status Chips */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Quick Filters:</span>
          {statusChips.map((chip) => (
            <button
              key={chip.value}
              onClick={() => handleStatusChipClick(chip.value)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all hover:scale-105 ${
                filters.status?.includes(chip.value)
                  ? chip.color
                  : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {chip.label} ({chip.count})
            </button>
          ))}
        </div>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <div className="flex items-center space-x-2 p-3 bg-primary/5 rounded-lg">
            <Icon name="Filter" size={16} className="text-primary" />
            <span className="text-sm text-primary font-medium">
              {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
            </span>
            
            <div className="flex items-center space-x-1 ml-4">
              {filters.models?.map((model) => (
                <span key={model} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  Model: {model}
                  <button
                    onClick={() => onFiltersChange({
                      ...filters,
                      models: filters.models.filter(m => m !== model)
                    })}
                    className="ml-1 hover:text-primary/70"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              ))}
              
              {filters.users?.map((user) => (
                <span key={user} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  User: {user}
                  <button
                    onClick={() => onFiltersChange({
                      ...filters,
                      users: filters.users.filter(u => u !== user)
                    })}
                    className="ml-1 hover:text-primary/70"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              ))}
              
              {filters.search && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                  Search: "{filters.search}"
                  <button
                    onClick={() => onFiltersChange({ ...filters, search: '' })}
                    className="ml-1 hover:text-primary/70"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFiltersChange({
                models: [],
                users: [],
                status: [],
                timeRange: 'last-24h',
                search: ''
              })}
              className="ml-auto"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface border border-border rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-foreground mb-4">Save Filter</h3>
            
            <Input
              label="Filter Name"
              placeholder="Enter a name for this filter..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="mb-4"
            />
            
            <div className="text-sm text-muted-foreground mb-4">
              This will save your current filter settings:
              <ul className="mt-2 space-y-1">
                {filters.models?.length > 0 && (
                  <li>• Models: {filters.models.join(', ')}</li>
                )}
                {filters.users?.length > 0 && (
                  <li>• Users: {filters.users.join(', ')}</li>
                )}
                {filters.status?.length > 0 && (
                  <li>• Status: {filters.status.join(', ')}</li>
                )}
                {filters.search && (
                  <li>• Search: "{filters.search}"</li>
                )}
              </ul>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSaveDialog(false);
                  setFilterName('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveFilter}
                disabled={!filterName.trim()}
              >
                Save Filter
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;