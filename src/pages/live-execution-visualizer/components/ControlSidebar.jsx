import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ControlSidebar = ({
  isPlaying,
  onPlayPause,
  onStop,
  onRestart,
  currentStep,
  totalSteps,
  onStepChange,
  playbackSpeed,
  onSpeedChange,
  showNodeTypes,
  onNodeTypeToggle,
  performanceThreshold,
  onPerformanceThresholdChange,
  onExport,
  executionMode,
  onExecutionModeChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSession, setActiveSession] = useState('session-1');

  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
    { value: 3, label: '3x' }
  ];

  const executionModeOptions = [
    { value: 'live', label: 'Live Execution' },
    { value: 'replay', label: 'Replay Mode' },
    { value: 'debug', label: 'Debug Mode' }
  ];

  const sessionOptions = [
    { value: 'session-1', label: 'Customer Sentiment Analysis' },
    { value: 'session-2', label: 'Product Recommendation' },
    { value: 'session-3', label: 'Content Generation' }
  ];

  const exportOptions = [
    { value: 'pdf', label: 'Export as PDF' },
    { value: 'png', label: 'Export as PNG' },
    { value: 'html', label: 'Export as HTML' },
    { value: 'json', label: 'Export Data (JSON)' }
  ];

  const handleExportClick = (format) => {
    onExport(format);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="mb-4"
        >
          <Icon name="ChevronRight" size={20} />
        </Button>
        
        <div className="flex flex-col space-y-2">
          <Button
            variant={isPlaying ? "default" : "outline"}
            size="icon"
            onClick={onPlayPause}
          >
            <Icon name={isPlaying ? "Pause" : "Play"} size={16} />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onStop}
          >
            <Icon name="Square" size={16} />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onRestart}
          >
            <Icon name="RotateCcw" size={16} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Execution Controls</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Live Session Active</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Session Selection */}
        <div className="p-4 border-b border-gray-100">
          <Select
            label="Active Session"
            options={sessionOptions}
            value={activeSession}
            onChange={setActiveSession}
            className="mb-3"
          />
          
          <Select
            label="Execution Mode"
            options={executionModeOptions}
            value={executionMode}
            onChange={onExecutionModeChange}
          />
        </div>

        {/* Playback Controls */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Playback Controls</h3>
          
          <div className="flex items-center space-x-2 mb-4">
            <Button
              variant={isPlaying ? "default" : "outline"}
              size="sm"
              onClick={onPlayPause}
              className="flex-1"
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={16} className="mr-2" />
              {isPlaying ? "Pause" : "Play"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onStop}
            >
              <Icon name="Square" size={16} />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onRestart}
            >
              <Icon name="RotateCcw" size={16} />
            </Button>
          </div>

          {/* Timeline Scrubber */}
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-700 mb-2 block">
              Timeline ({currentStep + 1} / {totalSteps})
            </label>
            <input
              type="range"
              min="0"
              max={totalSteps - 1}
              value={currentStep}
              onChange={(e) => onStepChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Start</span>
              <span>End</span>
            </div>
          </div>

          {/* Playback Speed */}
          <Select
            label="Playback Speed"
            options={speedOptions}
            value={playbackSpeed}
            onChange={onSpeedChange}
          />
        </div>

        {/* Filtering Options */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Display Filters</h3>
          
          <div className="space-y-3 mb-4">
            <Checkbox
              label="Prompt Nodes"
              checked={showNodeTypes.prompt}
              onChange={(e) => onNodeTypeToggle('prompt', e.target.checked)}
            />
            <Checkbox
              label="Model Nodes"
              checked={showNodeTypes.model}
              onChange={(e) => onNodeTypeToggle('model', e.target.checked)}
            />
            <Checkbox
              label="Tool Nodes"
              checked={showNodeTypes.tool}
              onChange={(e) => onNodeTypeToggle('tool', e.target.checked)}
            />
            <Checkbox
              label="Memory Nodes"
              checked={showNodeTypes.memory}
              onChange={(e) => onNodeTypeToggle('memory', e.target.checked)}
            />
            <Checkbox
              label="Output Nodes"
              checked={showNodeTypes.output}
              onChange={(e) => onNodeTypeToggle('output', e.target.checked)}
            />
          </div>

          <Input
            label="Performance Threshold (ms)"
            type="number"
            value={performanceThreshold}
            onChange={(e) => onPerformanceThresholdChange(parseInt(e.target.value) || 0)}
            placeholder="0"
            description="Hide nodes with latency below threshold"
          />
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
          
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* Reset filters */}}
              className="w-full justify-start"
            >
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Reset Filters
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* Center view */}}
              className="w-full justify-start"
            >
              <Icon name="Target" size={16} className="mr-2" />
              Center View
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* Fit to screen */}}
              className="w-full justify-start"
            >
              <Icon name="Maximize2" size={16} className="mr-2" />
              Fit to Screen
            </Button>
          </div>
        </div>

        {/* Export Options */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Export Options</h3>
          
          <div className="space-y-2">
            {exportOptions.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                size="sm"
                onClick={() => handleExportClick(option.value)}
                className="w-full justify-start"
              >
                <Icon 
                  name={
                    option.value === 'pdf' ? 'FileText' :
                    option.value === 'png' ? 'Image' :
                    option.value === 'html'? 'Globe' : 'Download'
                  } 
                  size={16} 
                  className="mr-2" 
                />
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={14} />
            <span>Real-time</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlSidebar;