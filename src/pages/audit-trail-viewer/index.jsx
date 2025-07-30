import React, { useState, useEffect, useCallback } from 'react';
import AuditHeader from './components/AuditHeader';
import AuditFilters from './components/AuditFilters';
import AuditLogTable from './components/AuditLogTable';
import EventDetailsPanel from './components/EventDetailsPanel';

const AuditTrailViewer = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: '',
    dateRange: 'all',
    user: 'all',
    action: 'all',
    compliance: 'all',
    severity: 'all',
    outcomes: [],
    ipAddress: ''
  });
  const [refreshRate, setRefreshRate] = useState('manual');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  // Mock audit log data
  const mockAuditLogs = [
    {
      id: 'audit-001',
      timestamp: new Date(Date.now() - 300000),
      user: 'alex.chen',
      action: 'model_execution',
      resource: '/api/models/gpt-4/execute',
      outcome: 'success',
      severity: 'info',
      category: 'model_operations',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      sessionId: 'sess_abc123',
      requestId: 'req_xyz789',
      duration: 2340,
      dataSize: '1.2 MB',
      description: 'Successfully executed GPT-4 model with prompt optimization enabled. Generated 1,247 tokens with 98.5% confidence score.'
    },
    {
      id: 'audit-002',
      timestamp: new Date(Date.now() - 600000),
      user: 'sarah.kim',
      action: 'config_change',
      resource: '/config/model-settings',
      outcome: 'success',
      severity: 'medium',
      category: 'configuration',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_def456',
      requestId: 'req_abc123',
      duration: 890,
      dataSize: '45 KB',
      description: 'Updated model configuration parameters: temperature=0.7, max_tokens=2048, top_p=0.9. Changes applied to production environment.'
    },
    {
      id: 'audit-003',
      timestamp: new Date(Date.now() - 900000),
      user: 'mike.johnson',
      action: 'login',
      resource: '/auth/login',
      outcome: 'failure',
      severity: 'high',
      category: 'security',
      ipAddress: '203.0.113.45',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      sessionId: 'sess_ghi789',
      requestId: 'req_def456',
      duration: 1200,
      dataSize: '2 KB',
      errorMessage: 'Invalid credentials provided. Account locked after 3 failed attempts.',
      description: 'Failed login attempt detected from suspicious IP address. Account security measures activated.'
    },
    {
      id: 'audit-004',
      timestamp: new Date(Date.now() - 1200000),
      user: 'lisa.wang',
      action: 'data_export',
      resource: '/api/export/audit-logs',
      outcome: 'success',
      severity: 'medium',
      category: 'data_access',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      sessionId: 'sess_jkl012',
      requestId: 'req_ghi789',
      duration: 5670,
      dataSize: '15.7 MB',
      description: 'Exported audit log data for compliance reporting. Date range: 2025-07-01 to 2025-07-30. Format: CSV with 12,847 records.'
    },
    {
      id: 'audit-005',
      timestamp: new Date(Date.now() - 1500000),
      user: 'david.brown',
      action: 'session_create',
      resource: '/api/sessions/new',
      outcome: 'success',
      severity: 'info',
      category: 'session_management',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_mno345',
      requestId: 'req_jkl012',
      duration: 450,
      dataSize: '8 KB',
      description: 'New execution session created for model performance analysis. Session configured with debug mode enabled.'
    },
    {
      id: 'audit-006',
      timestamp: new Date(Date.now() - 1800000),
      user: 'system',
      action: 'api_call',
      resource: '/api/models/health-check',
      outcome: 'warning',
      severity: 'medium',
      category: 'system_health',
      ipAddress: '127.0.0.1',
      userAgent: 'Internal-Health-Monitor/1.0',
      sessionId: 'sess_sys001',
      requestId: 'req_health_001',
      duration: 3200,
      dataSize: '156 KB',
      description: 'System health check detected elevated response times. Model inference latency increased by 15% compared to baseline.'
    },
    {
      id: 'audit-007',
      timestamp: new Date(Date.now() - 2100000),
      user: 'alex.chen',
      action: 'permission_change',
      resource: '/admin/users/sarah.kim/permissions',
      outcome: 'success',
      severity: 'high',
      category: 'user_management',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      sessionId: 'sess_pqr678',
      requestId: 'req_mno345',
      duration: 1100,
      dataSize: '12 KB',
      description: 'Updated user permissions for sarah.kim. Granted model configuration access and audit log viewing privileges.'
    },
    {
      id: 'audit-008',
      timestamp: new Date(Date.now() - 2400000),
      user: 'sarah.kim',
      action: 'session_delete',
      resource: '/api/sessions/sess_old123',
      outcome: 'success',
      severity: 'low',
      category: 'session_management',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_stu901',
      requestId: 'req_pqr678',
      duration: 230,
      dataSize: '4 KB',
      description: 'Deleted expired execution session. Session contained 47 execution steps and 2.3 GB of temporary data.'
    },
    {
      id: 'audit-009',
      timestamp: new Date(Date.now() - 2700000),
      user: 'mike.johnson',
      action: 'error',
      resource: '/api/models/claude/execute',
      outcome: 'failure',
      severity: 'critical',
      category: 'system_health',
      ipAddress: '192.168.1.104',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      sessionId: 'sess_vwx234',
      requestId: 'req_stu901',
      duration: 15000,
      dataSize: '0 KB',
      errorMessage: 'Model execution timeout. Connection to Claude API failed after 15 seconds.',
      description: 'Critical system error during model execution. API endpoint unresponsive, automatic failover initiated.'
    },
    {
      id: 'audit-010',
      timestamp: new Date(Date.now() - 3000000),
      user: 'lisa.wang',
      action: 'logout',
      resource: '/auth/logout',
      outcome: 'success',
      severity: 'info',
      category: 'security',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      sessionId: 'sess_yza567',
      requestId: 'req_vwx234',
      duration: 120,
      dataSize: '1 KB',
      description: 'User successfully logged out. Session duration: 3h 24m. No security anomalies detected.'
    }
  ];

  // Initialize audit logs
  useEffect(() => {
    setAuditLogs(mockAuditLogs);
    setFilteredLogs(mockAuditLogs);
  }, []);

  // Filter logs based on current filters
  useEffect(() => {
    let filtered = [...auditLogs];

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.user.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query) ||
        log.resource.toLowerCase().includes(query) ||
        log.description.toLowerCase().includes(query) ||
        (log.errorMessage && log.errorMessage.toLowerCase().includes(query))
      );
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        switch (filters.dateRange) {
          case 'today':
            return logDate >= today;
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return logDate >= yesterday && logDate < today;
          case 'last_7_days':
            const week = new Date(today);
            week.setDate(week.getDate() - 7);
            return logDate >= week;
          case 'last_30_days':
            const month = new Date(today);
            month.setDate(month.getDate() - 30);
            return logDate >= month;
          default:
            return true;
        }
      });
    }

    // User filter
    if (filters.user !== 'all') {
      filtered = filtered.filter(log => log.user === filters.user);
    }

    // Action filter
    if (filters.action !== 'all') {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    // Compliance category filter
    if (filters.compliance !== 'all') {
      filtered = filtered.filter(log => log.category === filters.compliance);
    }

    // Severity filter
    if (filters.severity !== 'all') {
      filtered = filtered.filter(log => log.severity === filters.severity);
    }

    // Outcome filter
    if (filters.outcomes && filters.outcomes.length > 0) {
      filtered = filtered.filter(log => filters.outcomes.includes(log.outcome));
    }

    // IP address filter
    if (filters.ipAddress) {
      filtered = filtered.filter(log => 
        log.ipAddress.includes(filters.ipAddress)
      );
    }

    setFilteredLogs(filtered);
  }, [auditLogs, filters]);

  // Auto-refresh functionality
  useEffect(() => {
    if (refreshRate === 'manual') return;

    const interval = setInterval(() => {
      handleRefresh();
    }, parseInt(refreshRate) * 1000);

    return () => clearInterval(interval);
  }, [refreshRate]);

  // Simulate connection status changes
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ['connected', 'connecting', 'disconnected'];
      const weights = [0.8, 0.15, 0.05]; // 80% connected, 15% connecting, 5% disconnected
      const random = Math.random();
      let cumulativeWeight = 0;
      
      for (let i = 0; i < statuses.length; i++) {
        cumulativeWeight += weights[i];
        if (random <= cumulativeWeight) {
          setConnectionStatus(statuses[i]);
          break;
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = useCallback(() => {
    // Simulate adding new audit events
    const newEvents = [
      {
        id: `audit-${Date.now()}`,
        timestamp: new Date(),
        user: 'system',
        action: 'health_check',
        resource: '/api/system/health',
        outcome: 'success',
        severity: 'info',
        category: 'system_health',
        ipAddress: '127.0.0.1',
        userAgent: 'Internal-Health-Monitor/1.0',
        sessionId: `sess_${Date.now()}`,
        requestId: `req_${Date.now()}`,
        duration: Math.floor(Math.random() * 1000) + 100,
        dataSize: '24 KB',
        description: 'Automated system health check completed successfully. All services operational.'
      }
    ];

    setAuditLogs(prev => [...newEvents, ...prev]);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      dateRange: 'all',
      user: 'all',
      action: 'all',
      compliance: 'all',
      severity: 'all',
      outcomes: [],
      ipAddress: ''
    });
  };

  const handleSaveSearch = (name, searchFilters) => {
    console.log('Save search:', name, searchFilters);
    // Implementation would save to localStorage or backend
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setShowDetailsPanel(true);
  };

  const handleCloseDetails = () => {
    setSelectedEvent(null);
    setShowDetailsPanel(false);
  };

  const handleBulkAction = (action, eventIds) => {
    console.log('Bulk action:', action, eventIds);
    // Implementation would handle bulk operations
  };

  const handleExport = async (format) => {
    console.log('Export format:', format);
    // Implementation would handle export functionality
    return new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleGenerateReport = () => {
    console.log('Generate compliance report');
    // Implementation would generate compliance report
  };

  const handleRelatedEvents = (eventId) => {
    console.log('Find related events for:', eventId);
    // Implementation would find and display related events
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <AuditHeader
          totalEvents={auditLogs.length}
          filteredEvents={filteredLogs.length}
          onRefresh={handleRefresh}
          onExport={handleExport}
          onGenerateReport={handleGenerateReport}
          refreshRate={refreshRate}
          onRefreshRateChange={setRefreshRate}
          connectionStatus={connectionStatus}
        />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <AuditFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              onSaveSearch={handleSaveSearch}
            />
          </div>

          {/* Audit Log Table */}
          <div className={`flex-1 ${showDetailsPanel ? 'w-3/5' : 'w-full'}`}>
            <AuditLogTable
              auditLogs={filteredLogs}
              onEventSelect={handleEventSelect}
              selectedEvent={selectedEvent}
              onBulkAction={handleBulkAction}
            />
          </div>

          {/* Event Details Panel */}
          {showDetailsPanel && (
            <div className="w-2/5 flex-shrink-0">
              <EventDetailsPanel
                selectedEvent={selectedEvent}
                onClose={handleCloseDetails}
                onRelatedEvents={handleRelatedEvents}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditTrailViewer;