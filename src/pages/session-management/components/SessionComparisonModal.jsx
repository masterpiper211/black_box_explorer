import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const SessionComparisonModal = ({ 
  isOpen, 
  onClose, 
  sessions, 
  selectedSessions,
  onCompare 
}) => {
  const [comparisonSessions, setComparisonSessions] = useState([]);
  const [comparisonType, setComparisonType] = useState('execution');

  const comparisonTypes = [
    { value: 'execution', label: 'Execution Flow' },
    { value: 'performance', label: 'Performance Metrics' },
    { value: 'tokens', label: 'Token Usage' },
    { value: 'errors', label: 'Error Analysis' }
  ];

  const sessionOptions = sessions.map(session => ({
    value: session.id,
    label: `${session.name} (${session.createdAt.toLocaleDateString()})`
  }));

  const handleAddSession = (sessionId) => {
    if (comparisonSessions.length < 4 && !comparisonSessions.includes(sessionId)) {
      setComparisonSessions([...comparisonSessions, sessionId]);
    }
  };

  const handleRemoveSession = (sessionId) => {
    setComparisonSessions(comparisonSessions.filter(id => id !== sessionId));
  };

  const handleCompare = () => {
    if (comparisonSessions.length >= 2) {
      onCompare(comparisonSessions, comparisonType);
      onClose();
    }
  };

  const getSessionById = (id) => sessions.find(s => s.id === id);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-card border border-border rounded-lg shadow-modal w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Compare Sessions</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select 2-4 sessions to compare side by side
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Comparison Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Comparison Type
            </label>
            <Select
              options={comparisonTypes}
              value={comparisonType}
              onChange={setComparisonType}
              className="w-full"
            />
          </div>

          {/* Session Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Add Sessions to Compare ({comparisonSessions.length}/4)
            </label>
            <Select
              options={sessionOptions.filter(opt => !comparisonSessions.includes(opt.value))}
              value=""
              onChange={handleAddSession}
              placeholder="Select a session to add"
              className="w-full"
            />
          </div>

          {/* Selected Sessions */}
          {comparisonSessions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Selected Sessions
              </label>
              <div className="space-y-2">
                {comparisonSessions.map((sessionId) => {
                  const session = getSessionById(sessionId);
                  if (!session) return null;
                  
                  return (
                    <div
                      key={sessionId}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                          <Icon name="BarChart3" size={16} className="text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{session.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {session.model} • {session.createdAt.toLocaleDateString()} • 
                            {session.tokens.toLocaleString()} tokens
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSession(sessionId)}
                        iconName="X"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Comparison Preview */}
          {comparisonSessions.length >= 2 && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Eye" size={16} className="text-accent" />
                <span className="font-medium text-foreground">Comparison Preview</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You'll see a side-by-side comparison of {comparisonType} data for the selected sessions.
                This includes detailed metrics, execution flows, and performance differences.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {comparisonSessions.length < 2 && 'Select at least 2 sessions to compare'}
            {comparisonSessions.length >= 2 && `Ready to compare ${comparisonSessions.length} sessions`}
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleCompare}
              disabled={comparisonSessions.length < 2}
              iconName="GitCompare"
              iconPosition="left"
            >
              Compare Sessions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionComparisonModal;