import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ExecutionCanvas from './components/ExecutionCanvas';
import ControlSidebar from './components/ControlSidebar';
import DetailsSidebar from './components/DetailsSidebar';
import TimelineView from './components/TimelineView';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const LiveExecutionVisualizer = () => {
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [executionMode, setExecutionMode] = useState('live');

  // Canvas state
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Filter state
  const [showNodeTypes, setShowNodeTypes] = useState({
    prompt: true,
    model: true,
    tool: true,
    memory: true,
    output: true,
    error: true
  });
  const [performanceThreshold, setPerformanceThreshold] = useState(0);

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);

  const totalSteps = 5;

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < totalSteps - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, playbackSpeed, totalSteps]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentStep(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1));
          break;
        case 'Escape':
          setSelectedNode(null);
          break;
        case 'f':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
        case '=': case'+':
          e.preventDefault();
          setZoomLevel(prev => Math.min(3, prev + 0.2));
          break;
        case '-':
          e.preventDefault();
          setZoomLevel(prev => Math.max(0.1, prev - 0.2));
          break;
        case '0':
          e.preventDefault();
          setZoomLevel(1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handlePlayPause = () => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleNodeTypeToggle = (type, enabled) => {
    setShowNodeTypes(prev => ({
      ...prev,
      [type]: enabled
    }));
  };

  const handleExport = (format) => {
    // Mock export functionality
    const exportData = {
      timestamp: new Date().toISOString(),
      currentStep,
      selectedNode: selectedNode?.id,
      filters: showNodeTypes,
      performanceThreshold,
      zoomLevel
    };

    switch (format) {
      case 'pdf': console.log('Exporting as PDF...', exportData);
        // In a real app, this would generate a PDF
        alert('PDF export functionality would be implemented here');
        break;
      case 'png': console.log('Exporting as PNG...', exportData);
        // In a real app, this would capture the canvas as PNG
        alert('PNG export functionality would be implemented here');
        break;
      case 'html': console.log('Exporting as HTML...', exportData);
        // In a real app, this would generate an HTML report
        alert('HTML export functionality would be implemented here');
        break;
      case 'json':
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `execution-data-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        break;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Mock execution data
  const executionData = {
    sessionId: 'session-1',
    startTime: new Date(Date.now() - 5000),
    status: isPlaying ? 'running' : 'paused',
    totalNodes: 6,
    completedNodes: currentStep + 1
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16 h-screen flex flex-col">
        {/* Toolbar */}
        <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">
                Live Execution Visualizer
              </span>
            </div>
            
            <div className="text-sm text-gray-500">
              Session: {executionData.sessionId} • 
              Status: <span className="capitalize">{executionData.status}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTimeline(!showTimeline)}
            >
              <Icon name="Timeline" size={16} className="mr-1" />
              Timeline
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
            >
              <Icon name={isFullscreen ? "Minimize2" : "Maximize2"} size={16} className="mr-1" />
              {isFullscreen ? "Exit" : "Fullscreen"}
            </Button>

            <div className="text-xs text-gray-500 ml-4">
              Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">Space</kbd> to play/pause
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Control Sidebar */}
          <ControlSidebar
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onStop={handleStop}
            onRestart={handleRestart}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onStepChange={setCurrentStep}
            playbackSpeed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
            showNodeTypes={showNodeTypes}
            onNodeTypeToggle={handleNodeTypeToggle}
            performanceThreshold={performanceThreshold}
            onPerformanceThresholdChange={setPerformanceThreshold}
            onExport={handleExport}
            executionMode={executionMode}
            onExecutionModeChange={setExecutionMode}
          />

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <ExecutionCanvas
                executionData={executionData}
                selectedNode={selectedNode}
                onNodeSelect={setSelectedNode}
                zoomLevel={zoomLevel}
                onZoomChange={setZoomLevel}
                isPlaying={isPlaying}
                currentStep={currentStep}
                showNodeTypes={showNodeTypes}
                performanceThreshold={performanceThreshold}
              />
            </div>

            {/* Timeline */}
            {showTimeline && (
              <TimelineView
                isPlaying={isPlaying}
                currentStep={currentStep}
                totalSteps={totalSteps}
                onStepChange={setCurrentStep}
                onPlayPause={handlePlayPause}
                executionData={executionData}
                playbackSpeed={playbackSpeed}
              />
            )}
          </div>

          {/* Details Sidebar */}
          <DetailsSidebar
            selectedNode={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        </div>

        {/* Status Bar */}
        <div className="h-8 bg-gray-100 border-t border-gray-200 flex items-center justify-between px-6 text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Nodes: {executionData.completedNodes}/{executionData.totalNodes}</span>
            <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
            <span>Speed: {playbackSpeed}x</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span>Filters: {Object.values(showNodeTypes).filter(Boolean).length}/6</span>
            <span>Threshold: {performanceThreshold}ms</span>
            <span>Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveExecutionVisualizer;