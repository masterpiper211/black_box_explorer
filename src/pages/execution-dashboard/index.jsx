import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSidebar from './components/FilterSidebar';
import ExecutionGrid from './components/ExecutionGrid';
import SessionSummary from './components/SessionSummary';
import FilterToolbar from './components/FilterToolbar';
import SystemStatus from './components/SystemStatus';

const ExecutionDashboard = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    models: [],
    users: [],
    status: [],
    timeRange: 'last-24h',
    search: ''
  });

  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'startTime', direction: 'desc' });

  // Mock execution data
  const [executions] = useState([
    {
      id: 'exec_001',
      sessionId: 'SES-2025-001247',
      model: 'GPT-4',
      user: 'Alex Chen',
      startTime: new Date(Date.now() - 900000).toISOString(),
      duration: 245,
      status: 'completed',
      tokens: 15420,
      tokensPerSecond: 62.9,
      cost: 0.462,
      performance: 94,
      hasErrors: false,
      relativeTime: '15 min ago',
      temperature: 0.7,
      maxTokens: 2048
    },
    {
      id: 'exec_002',
      sessionId: 'SES-2025-001248',
      model: 'Claude 3',
      user: 'Sarah Kim',
      startTime: new Date(Date.now() - 300000).toISOString(),
      duration: 0,
      status: 'running',
      tokens: 8750,
      tokensPerSecond: 58.3,
      cost: 0.263,
      performance: 87,
      hasErrors: false,
      relativeTime: '5 min ago',
      temperature: 0.8,
      maxTokens: 4096
    },
    {
      id: 'exec_003',
      sessionId: 'SES-2025-001249',
      model: 'GPT-3.5 Turbo',
      user: 'Mike Johnson',
      startTime: new Date(Date.now() - 1800000).toISOString(),
      duration: 156,
      status: 'failed',
      tokens: 3240,
      tokensPerSecond: 20.8,
      cost: 0.032,
      performance: 45,
      hasErrors: true,
      relativeTime: '30 min ago',
      temperature: 0.5,
      maxTokens: 1024
    },
    {
      id: 'exec_004',
      sessionId: 'SES-2025-001250',
      model: 'LLaMA 2',
      user: 'Emma Davis',
      startTime: new Date(Date.now() - 600000).toISOString(),
      duration: 189,
      status: 'completed',
      tokens: 12680,
      tokensPerSecond: 67.1,
      cost: 0.127,
      performance: 91,
      hasErrors: false,
      relativeTime: '10 min ago',
      temperature: 0.6,
      maxTokens: 2048
    },
    {
      id: 'exec_005',
      sessionId: 'SES-2025-001251',
      model: 'Gemini Pro',
      user: 'David Wilson',
      startTime: new Date(Date.now() - 120000).toISOString(),
      duration: 0,
      status: 'running',
      tokens: 4560,
      tokensPerSecond: 38.0,
      cost: 0.091,
      performance: 82,
      hasErrors: false,
      relativeTime: '2 min ago',
      temperature: 0.7,
      maxTokens: 1024
    },
    {
      id: 'exec_006',
      sessionId: 'SES-2025-001252',
      model: 'GPT-4',
      user: 'Alex Chen',
      startTime: new Date(Date.now() - 2400000).toISOString(),
      duration: 312,
      status: 'completed',
      tokens: 18950,
      tokensPerSecond: 60.7,
      cost: 0.569,
      performance: 96,
      hasErrors: false,
      relativeTime: '40 min ago',
      temperature: 0.8,
      maxTokens: 4096
    },
    {
      id: 'exec_007',
      sessionId: 'SES-2025-001253',
      model: 'Claude 3',
      user: 'Sarah Kim',
      startTime: new Date(Date.now() - 60000).toISOString(),
      duration: 0,
      status: 'queued',
      tokens: 0,
      tokensPerSecond: 0,
      cost: 0.000,
      performance: 0,
      hasErrors: false,
      relativeTime: '1 min ago',
      temperature: 0.7,
      maxTokens: 2048
    },
    {
      id: 'exec_008',
      sessionId: 'SES-2025-001254',
      model: 'GPT-3.5 Turbo',
      user: 'Mike Johnson',
      startTime: new Date(Date.now() - 3600000).toISOString(),
      duration: 98,
      status: 'cancelled',
      tokens: 1240,
      tokensPerSecond: 12.7,
      cost: 0.012,
      performance: 23,
      hasErrors: true,
      relativeTime: '1 hour ago',
      temperature: 0.5,
      maxTokens: 512
    }
  ]);

  const [executionCounts] = useState({
    total: 132,
    active: 12,
    completedToday: 45
  });

  // Filter executions based on current filters
  const filteredExecutions = executions.filter(execution => {
    if (filters.models.length > 0 && !filters.models.some(model => 
      execution.model.toLowerCase().includes(model.toLowerCase())
    )) {
      return false;
    }
    
    if (filters.users.length > 0 && !filters.users.some(user => 
      execution.user.toLowerCase().includes(user.toLowerCase())
    )) {
      return false;
    }
    
    if (filters.status.length > 0 && !filters.status.includes(execution.status)) {
      return false;
    }
    
    if (filters.search && !execution.sessionId.toLowerCase().includes(filters.search.toLowerCase()) &&
        !execution.model.toLowerCase().includes(filters.search.toLowerCase()) &&
        !execution.user.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Sort executions
  const sortedExecutions = [...filteredExecutions].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (sortConfig.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session);
  };

  const handleSavedFilterLoad = (filterKey) => {
    // Mock saved filter loading
    const savedFilters = {
      'recent-failures': {
        models: [],
        users: [],
        status: ['failed'],
        timeRange: 'last-24h',
        search: ''
      },
      'high-cost': {
        models: ['GPT-4'],
        users: [],
        status: ['completed'],
        timeRange: 'last-24h',
        search: ''
      },
      'long-running': {
        models: [],
        users: [],
        status: ['completed'],
        timeRange: 'last-24h',
        search: ''
      },
      'my-sessions': {
        models: [],
        users: ['Alex Chen'],
        status: [],
        timeRange: 'last-24h',
        search: ''
      }
    };
    
    if (savedFilters[filterKey]) {
      setFilters(savedFilters[filterKey]);
    }
  };

  const handleSavedFilterSave = (name, filterData) => {
    // Mock saving filter
    console.log('Saving filter:', name, filterData);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.key) {
        case 'j':
          e.preventDefault();
          // Navigate down in grid
          break;
        case 'k':
          e.preventDefault();
          // Navigate up in grid
          break;
        case ' ':
          e.preventDefault();
          // Select current row
          break;
        case 'Enter':
          e.preventDefault();
          // Open details
          break;
        case 'Escape':
          e.preventDefault();
          setSelectedSession(null);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Left Sidebar - Filters (25%) */}
        <div className="w-1/4 min-w-[300px] max-w-[400px]">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            executionCounts={executionCounts}
          />
        </div>

        {/* Center Panel - Execution Grid (50%) */}
        <div className="flex-1 flex flex-col">
          <FilterToolbar
            filters={filters}
            onFiltersChange={setFilters}
            onSavedFilterLoad={handleSavedFilterLoad}
            onSavedFilterSave={handleSavedFilterSave}
          />
          
          <ExecutionGrid
            executions={sortedExecutions}
            selectedSessions={selectedSessions}
            onSessionSelect={setSelectedSessions}
            onSessionClick={handleSessionClick}
            filters={filters}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </div>

        {/* Right Panel - Session Summary (25%) */}
        <div className="w-1/4 min-w-[300px] max-w-[400px] flex flex-col">
          <SessionSummary
            selectedSession={selectedSession}
            onClose={() => setSelectedSession(null)}
          />
          
          {/* System Status at bottom */}
          <div className="p-4">
            <SystemStatus />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionDashboard;