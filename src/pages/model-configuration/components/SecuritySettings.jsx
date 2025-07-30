import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SecuritySettings = ({ onSecurityUpdate }) => {
  const [accessControl, setAccessControl] = useState({
    enableRBAC: true,
    requireMFA: false,
    sessionTimeout: 3600,
    maxFailedAttempts: 5,
    lockoutDuration: 900
  });

  const [apiSecurity, setApiSecurity] = useState({
    enableRateLimit: true,
    rateLimitPerMinute: 1000,
    enableIPWhitelist: false,
    whitelistedIPs: [],
    requireAPIKeyRotation: true,
    keyRotationDays: 90
  });

  const [dataProtection, setDataProtection] = useState({
    encryptAtRest: true,
    encryptInTransit: true,
    enableAuditLog: true,
    logRetentionDays: 365,
    enableDataMasking: true,
    piiDetection: true
  });

  const [complianceSettings, setComplianceSettings] = useState({
    gdprCompliance: true,
    hipaaCompliance: false,
    sox404Compliance: false,
    enableDataResidency: false,
    dataRegion: 'us-east-1'
  });

  const [newIPAddress, setNewIPAddress] = useState('');
  const [activeUsers, setActiveUsers] = useState([
    {
      id: 1,
      name: 'Alex Chen',
      email: 'alex.chen@company.com',
      role: 'Admin',
      lastLogin: '2025-01-30 08:45:00',
      status: 'active',
      permissions: ['read', 'write', 'delete', 'admin']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      role: 'Engineer',
      lastLogin: '2025-01-30 07:30:00',
      status: 'active',
      permissions: ['read', 'write']
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@company.com',
      role: 'Viewer',
      lastLogin: '2025-01-29 16:20:00',
      status: 'inactive',
      permissions: ['read']
    }
  ]);

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'engineer', label: 'ML Engineer' },
    { value: 'analyst', label: 'Data Analyst' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const regionOptions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'Europe (Ireland)' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' }
  ];

  const handleAddIPAddress = () => {
    if (newIPAddress && !apiSecurity.whitelistedIPs.includes(newIPAddress)) {
      setApiSecurity(prev => ({
        ...prev,
        whitelistedIPs: [...prev.whitelistedIPs, newIPAddress]
      }));
      setNewIPAddress('');
    }
  };

  const handleRemoveIPAddress = (ip) => {
    setApiSecurity(prev => ({
      ...prev,
      whitelistedIPs: prev.whitelistedIPs.filter(address => address !== ip)
    }));
  };

  const handleUserRoleChange = (userId, newRole) => {
    setActiveUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleUserStatusToggle = (userId) => {
    setActiveUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const getStatusColor = (status) => {
    return status === 'active' ?'text-success bg-success/10' :'text-muted-foreground bg-muted';
  };

  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'text-error bg-error/10';
      case 'engineer': return 'text-accent bg-accent/10';
      case 'analyst': return 'text-warning bg-warning/10';
      case 'viewer': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-foreground">Security & Access Control</h3>
          <p className="text-sm text-muted-foreground">Manage security settings and user permissions</p>
        </div>
        <Button
          onClick={() => onSecurityUpdate({ accessControl, apiSecurity, dataProtection, complianceSettings })}
          iconName="Shield"
          iconPosition="left"
        >
          Save Security Settings
        </Button>
      </div>

      {/* Access Control */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="font-medium text-foreground mb-4 flex items-center">
          <Icon name="Users" size={20} className="mr-2" />
          Access Control
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Checkbox
              label="Enable Role-Based Access Control (RBAC)"
              checked={accessControl.enableRBAC}
              onChange={(e) => setAccessControl(prev => ({ ...prev, enableRBAC: e.target.checked }))}
              description="Control access based on user roles and permissions"
            />
            
            <Checkbox
              label="Require Multi-Factor Authentication"
              checked={accessControl.requireMFA}
              onChange={(e) => setAccessControl(prev => ({ ...prev, requireMFA: e.target.checked }))}
              description="Add an extra layer of security with MFA"
            />
            
            <Input
              label="Session Timeout (seconds)"
              type="number"
              min="300"
              max="86400"
              value={accessControl.sessionTimeout}
              onChange={(e) => setAccessControl(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
              description="Automatic logout after inactivity"
            />
          </div>
          
          <div className="space-y-4">
            <Input
              label="Max Failed Login Attempts"
              type="number"
              min="1"
              max="10"
              value={accessControl.maxFailedAttempts}
              onChange={(e) => setAccessControl(prev => ({ ...prev, maxFailedAttempts: parseInt(e.target.value) }))}
              description="Account lockout threshold"
            />
            
            <Input
              label="Lockout Duration (seconds)"
              type="number"
              min="60"
              max="3600"
              value={accessControl.lockoutDuration}
              onChange={(e) => setAccessControl(prev => ({ ...prev, lockoutDuration: parseInt(e.target.value) }))}
              description="How long accounts remain locked"
            />
          </div>
        </div>
      </div>

      {/* API Security */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="font-medium text-foreground mb-4 flex items-center">
          <Icon name="Key" size={20} className="mr-2" />
          API Security
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Checkbox
              label="Enable Rate Limiting"
              checked={apiSecurity.enableRateLimit}
              onChange={(e) => setApiSecurity(prev => ({ ...prev, enableRateLimit: e.target.checked }))}
              description="Limit API requests per time period"
            />
            
            <Input
              label="Rate Limit (requests per minute)"
              type="number"
              min="1"
              max="10000"
              value={apiSecurity.rateLimitPerMinute}
              onChange={(e) => setApiSecurity(prev => ({ ...prev, rateLimitPerMinute: parseInt(e.target.value) }))}
              disabled={!apiSecurity.enableRateLimit}
            />
            
            <Checkbox
              label="Enable IP Whitelist"
              checked={apiSecurity.enableIPWhitelist}
              onChange={(e) => setApiSecurity(prev => ({ ...prev, enableIPWhitelist: e.target.checked }))}
              description="Restrict access to specific IP addresses"
            />
          </div>
          
          <div className="space-y-4">
            <Checkbox
              label="Require API Key Rotation"
              checked={apiSecurity.requireAPIKeyRotation}
              onChange={(e) => setApiSecurity(prev => ({ ...prev, requireAPIKeyRotation: e.target.checked }))}
              description="Automatically rotate API keys"
            />
            
            <Input
              label="Key Rotation Period (days)"
              type="number"
              min="7"
              max="365"
              value={apiSecurity.keyRotationDays}
              onChange={(e) => setApiSecurity(prev => ({ ...prev, keyRotationDays: parseInt(e.target.value) }))}
              disabled={!apiSecurity.requireAPIKeyRotation}
            />
          </div>
        </div>

        {/* IP Whitelist Management */}
        {apiSecurity.enableIPWhitelist && (
          <div className="mt-6 pt-6 border-t border-border">
            <h5 className="font-medium text-foreground mb-3">IP Whitelist Management</h5>
            
            <div className="flex space-x-2 mb-4">
              <Input
                value={newIPAddress}
                onChange={(e) => setNewIPAddress(e.target.value)}
                placeholder="Enter IP address (e.g., 192.168.1.1)"
                className="flex-1"
              />
              <Button
                onClick={handleAddIPAddress}
                disabled={!newIPAddress}
                iconName="Plus"
              />
            </div>
            
            <div className="space-y-2">
              {apiSecurity.whitelistedIPs.map((ip, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="font-mono text-sm text-foreground">{ip}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveIPAddress(ip)}
                    iconName="Trash2"
                    className="text-error hover:text-error"
                  />
                </div>
              ))}
              
              {apiSecurity.whitelistedIPs.length === 0 && (
                <p className="text-sm text-muted-foreground">No IP addresses whitelisted</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Data Protection */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="font-medium text-foreground mb-4 flex items-center">
          <Icon name="Lock" size={20} className="mr-2" />
          Data Protection
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Checkbox
              label="Encrypt Data at Rest"
              checked={dataProtection.encryptAtRest}
              onChange={(e) => setDataProtection(prev => ({ ...prev, encryptAtRest: e.target.checked }))}
              description="Encrypt stored data using AES-256"
            />
            
            <Checkbox
              label="Encrypt Data in Transit"
              checked={dataProtection.encryptInTransit}
              onChange={(e) => setDataProtection(prev => ({ ...prev, encryptInTransit: e.target.checked }))}
              description="Use TLS 1.3 for all communications"
            />
            
            <Checkbox
              label="Enable Audit Logging"
              checked={dataProtection.enableAuditLog}
              onChange={(e) => setDataProtection(prev => ({ ...prev, enableAuditLog: e.target.checked }))}
              description="Log all user actions and system events"
            />
          </div>
          
          <div className="space-y-4">
            <Input
              label="Log Retention Period (days)"
              type="number"
              min="30"
              max="2555"
              value={dataProtection.logRetentionDays}
              onChange={(e) => setDataProtection(prev => ({ ...prev, logRetentionDays: parseInt(e.target.value) }))}
              disabled={!dataProtection.enableAuditLog}
            />
            
            <Checkbox
              label="Enable Data Masking"
              checked={dataProtection.enableDataMasking}
              onChange={(e) => setDataProtection(prev => ({ ...prev, enableDataMasking: e.target.checked }))}
              description="Mask sensitive data in logs and exports"
            />
            
            <Checkbox
              label="PII Detection"
              checked={dataProtection.piiDetection}
              onChange={(e) => setDataProtection(prev => ({ ...prev, piiDetection: e.target.checked }))}
              description="Automatically detect and protect PII"
            />
          </div>
        </div>
      </div>

      {/* Compliance */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="font-medium text-foreground mb-4 flex items-center">
          <Icon name="FileCheck" size={20} className="mr-2" />
          Compliance Settings
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Checkbox
              label="GDPR Compliance"
              checked={complianceSettings.gdprCompliance}
              onChange={(e) => setComplianceSettings(prev => ({ ...prev, gdprCompliance: e.target.checked }))}
              description="Enable GDPR data protection features"
            />
            
            <Checkbox
              label="HIPAA Compliance"
              checked={complianceSettings.hipaaCompliance}
              onChange={(e) => setComplianceSettings(prev => ({ ...prev, hipaaCompliance: e.target.checked }))}
              description="Enable healthcare data protection"
            />
            
            <Checkbox
              label="SOX 404 Compliance"
              checked={complianceSettings.sox404Compliance}
              onChange={(e) => setComplianceSettings(prev => ({ ...prev, sox404Compliance: e.target.checked }))}
              description="Enable financial reporting controls"
            />
          </div>
          
          <div className="space-y-4">
            <Checkbox
              label="Enable Data Residency"
              checked={complianceSettings.enableDataResidency}
              onChange={(e) => setComplianceSettings(prev => ({ ...prev, enableDataResidency: e.target.checked }))}
              description="Control where data is stored geographically"
            />
            
            <Select
              label="Data Region"
              options={regionOptions}
              value={complianceSettings.dataRegion}
              onChange={(value) => setComplianceSettings(prev => ({ ...prev, dataRegion: value }))}
              disabled={!complianceSettings.enableDataResidency}
            />
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-foreground flex items-center">
            <Icon name="UserCheck" size={20} className="mr-2" />
            User Management
          </h4>
          <Button
            variant="outline"
            size="sm"
            iconName="UserPlus"
            iconPosition="left"
          >
            Add User
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                <th className="text-left p-3 font-medium text-foreground">User</th>
                <th className="text-left p-3 font-medium text-foreground">Role</th>
                <th className="text-left p-3 font-medium text-foreground">Last Login</th>
                <th className="text-left p-3 font-medium text-foreground">Status</th>
                <th className="text-left p-3 font-medium text-foreground">Permissions</th>
                <th className="text-right p-3 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/30">
                  <td className="p-3">
                    <div>
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{user.lastLogin}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((permission, index) => (
                        <span key={index} className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUserStatusToggle(user.id)}
                        iconName={user.status === 'active' ? 'UserX' : 'UserCheck'}
                        className={user.status === 'active' ? 'text-warning hover:text-warning' : 'text-success hover:text-success'}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        className="text-error hover:text-error"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;