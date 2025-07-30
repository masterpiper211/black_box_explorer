import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfigurationTabs = ({ activeTab, onTabChange, modelCount, endpointCount, hasUnsavedChanges }) => {
  const tabs = [
    {
      id: 'models',
      label: 'Models',
      icon: 'Bot',
      count: modelCount,
      description: 'AI model configurations and settings'
    },
    {
      id: 'endpoints',
      label: 'API Endpoints',
      icon: 'Globe',
      count: endpointCount,
      description: 'API connection management and monitoring'
    },
    {
      id: 'parameters',
      label: 'Parameters',
      icon: 'Settings',
      description: 'Model parameter configuration and templates'
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: 'FileText',
      description: 'Configuration templates and presets'
    },
    {
      id: 'monitoring',
      label: 'Monitoring',
      icon: 'Activity',
      description: 'Performance monitoring and health checks'
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      description: 'Access control and security settings'
    }
  ];

  const handleTabClick = (tabId) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to switch tabs?');
      if (!confirmed) return;
    }
    onTabChange(tabId);
  };

  return (
    <div className="border-b border-border bg-surface">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title={tab.description}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  activeTab === tab.id
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {tab.count}
                </span>
              )}
              {hasUnsavedChanges && activeTab === tab.id && (
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse" title="Unsaved changes" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {hasUnsavedChanges && (
            <div className="flex items-center space-x-2 text-warning">
              <Icon name="AlertCircle" size={16} />
              <span className="text-sm font-medium">Unsaved changes</span>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export Config
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Upload"
            iconPosition="left"
          >
            Import Config
          </Button>
        </div>
      </div>

      {/* Tab Description */}
      <div className="px-6 pb-4">
        <p className="text-sm text-muted-foreground">
          {tabs.find(tab => tab.id === activeTab)?.description}
        </p>
      </div>
    </div>
  );
};

export default ConfigurationTabs;