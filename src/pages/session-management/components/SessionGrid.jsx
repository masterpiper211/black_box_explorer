import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SessionGrid = ({ 
  sessions, 
  selectedSessions, 
  onSelectionChange, 
  onSessionEdit, 
  onSessionView,
  searchQuery,
  onSearchChange,
  sortConfig,
  onSort,
  filters,
  onFilterChange
}) => {
  const [editingSession, setEditingSession] = useState(null);
  const [editValues, setEditValues] = useState({});
  const gridRef = useRef(null);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'running', label: 'Running' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const modelOptions = [
    { value: 'all', label: 'All Models' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-3', label: 'Claude 3' },
    { value: 'llama-2', label: 'Llama 2' }
  ];

  const userOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'alex.chen', label: 'Alex Chen' },
    { value: 'sarah.kim', label: 'Sarah Kim' },
    { value: 'mike.johnson', label: 'Mike Johnson' },
    { value: 'emma.davis', label: 'Emma Davis' }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && editingSession) {
        handleCancelEdit();
      }
      if (e.key === 'Enter' && editingSession) {
        handleSaveEdit();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editingSession]);

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(sessions.map(s => s.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectSession = (sessionId, checked) => {
    if (checked) {
      onSelectionChange([...selectedSessions, sessionId]);
    } else {
      onSelectionChange(selectedSessions.filter(id => id !== sessionId));
    }
  };

  const handleStartEdit = (session) => {
    setEditingSession(session.id);
    setEditValues({
      name: session.name,
      description: session.description || '',
      tags: session.tags.join(', ')
    });
  };

  const handleSaveEdit = () => {
    if (editingSession) {
      const updatedSession = {
        ...sessions.find(s => s.id === editingSession),
        name: editValues.name,
        description: editValues.description,
        tags: editValues.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      onSessionEdit(updatedSession);
      setEditingSession(null);
      setEditValues({});
    }
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
    setEditValues({});
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'running': return 'Play';
      case 'failed': return 'XCircle';
      case 'cancelled': return 'StopCircle';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'running': return 'text-warning';
      case 'failed': return 'text-error';
      case 'cancelled': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const formatTokens = (tokens) => {
    if (tokens < 1000) return tokens.toString();
    if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`;
    return `${(tokens / 1000000).toFixed(1)}M`;
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const allSelected = sessions.length > 0 && selectedSessions.length === sessions.length;
  const someSelected = selectedSessions.length > 0 && selectedSessions.length < sessions.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Filters Bar */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search sessions by name, description, or content..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-3">
            <Select
              options={statusOptions}
              value={filters.status}
              onChange={(value) => onFilterChange({ ...filters, status: value })}
              placeholder="Status"
              className="w-32"
            />
            <Select
              options={modelOptions}
              value={filters.model}
              onChange={(value) => onFilterChange({ ...filters, model: value })}
              placeholder="Model"
              className="w-36"
            />
            <Select
              options={userOptions}
              value={filters.user}
              onChange={(value) => onFilterChange({ ...filters, user: value })}
              placeholder="User"
              className="w-32"
            />
          </div>
        </div>
      </div>

      {/* Grid Header */}
      <div className="bg-muted/50 border-b border-border">
        <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground">
          <div className="col-span-1 flex items-center">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </div>
          <div className="col-span-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSort('name')}
              className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
            >
              Session Name
              <Icon name={getSortIcon('name')} size={14} className="ml-1" />
            </Button>
          </div>
          <div className="col-span-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSort('model')}
              className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
            >
              Model
              <Icon name={getSortIcon('model')} size={14} className="ml-1" />
            </Button>
          </div>
          <div className="col-span-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSort('user')}
              className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
            >
              User
              <Icon name={getSortIcon('user')} size={14} className="ml-1" />
            </Button>
          </div>
          <div className="col-span-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSort('createdAt')}
              className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
            >
              Created
              <Icon name={getSortIcon('createdAt')} size={14} className="ml-1" />
            </Button>
          </div>
          <div className="col-span-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSort('duration')}
              className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
            >
              Duration
              <Icon name={getSortIcon('duration')} size={14} className="ml-1" />
            </Button>
          </div>
          <div className="col-span-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSort('tokens')}
              className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
            >
              Tokens
              <Icon name={getSortIcon('tokens')} size={14} className="ml-1" />
            </Button>
          </div>
          <div className="col-span-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSort('status')}
              className="h-auto p-0 font-medium text-muted-foreground hover:text-foreground"
            >
              Status
              <Icon name={getSortIcon('status')} size={14} className="ml-1" />
            </Button>
          </div>
          <div className="col-span-2">Tags</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Grid Body */}
      <div className="max-h-[600px] overflow-y-auto" ref={gridRef}>
        {sessions.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Database" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No sessions found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`grid grid-cols-12 gap-4 p-4 border-b border-border hover:bg-muted/30 transition-colors ${
                selectedSessions.includes(session.id) ? 'bg-accent/10' : ''
              }`}
            >
              <div className="col-span-1 flex items-center">
                <Checkbox
                  checked={selectedSessions.includes(session.id)}
                  onChange={(e) => handleSelectSession(session.id, e.target.checked)}
                />
              </div>
              
              <div className="col-span-2">
                {editingSession === session.id ? (
                  <div className="space-y-2">
                    <Input
                      type="text"
                      value={editValues.name}
                      onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                      className="text-sm"
                    />
                    <Input
                      type="text"
                      value={editValues.description}
                      onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                      placeholder="Description"
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button size="xs" onClick={handleSaveEdit} iconName="Check">
                        Save
                      </Button>
                      <Button size="xs" variant="ghost" onClick={handleCancelEdit} iconName="X">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="font-medium text-foreground">{session.name}</div>
                    {session.description && (
                      <div className="text-sm text-muted-foreground mt-1">{session.description}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">ID: {session.id}</div>
                  </div>
                )}
              </div>
              
              <div className="col-span-1 flex items-center">
                <span className="text-sm text-foreground">{session.model}</span>
              </div>
              
              <div className="col-span-1 flex items-center">
                <span className="text-sm text-foreground">{session.user}</span>
              </div>
              
              <div className="col-span-1 flex items-center">
                <div className="text-sm">
                  <div className="text-foreground">{session.createdAt.toLocaleDateString()}</div>
                  <div className="text-xs text-muted-foreground">{session.createdAt.toLocaleTimeString()}</div>
                </div>
              </div>
              
              <div className="col-span-1 flex items-center">
                <span className="text-sm text-foreground">{formatDuration(session.duration)}</span>
              </div>
              
              <div className="col-span-1 flex items-center">
                <span className="text-sm text-foreground">{formatTokens(session.tokens)}</span>
              </div>
              
              <div className="col-span-1 flex items-center">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getStatusIcon(session.status)} 
                    size={16} 
                    className={getStatusColor(session.status)}
                  />
                  <span className={`text-sm capitalize ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </div>
              </div>
              
              <div className="col-span-2 flex items-center">
                {editingSession === session.id ? (
                  <Input
                    type="text"
                    value={editValues.tags}
                    onChange={(e) => setEditValues({ ...editValues, tags: e.target.value })}
                    placeholder="tag1, tag2, tag3"
                    className="text-sm"
                  />
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {session.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent/20 text-accent-foreground text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="col-span-1 flex items-center">
                <div className="flex space-x-1">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => onSessionView(session)}
                    iconName="Eye"
                    className="h-8 w-8"
                  />
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleStartEdit(session)}
                    iconName="Edit"
                    className="h-8 w-8"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionGrid;