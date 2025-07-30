import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExecutionCanvas = ({ 
  executionData, 
  selectedNode, 
  onNodeSelect, 
  zoomLevel, 
  onZoomChange,
  isPlaying,
  currentStep,
  showNodeTypes,
  performanceThreshold 
}) => {
  const canvasRef = useRef(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Mock execution data with streaming updates
  const [nodes, setNodes] = useState([
    {
      id: 'start',
      type: 'prompt',
      title: 'Initial Prompt',
      content: 'Analyze the following customer feedback and provide sentiment analysis with key insights.',
      position: { x: 100, y: 200 },
      status: 'completed',
      timestamp: new Date(Date.now() - 5000),
      metrics: { latency: 45, tokens: 28, confidence: 0.95 },
      connections: ['llm-1']
    },
    {
      id: 'llm-1',
      type: 'model',
      title: 'GPT-4 Processing',
      content: 'Processing sentiment analysis...\n\nBased on the customer feedback, I can identify several key sentiment indicators:\n\n1. **Overall Sentiment**: Positive (0.78/1.0)\n2. **Key Themes**: Product satisfaction, delivery experience\n3. **Emotional Indicators**: "love", "excellent", "disappointed" (mixed)',
      position: { x: 350, y: 200 },
      status: currentStep >= 1 ? 'completed' : 'processing',
      timestamp: new Date(Date.now() - 3000),
      metrics: { latency: 1250, tokens: 156, confidence: 0.89 },
      connections: ['tool-1', 'memory-1']
    },
    {
      id: 'tool-1',
      type: 'tool',
      title: 'Sentiment API Call',
      content: 'POST /api/sentiment/analyze\n{\n  "text": "customer feedback",\n  "model": "advanced-sentiment-v2",\n  "confidence_threshold": 0.7\n}',
      position: { x: 600, y: 150 },
      status: currentStep >= 2 ? 'completed' : currentStep === 1 ? 'processing' : 'pending',
      timestamp: new Date(Date.now() - 2000),
      metrics: { latency: 320, tokens: 0, confidence: 0.92 },
      connections: ['llm-2']
    },
    {
      id: 'memory-1',
      type: 'memory',
      title: 'Context Storage',
      content: 'Storing conversation context:\n- User intent: sentiment analysis\n- Previous interactions: 3\n- Session variables: customer_id, feedback_type\n- Confidence scores: sentiment=0.78, relevance=0.85',
      position: { x: 600, y: 250 },
      status: currentStep >= 2 ? 'completed' : currentStep === 1 ? 'processing' : 'pending',
      timestamp: new Date(Date.now() - 1800),
      metrics: { latency: 15, tokens: 0, confidence: 1.0 },
      connections: ['llm-2']
    },
    {
      id: 'llm-2',
      type: 'model',
      title: 'Response Generation',
      content: currentStep >= 3 ? 'Final analysis complete:\n\n**Sentiment Summary:**\n- Overall: Positive (78%)\n- Satisfaction: High\n- Concerns: Minor delivery delays\n- Recommendation: Follow up on logistics\n\n**Action Items:**\n1. Acknowledge positive feedback\n2. Address delivery concerns\n3. Offer improvement timeline' : 'Generating final response...',
      position: { x: 850, y: 200 },
      status: currentStep >= 3 ? 'completed' : currentStep === 2 ? 'processing' : 'pending',
      timestamp: new Date(Date.now() - 500),
      metrics: { latency: currentStep >= 3 ? 890 : 0, tokens: currentStep >= 3 ? 89 : 0, confidence: 0.91 },
      connections: currentStep >= 3 ? ['output'] : []
    },
    {
      id: 'output',
      type: 'output',
      title: 'Final Output',
      content: 'Sentiment analysis completed successfully with high confidence score.',
      position: { x: 1100, y: 200 },
      status: currentStep >= 4 ? 'completed' : 'pending',
      timestamp: currentStep >= 4 ? new Date() : null,
      metrics: { latency: 0, tokens: 89, confidence: 0.91 },
      connections: []
    }
  ]);

  const [connections, setConnections] = useState([]);

  // Update connections based on current step
  useEffect(() => {
    const newConnections = [];
    nodes.forEach(node => {
      if (node.status === 'completed' && node.connections) {
        node.connections.forEach(targetId => {
          newConnections.push({
            from: node.id,
            to: targetId,
            animated: node.status === 'processing'
          });
        });
      }
    });
    setConnections(newConnections);
  }, [nodes, currentStep]);

  // Update node statuses based on current step
  useEffect(() => {
    setNodes(prevNodes => 
      prevNodes.map(node => {
        const nodeIndex = ['start', 'llm-1', 'tool-1', 'memory-1', 'llm-2', 'output'].indexOf(node.id);
        if (nodeIndex === -1) return node;
        
        let status = 'pending';
        if (nodeIndex < currentStep) status = 'completed';
        else if (nodeIndex === currentStep) status = 'processing';
        
        return { ...node, status };
      })
    );
  }, [currentStep]);

  const getNodeColor = (node) => {
    const colors = {
      prompt: { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-900' },
      model: { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-900' },
      tool: { bg: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-900' },
      memory: { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-900' },
      output: { bg: 'bg-gray-100', border: 'border-gray-500', text: 'text-gray-900' },
      error: { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-900' }
    };
    return colors[node.type] || colors.prompt;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'processing': return 'Loader';
      case 'error': return 'XCircle';
      default: return 'Clock';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = Math.max(0.1, Math.min(3, zoomLevel + delta));
    onZoomChange(newZoom);
  };

  const handleNodeClick = (node) => {
    onNodeSelect(node);
  };

  const handleNodeHover = (node, e) => {
    setHoveredNode(node);
    setTooltipPosition({ x: e.clientX + 10, y: e.clientY - 10 });
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
  };

  const shouldShowNode = (node) => {
    if (!showNodeTypes[node.type]) return false;
    if (performanceThreshold > 0 && node.metrics.latency < performanceThreshold) return false;
    return true;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove]);

  const filteredNodes = nodes.filter(shouldShowNode);

  return (
    <div className="relative w-full h-full bg-gray-50 overflow-hidden">
      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        <div className="bg-white rounded-lg shadow-md p-2 flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(Math.min(3, zoomLevel + 0.2))}
            disabled={zoomLevel >= 3}
          >
            <Icon name="ZoomIn" size={16} />
          </Button>
          <span className="text-sm font-medium text-gray-600 min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onZoomChange(Math.max(0.1, zoomLevel - 0.2))}
            disabled={zoomLevel <= 0.1}
          >
            <Icon name="ZoomOut" size={16} />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setPanOffset({ x: 0, y: 0 });
            onZoomChange(1);
          }}
          className="bg-white shadow-md"
        >
          <Icon name="Home" size={16} />
        </Button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`
        }}
      >
        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {connections.map((conn, index) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode || !shouldShowNode(fromNode) || !shouldShowNode(toNode)) return null;

            const startX = fromNode.position.x + 120;
            const startY = fromNode.position.y + 40;
            const endX = toNode.position.x;
            const endY = toNode.position.y + 40;

            return (
              <g key={`${conn.from}-${conn.to}-${index}`}>
                <defs>
                  <marker
                    id={`arrowhead-${index}`}
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="#6B7280"
                    />
                  </marker>
                </defs>
                <path
                  d={`M ${startX} ${startY} Q ${startX + (endX - startX) / 2} ${startY} ${endX} ${endY}`}
                  stroke="#6B7280"
                  strokeWidth="2"
                  fill="none"
                  markerEnd={`url(#arrowhead-${index})`}
                  className={conn.animated ? 'animate-pulse' : ''}
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {filteredNodes.map((node) => {
          const colors = getNodeColor(node);
          const isSelected = selectedNode?.id === node.id;
          
          return (
            <div
              key={node.id}
              className={`node absolute cursor-pointer transition-all duration-200 ${
                isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
              style={{
                left: node.position.x,
                top: node.position.y,
                zIndex: isSelected ? 10 : 2
              }}
              onClick={() => handleNodeClick(node)}
              onMouseEnter={(e) => handleNodeHover(node, e)}
              onMouseLeave={handleNodeLeave}
            >
              <div className={`w-60 p-4 rounded-lg border-2 shadow-md hover:shadow-lg transition-shadow ${colors.bg} ${colors.border}`}>
                {/* Node Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Icon
                      name={getStatusIcon(node.status)}
                      size={16}
                      className={`${getStatusColor(node.status)} ${node.status === 'processing' ? 'animate-spin' : ''}`}
                    />
                    <span className={`text-sm font-semibold ${colors.text}`}>
                      {node.title}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} className="text-gray-500" />
                    <span className="text-xs text-gray-500">
                      {node.metrics.latency}ms
                    </span>
                  </div>
                </div>

                {/* Node Content Preview */}
                <div className="text-xs text-gray-700 mb-2 line-clamp-3">
                  {node.content.length > 100 
                    ? `${node.content.substring(0, 100)}...` 
                    : node.content
                  }
                </div>

                {/* Node Metrics */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Tokens: {node.metrics.tokens}</span>
                  <span>Confidence: {(node.metrics.confidence * 100).toFixed(0)}%</span>
                </div>

                {/* Processing Animation */}
                {node.status === 'processing' && (
                  <div className="absolute inset-0 rounded-lg border-2 border-blue-400 animate-pulse pointer-events-none" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="fixed z-50 bg-gray-900 text-white p-3 rounded-lg shadow-xl max-w-xs pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y
          }}
        >
          <div className="text-sm font-semibold mb-1">{hoveredNode.title}</div>
          <div className="text-xs space-y-1">
            <div>Status: <span className="capitalize">{hoveredNode.status}</span></div>
            <div>Latency: {hoveredNode.metrics.latency}ms</div>
            <div>Tokens: {hoveredNode.metrics.tokens}</div>
            <div>Confidence: {(hoveredNode.metrics.confidence * 100).toFixed(1)}%</div>
            {hoveredNode.timestamp && (
              <div>Time: {hoveredNode.timestamp.toLocaleTimeString()}</div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Node Types</h4>
        <div className="space-y-2">
          {[
            { type: 'prompt', label: 'Prompt', color: 'bg-blue-100 border-blue-500' },
            { type: 'model', label: 'Model', color: 'bg-green-100 border-green-500' },
            { type: 'tool', label: 'Tool', color: 'bg-orange-100 border-orange-500' },
            { type: 'memory', label: 'Memory', color: 'bg-purple-100 border-purple-500' },
            { type: 'output', label: 'Output', color: 'bg-gray-100 border-gray-500' }
          ].map(({ type, label, color }) => (
            <div key={type} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded border ${color}`} />
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutionCanvas;