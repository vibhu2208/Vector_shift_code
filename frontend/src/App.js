import React, { useState, useEffect } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Tooltip from '@radix-ui/react-tooltip';
import Joyride from 'react-joyride';
import dagre from 'dagre';

function App() {
  const { nodes, edges, addNode, getNodeID } = useStore(
    (state) => ({
      nodes: state.nodes,
      edges: state.edges,
      addNode: state.addNode,
      getNodeID: state.getNodeID,
    }),
    shallow
  );
  const setNodes = useStore((state) => state.setNodes);

  // Joyride state
  const [runTour, setRunTour] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  // Auto-add Text Node for the tour
  useEffect(() => {
    if (runTour) {
      // Only add if not present
      const hasTextNode = nodes.some(node => node.type === 'text');
      if (!hasTextNode) {
        const nodeID = getNodeID('text');
        addNode({
          id: nodeID,
          type: 'text',
          position: { x: 400, y: 200 },
          data: { id: nodeID, nodeType: 'text', text: 'Hello, {{name}}!' }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runTour]);

  // Show tour on first load
  useEffect(() => {
    if (!localStorage.getItem('vector_tour_shown')) {
      setRunTour(true);
      localStorage.setItem('vector_tour_shown', 'true');
    }
  }, []);

  // Joyride steps
  const steps = [
    {
      target: '.node-toolbar',
      content: 'Use this panel to add Input, Output, and Text nodes.',
      disableBeacon: true,
    },
    {
      target: '.export-pipeline-btn',
      content: 'Click here to export your current pipeline as a JSON file.',
    },
    {
      target: '.import-pipeline-btn',
      content: 'Click here to import a pipeline from a JSON file.',
    },
    {
      target: '.canvas-area',
      content: 'This is where you connect your nodes and build your pipeline.',
    },
    {
      target: '.text-node',
      content: 'Use {{variable}} inside the Text node to create dynamic input handles.',
    },
    {
      target: '.submit-button',
      content: 'Click here to send your pipeline to the backend.',
    },
    {
      target: '.alert-box',
      content: 'This alert shows the number of nodes, edges, and if the graph is a DAG.',
    },
  ];

  // Add auto layout handler
  const handleAutoLayout = () => {
    // Dagre layout logic
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    const nodeWidth = 220;
    const nodeHeight = 100;
    dagreGraph.setGraph({ rankdir: 'TB' });
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
    dagre.layout(dagreGraph);
    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
        // Optionally, lock the position to prevent drag during animation
        // draggable: false,
      };
    });
    setNodes(layoutedNodes);
  };

  return (
    <Tooltip.Provider>
      <div>
        <Joyride
          steps={steps}
          run={runTour}
          stepIndex={tourStepIndex}
          continuous
          showSkipButton
          showProgress
          styles={{
            options: {
              backgroundColor: '#18122B',
              textColor: '#F5F5F5',
              arrowColor: '#A000FF',
              primaryColor: '#A000FF',
              zIndex: 99999,
              borderRadius: 16,
              boxShadow: '0 0 24px 4px #A000FF88',
            },
            buttonNext: {
              background: 'linear-gradient(90deg, #A000FF 0%, #FF00B8 100%)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 8,
              boxShadow: '0 0 8px #A000FF, 0 0 16px #FF00B8',
            },
            buttonBack: {
              color: '#C5AFFF',
            },
            buttonSkip: {
              color: '#FF00B8',
            },
          }}
          locale={{
            back: 'Back',
            close: 'Close',
            last: 'Finish',
            next: 'Next',
            skip: 'Skip',
          }}
          callback={data => {
            const { action, index, type, status } = data;
            if (status === 'finished' || status === 'skipped') {
              setRunTour(false);
              setTourStepIndex(0);
            } else if (type === 'step:after' && action === 'next') {
              setTourStepIndex(prev => prev + 1);
            } else if (type === 'step:after' && action === 'prev') {
              setTourStepIndex(prev => prev - 1);
            }
          }}
        />
        <button
          className="neon-button"
          style={{ position: 'fixed', top: 24, right: 24, zIndex: 9000 }}
          onClick={() => {
            setRunTour(true);
            setTourStepIndex(0);
          }}
        >
          Start Tour
        </button>
        <button
          className="neon-button"
          style={{ position: 'fixed', top: 24, right: 170, zIndex: 9000 }}
          onClick={handleAutoLayout}
        >
          Auto Layout
        </button>
        <div className="node-toolbar">
          <PipelineToolbar />
        </div>
        <div className="canvas-area">
          <PipelineUI />
        </div>
        <div className="submit-button">
          <SubmitButton nodes={nodes} edges={edges} />
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Tooltip.Provider>
  );
}

export default App;
