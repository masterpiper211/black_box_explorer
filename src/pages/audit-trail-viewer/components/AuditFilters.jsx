import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AuditFilters = ({ filters, onFiltersChange, onClearFilters, onSaveSearch }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const userOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'alex.chen', label: 'Alex Chen' },
    { value: 'sarah.kim', label: 'Sarah Kim' },
    { value: 'mike.johnson', label: 'Mike Johnson' },
    { value: 'lisa.wang', label: 'Lisa Wang' },
    { value: 'david.brown', label: 'David Brown' },
    { value: 'system', label: 'System' }
  ];

  const actionOptions = [
    { value: 'all', label: 'All Actions' },
    { value: 'login', label: 'User Login' },
    { value: 'logout', label: 'User Logout' },
    { value: 'model_execution', label: 'Model Execution' },
    { value: 'config_change', label: 'Configuration Change' },
    { value: 'data_export', label: 'Data Export' },
    { value: 'session_create', label: 'Session Created' },
    { value: 'session_delete', label: 'Session Deleted' },
    { value: 'permission_change', label: 'Permission Change' },
    { value: 'api_call', label: 'API Call' },
    { value: 'error', label: 'System Error' }
  ];

  const complianceOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'security', label: 'Security Events' },
    { value: 'data_access', label: 'Data Access' },
    { value: 'configuration', label: 'Configuration' },
    { value: 'user_management', label: 'User Management' },
    { value: 'system_health', label: 'System Health' },
    { value: 'compliance', label: 'Compliance' }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
    { value: 'info', label: 'Info' }
  ];

  const savedSearches = [
    { id: 1, name: 'Security Events Today', query: 'category:security date:today' },
    { id: 2, name: 'Failed Logins', query: 'action:login outcome:failure' },
    { id: 3, name: 'Config Changes', query: 'action:config_change' },
    { id: 4, name: 'Data Exports', query: 'action:data_export' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleSaveSearch = () => {
    if (searchName.trim()) {
      onSaveSearch(searchName, filters);
      setSearchName('');
      setShowSaveDialog(false);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.user !== 'all') count++;
    if (filters.action !== 'all') count++;
    if (filters.compliance !== 'all') count++;
    if (filters.severity !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.searchQuery) count++;
    return count;
  };

  return (
    <div className="w-full h-full bg-surface border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground flex items-center">
            <Icon name="Filter" size={18} className="mr-2" />
            Audit Filters
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </Button>
        </div>
        
        {getActiveFiltersCount() > 0 && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs h-6"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Filters Content */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Search Query */}
          <div>
            <Input
              label="Search Query"
              type="search"
              placeholder="Search audit logs..."
              value={filters.searchQuery || ''}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              description="Use keywords, regex, or field:value syntax"
            />
          </div>

          {/* Date Range */}
          <div>
            <Select
              label="Date Range"
              options={[
                { value: 'all', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'yesterday', label: 'Yesterday' },
                { value: 'last_7_days', label: 'Last 7 Days' },
                { value: 'last_30_days', label: 'Last 30 Days' },
                { value: 'this_month', label: 'This Month' },
                { value: 'last_month', label: 'Last Month' },
                { value: 'custom', label: 'Custom Range' }
              ]}
              value={filters.dateRange || 'all'}
              onChange={(value) => handleFilterChange('dateRange', value)}
            />
          </div>

          {/* User Filter */}
          <div>
            <Select
              label="User"
              options={userOptions}
              value={filters.user || 'all'}
              onChange={(value) => handleFilterChange('user', value)}
              searchable
            />
          </div>

          {/* Action Filter */}
          <div>
            <Select
              label="Action Type"
              options={actionOptions}
              value={filters.action || 'all'}
              onChange={(value) => handleFilterChange('action', value)}
              searchable
            />
          </div>

          {/* Compliance Category */}
          <div>
            <Select
              label="Compliance Category"
              options={complianceOptions}
              value={filters.compliance || 'all'}
              onChange={(value) => handleFilterChange('compliance', value)}
            />
          </div>

          {/* Severity */}
          <div>
            <Select
              label="Severity Level"
              options={severityOptions}
              value={filters.severity || 'all'}
              onChange={(value) => handleFilterChange('severity', value)}
            />
          </div>

          {/* Outcome Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Outcome
            </label>
            <div className="space-y-2">
              <Checkbox
                label="Success"
                checked={filters.outcomes?.includes('success') || false}
                onChange={(e) => {
                  const outcomes = filters.outcomes || [];
                  if (e.target.checked) {
                    handleFilterChange('outcomes', [...outcomes, 'success']);
                  } else {
                    handleFilterChange('outcomes', outcomes.filter(o => o !== 'success'));
                  }
                }}
              />
              <Checkbox
                label="Failure"
                checked={filters.outcomes?.includes('failure') || false}
                onChange={(e) => {
                  const outcomes = filters.outcomes || [];
                  if (e.target.checked) {
                    handleFilterChange('outcomes', [...outcomes, 'failure']);
                  } else {
                    handleFilterChange('outcomes', outcomes.filter(o => o !== 'failure'));
                  }
                }}
              />
              <Checkbox
                label="Warning"
                checked={filters.outcomes?.includes('warning') || false}
                onChange={(e) => {
                  const outcomes = filters.outcomes || [];
                  if (e.target.checked) {
                    handleFilterChange('outcomes', [...outcomes, 'warning']);
                  } else {
                    handleFilterChange('outcomes', outcomes.filter(o => o !== 'warning'));
                  }
                }}
              />
            </div>
          </div>

          {/* IP Address Filter */}
          <div>
            <Input
              label="IP Address"
              type="text"
              placeholder="192.168.1.1 or range"
              value={filters.ipAddress || ''}
              onChange={(e) => handleFilterChange('ipAddress', e.target.value)}
              description="Filter by specific IP or range"
            />
          </div>
        </div>
      )}

      {/* Saved Searches */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-foreground">Saved Searches</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
            className="text-xs"
          >
            <Icon name="Plus" size={14} className="mr-1" />
            Save
          </Button>
        </div>

        <div className="space-y-1">
          {savedSearches.map((search) => (
            <button
              key={search.id}
              className="w-full text-left px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
              onClick={() => {
                // Apply saved search logic would go here
                console.log('Apply saved search:', search.query);
              }}
            >
              {search.name}
            </button>
          ))}
        </div>

        {/* Save Search Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface border border-border rounded-lg p-4 w-80">
              <h3 className="font-medium text-foreground mb-3">Save Search</h3>
              <Input
                label="Search Name"
                type="text"
                placeholder="Enter search name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="mb-4"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowSaveDialog(false);
                    setSearchName('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveSearch}
                  disabled={!searchName.trim()}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditFilters;