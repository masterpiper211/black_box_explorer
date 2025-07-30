import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TimelineView = ({
  isPlaying,
  currentStep,
  totalSteps,
  onStepChange,
  onPlayPause,
  executionData,
  playbackSpeed
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredStep, setHoveredStep] = useState(null);

  // Mock timeline data
  const timelineSteps = [
    {
      id: 0,
      title: 'Initial Prompt',
      type: 'prompt',
      timestamp: new Date(Date.now() - 5000),
      duration: 45,
      status: 'completed'
    },
    {
      id: 1,
      title: 'GPT-4 Processing',
      type: 'model',
      timestamp: new Date(Date.now() - 4500),
      duration: 1250,
      status: currentStep >= 1 ? 'completed' : 'pending'
    },
    {
      id: 2,
      title: 'Sentiment API & Memory',
      type: 'parallel',
      timestamp: new Date(Date.now() - 3000),
      duration: 320,
      status: currentStep >= 2 ? 'completed' : currentStep === 1 ? 'processing' : 'pending'
    },
    {
      id: 3,
      title: 'Response Generation',
      type: 'model',
      timestamp: new Date(Date.now() - 2000),
      duration: 890,
      status: currentStep >= 3 ? 'completed' : currentStep === 2 ? 'processing' : 'pending'
    },
    {
      id: 4,
      title: 'Final Output',
      type: 'output',
      timestamp: new Date(Date.now() - 500),
      duration: 0,
      status: currentStep >= 4 ? 'completed' : 'pending'
    }
  ];

  const getStepColor = (type, status) => {
    const baseColors = {
      prompt: 'blue',
      model: 'green',
      tool: 'orange',
      parallel: 'purple',
      output: 'gray',
      error: 'red'
    };
    
    const color = baseColors[type] || 'gray';
    
    if (status === 'completed') return `bg-${color}-500`;
    if (status === 'processing') return `bg-${color}-400 animate-pulse`;
    return `bg-${color}-200`;
  };

  const getStepIcon = (type) => {
    const icons = {
      prompt: 'MessageSquare',
      model: 'Brain',
      tool: 'Wrench',
      parallel: 'GitBranch',
      output: 'Send',
      error: 'AlertTriangle'
    };
    return icons[type] || 'Circle';
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const calculateProgress = () => {
    return ((currentStep + 1) / totalSteps) * 100;
  };

  if (!isExpanded) {
    return (
      <div className="h-16 bg-white border-t border-gray-200 flex items-center px-6">
        <div className="flex items-center space-x-4 flex-1">
          {/* Playback Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPlayPause}
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={16} />
            </Button>
            
            <span className="text-sm text-gray-600 min-w-[80px]">
              {currentStep + 1} / {totalSteps}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 mx-4">
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
              
              {/* Step Markers */}
              <div className="absolute inset-0 flex justify-between items-center">
                {timelineSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => onStepChange(index)}
                    className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-200 ${
                      getStepColor(step.type, step.status)
                    } ${index === currentStep ? 'scale-125' : 'hover:scale-110'}`}
                    style={{ left: `${(index / (totalSteps - 1)) * 100}%` }}
                    title={step.title}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Speed & Expand */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{playbackSpeed}x</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
            >
              <Icon name="ChevronUp" size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 bg-white border-t border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Execution Timeline</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
          >
            <Icon name="ChevronDown" size={16} />
          </Button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
          
          {/* Timeline Steps */}
          <div className="space-y-4">
            {timelineSteps.map((step, index) => (
              <div
                key={step.id}
                className={`relative flex items-start space-x-4 cursor-pointer transition-all duration-200 ${
                  index === currentStep ? 'bg-blue-50 -mx-2 px-2 py-2 rounded-lg' : 'hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg'
                }`}
                onClick={() => onStepChange(index)}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Step Marker */}
                <div className={`relative z-10 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center ${
                  getStepColor(step.type, step.status)
                } ${index === currentStep ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
                  <Icon 
                    name={getStepIcon(step.type)} 
                    size={16} 
                    color="white"
                    className={step.status === 'processing' ? 'animate-spin' : ''}
                  />
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">{step.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Icon name="Clock" size={12} />
                      <span>{formatDuration(step.duration)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span className="capitalize">{step.type}</span>
                    <span>•</span>
                    <span className="capitalize">{step.status}</span>
                    <span>•</span>
                    <span>{step.timestamp.toLocaleTimeString()}</span>
                  </div>

                  {/* Progress Bar for Current Step */}
                  {index === currentStep && step.status === 'processing' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  )}

                  {/* Hover Details */}
                  {hoveredStep === index && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-medium">Started:</span> {step.timestamp.toLocaleTimeString()}
                        </div>
                        <div>
                          <span className="font-medium">Duration:</span> {formatDuration(step.duration)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPlayPause}
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={16} className="mr-1" />
              {isPlaying ? "Pause" : "Play"}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStepChange(0)}
            >
              <Icon name="SkipBack" size={16} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStepChange(totalSteps - 1)}
            >
              <Icon name="SkipForward" size={16} />
            </Button>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Icon name="Zap" size={14} />
            <span>Speed: {playbackSpeed}x</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;