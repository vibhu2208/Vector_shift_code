// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    undoStack: [],
    redoStack: [],
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
        set((state) => ({
            undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
            redoStack: [],
            nodes: [...state.nodes, node]
        }));
    },
    onNodesChange: (changes) => {
      set((state) => ({
        undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        redoStack: [],
        nodes: applyNodeChanges(changes, state.nodes),
      }));
    },
    onEdgesChange: (changes) => {
      set((state) => ({
        undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        redoStack: [],
        edges: applyEdgeChanges(changes, state.edges),
      }));
    },
    onConnect: (connection) => {
      set((state) => ({
        undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        redoStack: [],
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, state.edges),
      }));
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set((state) => ({
        undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        redoStack: [],
        nodes: state.nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
          return node;
        }),
      }));
    },
    deleteNode: (nodeId) => {
      set((state) => ({
        undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        redoStack: [],
        nodes: state.nodes.filter((node) => node.id !== nodeId),
        edges: state.edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        ),
      }));
    },
    deleteEdge: (edgeId) => {
      set((state) => ({
        undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        redoStack: [],
        edges: state.edges.filter((edge) => edge.id !== edgeId),
      }));
    },
    undo: () => {
      set((state) => {
        if (state.undoStack.length === 0) return state;
        const prev = state.undoStack[state.undoStack.length - 1];
        return {
          ...state,
          nodes: prev.nodes,
          edges: prev.edges,
          undoStack: state.undoStack.slice(0, -1),
          redoStack: [...state.redoStack, { nodes: state.nodes, edges: state.edges }],
        };
      });
    },
    redo: () => {
      set((state) => {
        if (state.redoStack.length === 0) return state;
        const next = state.redoStack[state.redoStack.length - 1];
        return {
          ...state,
          nodes: next.nodes,
          edges: next.edges,
          redoStack: state.redoStack.slice(0, -1),
          undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
        };
      });
    },
    exportPipeline: () => {
      const { nodes, edges } = get();
      const dataStr = JSON.stringify({ nodes, edges }, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pipeline.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    importPipeline: (imported) => {
      set({ nodes: imported.nodes || [], edges: imported.edges || [] });
    },
    setNodes: (nodes) => set((state) => ({
      undoStack: [...state.undoStack, { nodes: state.nodes, edges: state.edges }],
      redoStack: [],
      nodes
    })),
}));
