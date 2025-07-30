import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const RetentionPolicyPanel = ({ 
  retentionPolicies, 
  onUpdatePolicy, 
  onExtendRetention,
  sessionsNearExpiry 
}) => {
  const [selectedPolicy, setSelectedPolicy] = useState('default');
  const [showExtensionModal, setShowExtensionModal] = useState(false);

  const policyOptions = [
    { value: 'default', label: 'Default (90 days)' },
    { value: 'extended', label: 'Extended (180 days)' },
    { value: 'permanent', label: 'Permanent' },
    { value: 'custom', label: 'Custom' }
  ];

  const extensionOptions = [
    { value: '30', label: '30 days' },
    { value: '60', label: '60 days' },
    { value: '90', label: '90 days' },
    { value: '180', label: '180 days' }
  ];

  const formatTimeRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    if (diffDays < 7) return `${diffDays} days left`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks left`;
    return `${Math.ceil(diffDays / 30)} months left`;
  };

  const getExpiryColor = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-error';
    if (diffDays <= 7) return 'text-error';
    if (diffDays <= 30) return 'text-warning';
    return 'text-success';
  };

  const handleBulkExtension = (days) => {
    const sessionIds = sessionsNearExpiry.map(s => s.id);
    onExtendRetention(sessionIds, parseInt(days));
    setShowExtensionModal(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Retention Policies</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Manage session lifecycle and expiration
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExtensionModal(true)}
            iconName="Clock"
            iconPosition="left"
            disabled={sessionsNearExpiry.length === 0}
          >
            Bulk Extend ({sessionsNearExpiry.length})
          </Button>
        </div>
      </div>

      {/* Policy Configuration */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="font-medium text-foreground">Active Sessions</span>
            </div>
            <div className="text-2xl font-bold text-success">1,247</div>
            <div className="text-sm text-muted-foreground">Within retention period</div>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="font-medium text-foreground">Expiring Soon</span>
            </div>
            <div className="text-2xl font-bold text-warning">{sessionsNearExpiry.length}</div>
            <div className="text-sm text-muted-foreground">Within 30 days</div>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Archive" size={16} className="text-muted-foreground" />
              <span className="font-medium text-foreground">Archived</span>
            </div>
            <div className="text-2xl font-bold text-muted-foreground">342</div>
            <div className="text-sm text-muted-foreground">Past retention period</div>
          </div>
        </div>
      </div>

      {/* Sessions Near Expiry */}
      {sessionsNearExpiry.length > 0 && (
        <div className="p-4">
          <h4 className="font-medium text-foreground mb-3">Sessions Expiring Soon</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sessionsNearExpiry.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                    <Icon name="Clock" size={16} className="text-warning" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{session.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {session.model} • {session.user}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getExpiryColor(session.expiryDate)}`}>
                    {formatTimeRemaining(session.expiryDate)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(session.expiryDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Extension Modal */}
      {showExtensionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowExtensionModal(false)}></div>
          <div className="relative bg-card border border-border rounded-lg shadow-modal w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Extend Retention</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowExtensionModal(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Extend retention period for {sessionsNearExpiry.length} sessions expiring soon.
              </p>

              <div className="space-y-3">
                {extensionOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleBulkExtension(option.value)}
                  >
                    <Icon name="Clock" size={16} className="mr-2" />
                    Extend by {option.label}
                  </Button>
                ))}
              </div>

              <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-md">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-warning mt-0.5" />
                  <div className="text-sm">
                    <p className="text-foreground font-medium">Extension Policy</p>
                    <p className="text-muted-foreground mt-1">
                      Extensions are logged for audit purposes and may require approval for permanent retention.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetentionPolicyPanel;