// Updated ui.js with new node types

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap, useReactFlow } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { toast } from 'react-toastify';

// Import all node types
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { MathNode } from './nodes/newNodes/MathNode';
import { FilterNode } from './nodes/newNodes/FilterNode';
import { DelayNode } from './nodes/newNodes/DealyNode';
import { SplitterNode } from './nodes/newNodes/SplitterNode';
import { ConditionalNode } from './nodes/newNodes/ConditionalNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Register all node types
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  math: MathNode,
  filter: FilterNode,
  delay: DelayNode,
  splitter: SplitterNode,
  conditional: ConditionalNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  deleteNode: state.deleteNode,
  deleteEdge: state.deleteEdge,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState(null);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const fileInputRef = useRef();
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      deleteNode,
      deleteEdge
    } = useStore(selector, shallow);
    const undo = useStore((state) => state.undo);
    const redo = useStore((state) => state.redo);
    const exportPipeline = useStore((state) => state.exportPipeline);
    const importPipeline = useStore((state) => state.importPipeline);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onNodeContextMenu = useCallback(
      (event, node) => {
        event.preventDefault();
        setContextMenu({
          id: node.id,
          top: event.clientY,
          left: event.clientX,
        });
      },
      []
    );

    const onPaneClick = useCallback(() => {
      setContextMenu(null);
    }, []);

    const handleDeleteNode = useCallback(
      (nodeId) => {
        deleteNode(nodeId);
        setContextMenu(null);
      },
      [deleteNode]
    );

    // Edge right-click handler
    const handleEdgeContextMenu = useCallback((event, edge) => {
      event.preventDefault();
      event.stopPropagation();
      deleteEdge(edge.id);
      toast.info('Connection removed', { position: 'top-right', autoClose: 2000 });
    }, [deleteEdge]);

    // Track selected node/edge
    const onNodeClick = useCallback((event, node) => {
      setSelectedNodeId(node.id);
      setSelectedEdgeId(null);
    }, []);
    const onEdgeClick = useCallback((event, edge) => {
      setSelectedEdgeId(edge.id);
      setSelectedNodeId(null);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (event) => {
        // Delete selected node/edge
        if (event.key === 'Delete') {
          if (selectedNodeId) {
            deleteNode(selectedNodeId);
            setSelectedNodeId(null);
          } else if (selectedEdgeId) {
            deleteEdge(selectedEdgeId);
            setSelectedEdgeId(null);
          }
        }
        // Undo (Ctrl+Z)
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
          event.preventDefault();
          if (event.shiftKey) {
            redo();
          } else {
            undo();
          }
        }
        // Redo (Ctrl+Y)
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
          event.preventDefault();
          redo();
        }
        // Export (Ctrl+S)
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
          event.preventDefault();
          exportPipeline();
        }
        // Import (Ctrl+E)
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'e') {
          event.preventDefault();
          if (fileInputRef.current) fileInputRef.current.click();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedNodeId, selectedEdgeId, deleteNode, deleteEdge, undo, redo, exportPipeline]);

    // Handle file import
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const imported = JSON.parse(evt.target.result);
          importPipeline(imported);
          toast.success('Pipeline imported!');
        } catch (err) {
          toast.error('Invalid pipeline file.');
        }
      };
      reader.readAsText(file);
    };

    return (
        <>
        <input
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div ref={reactFlowWrapper} style={{width: '100vw', height: '70vh', border: '1px solid #ddd'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                fitView
                onNodeContextMenu={onNodeContextMenu}
                onPaneClick={onPaneClick}
                onEdgeContextMenu={handleEdgeContextMenu}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
            >
                <Background 
                    color="#f0f0f0" 
                    gap={gridSize} 
                    style={{ filter: 'blur(0.5px)' }}
                />
                <Controls />
                <MiniMap 
                    nodeStrokeColor={(n) => {
                        if (n.type === 'input') return '#0041d0';
                        if (n.type === 'output') return '#ff0072';
                        if (n.type === 'default') return '#1a192b';
                        return '#eee';
                    }}
                    nodeColor={(n) => {
                        if (n.type === 'math') return '#e3f2fd';
                        if (n.type === 'filter') return '#fff3e0';
                        if (n.type === 'delay') return '#f3e5f5';
                        if (n.type === 'splitter') return '#e8f5e8';
                        if (n.type === 'conditional') return '#ffeaa7';
                        return '#fff';
                    }}
                />
            </ReactFlow>
            {contextMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: contextMenu.top,
                  left: contextMenu.left,
                  background: 'white',
                  padding: '8px',
                  borderRadius: '4px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                }}
              >
                <button
                  onClick={() => handleDeleteNode(contextMenu.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    color: '#ff4444',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  Delete Node
                </button>
              </div>
            )}
        </div>
        </>
    )
}