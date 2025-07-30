import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import SessionGrid from './components/SessionGrid';
import SessionSidebar from './components/SessionSidebar';
import BulkOperationsToolbar from './components/BulkOperationsToolbar';
import SessionComparisonModal from './components/SessionComparisonModal';
import RetentionPolicyPanel from './components/RetentionPolicyPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [filters, setFilters] = useState({
    status: 'all',
    model: 'all',
    user: 'all'
  });
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showRetentionPanel, setShowRetentionPanel] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Mock data
  const mockSessions = [
    {
      id: "sess_001",
      name: "Customer Support Chatbot Analysis",
      description: "Multi-turn conversation analysis with sentiment tracking",
      model: "gpt-4",
      user: "alex.chen",
      createdAt: new Date(2025, 6, 29, 14, 30),
      duration: 245,
      tokens: 15420,
      status: "completed",
      tags: ["production", "chatbot", "analysis"],
      expiryDate: new Date(2025, 9, 27),
      folderId: "folder_001"
    },
    {
      id: "sess_002", 
      name: "Code Generation Pipeline Test",
      description: "Testing automated code generation with multiple programming languages",
      model: "gpt-3.5-turbo",
      user: "sarah.kim",
      createdAt: new Date(2025, 6, 29, 10, 15),
      duration: 180,
      tokens: 8750,
      status: "running",
      tags: ["development", "code-gen", "testing"],
      expiryDate: new Date(2025, 9, 25),
      folderId: "folder_002"
    },
    {
      id: "sess_003",
      name: "Document Summarization Workflow",
      description: "Large document processing with hierarchical summarization",
      model: "claude-3",
      user: "mike.johnson",
      createdAt: new Date(2025, 6, 28, 16, 45),
      duration: 420,
      tokens: 32100,
      status: "failed",
      tags: ["documents", "summarization", "enterprise"],
      expiryDate: new Date(2025, 8, 15),
      folderId: "folder_001"
    },
    {
      id: "sess_004",
      name: "Multi-Agent Reasoning Chain",
      description: "Complex reasoning task with multiple AI agents collaborating",
      model: "gpt-4",
      user: "emma.davis",
      createdAt: new Date(2025, 6, 28, 9, 20),
      duration: 680,
      tokens: 45600,
      status: "completed",
      tags: ["multi-agent", "reasoning", "research"],
      expiryDate: new Date(2025, 10, 1),
      folderId: "folder_003"
    },
    {
      id: "sess_005",
      name: "Real-time Translation Service",
      description: "Live translation with context preservation across languages",
      model: "llama-2",
      user: "alex.chen",
      createdAt: new Date(2025, 6, 27, 13, 10),
      duration: 95,
      tokens: 5200,
      status: "cancelled",
      tags: ["translation", "real-time", "multilingual"],
      expiryDate: new Date(2025, 8, 20),
      folderId: "folder_002"
    },
    {
      id: "sess_006",
      name: "Financial Data Analysis Pipeline",
      description: "Automated financial report generation with trend analysis",
      model: "gpt-4",
      user: "sarah.kim",
      createdAt: new Date(2025, 6, 27, 11, 30),
      duration: 310,
      tokens: 22800,
      status: "completed",
      tags: ["finance", "analysis", "reports"],
      expiryDate: new Date(2025, 9, 30),
      folderId: "folder_001"
    }
  ];

  const mockFolders = [
    { id: "all", name: "All Sessions", type: "system", sessionCount: 6 },
    { id: "folder_001", name: "Production Workflows", type: "user", sessionCount: 3 },
    { id: "folder_002", name: "Development & Testing", type: "user", sessionCount: 2 },
    { id: "folder_003", name: "Research Projects", type: "user", sessionCount: 1 }
  ];

  const mockFavorites = [
    mockSessions[0],
    mockSessions[3]
  ];

  const mockSmartCollections = [
    { id: "recent", name: "Recent Sessions", type: "recent", count: 3 },
    { id: "running", name: "Currently Running", type: "running", count: 1 },
    { id: "failed", name: "Failed Sessions", type: "failed", count: 1 },
    { id: "archived", name: "Archived", type: "archived", count: 0 }
  ];

  const viewModeOptions = [
    { value: 'grid', label: 'Grid View' },
    { value: 'list', label: 'List View' },
    { value: 'timeline', label: 'Timeline View' }
  ];

  useEffect(() => {
    setSessions(mockSessions);
  }, []);

  useEffect(() => {
    let filtered = [...sessions];

    // Apply folder filter
    if (selectedFolder !== 'all') {
      if (selectedFolder === 'recent') {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        filtered = filtered.filter(s => s.createdAt >= threeDaysAgo);
      } else if (selectedFolder === 'running') {
        filtered = filtered.filter(s => s.status === 'running');
      } else if (selectedFolder === 'failed') {
        filtered = filtered.filter(s => s.status === 'failed');
      } else {
        filtered = filtered.filter(s => s.folderId === selectedFolder);
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.description?.toLowerCase().includes(query) ||
        s.tags.some(tag => tag.toLowerCase().includes(query)) ||
        s.user.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(s => s.status === filters.status);
    }

    // Apply model filter
    if (filters.model !== 'all') {
      filtered = filtered.filter(s => s.model === filters.model);
    }

    // Apply user filter
    if (filters.user !== 'all') {
      filtered = filtered.filter(s => s.user === filters.user);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredSessions(filtered);
  }, [sessions, selectedFolder, searchQuery, filters, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSessionEdit = (updatedSession) => {
    setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
  };

  const handleSessionView = (session) => {
    console.log('Viewing session:', session);
    // Navigate to session details or open modal
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for sessions:`, selectedSessions);
    
    switch (action) {
      case 'delete':
        setSessions(prev => prev.filter(s => !selectedSessions.includes(s.id)));
        setSelectedSessions([]);
        break;
      case 'archive':
        setSessions(prev => prev.map(s => 
          selectedSessions.includes(s.id) ? { ...s, status: 'archived' } : s
        ));
        setSelectedSessions([]);
        break;
      default:
        break;
    }
  };

  const handleExport = (format) => {
    console.log(`Exporting ${selectedSessions.length} sessions as ${format}`);
    // Implement export logic
  };

  const handleBulkTag = (tag) => {
    setSessions(prev => prev.map(s => 
      selectedSessions.includes(s.id) 
        ? { ...s, tags: [...new Set([...s.tags, tag])] }
        : s
    ));
  };

  const handleCreateFolder = (name) => {
    console.log('Creating folder:', name);
    // Implement folder creation
  };

  const handleDeleteFolder = (folderId) => {
    console.log('Deleting folder:', folderId);
    // Implement folder deletion
  };

  const handleToggleFavorite = (sessionId) => {
    console.log('Toggling favorite for session:', sessionId);
    // Implement favorite toggle
  };

  const handleCompareSession = (sessionIds, comparisonType) => {
    console.log('Comparing sessions:', sessionIds, 'Type:', comparisonType);
    // Navigate to comparison view
  };

  const handleExtendRetention = (sessionIds, days) => {
    console.log(`Extending retention for ${sessionIds.length} sessions by ${days} days`);
    // Implement retention extension
  };

  const sessionsNearExpiry = sessions.filter(s => {
    const now = new Date();
    const expiry = new Date(s.expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <div className="w-80 flex-shrink-0">
            <SessionSidebar
              folders={mockFolders}
              favorites={mockFavorites}
              smartCollections={mockSmartCollections}
              selectedFolder={selectedFolder}
              onFolderSelect={setSelectedFolder}
              onCreateFolder={handleCreateFolder}
              onDeleteFolder={handleDeleteFolder}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header Actions */}
            <div className="p-6 border-b border-border bg-surface">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Session Management</h1>
                  <p className="text-muted-foreground mt-1">
                    Manage and organize your AI execution sessions
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Select
                    options={viewModeOptions}
                    value={viewMode}
                    onChange={setViewMode}
                    className="w-36"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowRetentionPanel(!showRetentionPanel)}
                    iconName="Clock"
                    iconPosition="left"
                  >
                    Retention
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowComparisonModal(true)}
                    iconName="GitCompare"
                    iconPosition="left"
                    disabled={selectedSessions.length < 2}
                  >
                    Compare
                  </Button>
                  <Button
                    iconName="Plus"
                    iconPosition="left"
                  >
                    New Session
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Database" size={20} className="text-primary" />
                    <span className="font-medium text-foreground">Total Sessions</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mt-2">{sessions.length}</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Play" size={20} className="text-warning" />
                    <span className="font-medium text-foreground">Running</span>
                  </div>
                  <div className="text-2xl font-bold text-warning mt-2">
                    {sessions.filter(s => s.status === 'running').length}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={20} className="text-success" />
                    <span className="font-medium text-foreground">Completed</span>
                  </div>
                  <div className="text-2xl font-bold text-success mt-2">
                    {sessions.filter(s => s.status === 'completed').length}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertTriangle" size={20} className="text-error" />
                    <span className="font-medium text-foreground">Failed</span>
                  </div>
                  <div className="text-2xl font-bold text-error mt-2">
                    {sessions.filter(s => s.status === 'failed').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full p-6 space-y-6">
                {/* Retention Panel */}
                {showRetentionPanel && (
                  <RetentionPolicyPanel
                    retentionPolicies={{}}
                    onUpdatePolicy={() => {}}
                    onExtendRetention={handleExtendRetention}
                    sessionsNearExpiry={sessionsNearExpiry}
                  />
                )}

                {/* Bulk Operations */}
                <BulkOperationsToolbar
                  selectedCount={selectedSessions.length}
                  onBulkAction={handleBulkAction}
                  onClearSelection={() => setSelectedSessions([])}
                  onExport={handleExport}
                  onBulkTag={handleBulkTag}
                />

                {/* Session Grid */}
                <div className="flex-1 overflow-hidden">
                  <SessionGrid
                    sessions={filteredSessions}
                    selectedSessions={selectedSessions}
                    onSelectionChange={setSelectedSessions}
                    onSessionEdit={handleSessionEdit}
                    onSessionView={handleSessionView}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    filters={filters}
                    onFilterChange={setFilters}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      <SessionComparisonModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        sessions={sessions}
        selectedSessions={selectedSessions}
        onCompare={handleCompareSession}
      />
    </div>
  );
};

export default SessionManagement;