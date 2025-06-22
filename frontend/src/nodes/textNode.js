import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Position } from 'reactflow';

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [variables, setVariables] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 200, height: 120 });
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  const extractVariables = (text) => {
    if (!text) return [];
    const regex = /{{\s*([a-zA-Z_$][\w$]*)\s*}}/g;
    const matches = [...text.matchAll(regex)];
    return [...new Set(matches.map(match => match[1]))];
  };

  const calculateDimensions = useCallback((text) => {
    if (!text) return { width: 200, height: 120 };
    
    const lines = text.split('\n');
    const maxLineLength = Math.max(...lines.map(line => line.length));
    
    // Calculate width based on content
    const charWidth = 8; // Approximate character width in monospace
    const padding = 40; // Account for padding and borders
    const minWidth = 200;
    const maxWidth = 300;
    const calculatedWidth = Math.max(minWidth, Math.min(maxWidth, maxLineLength * charWidth + padding));
    
    // Calculate height based on number of lines and variables
    const lineHeight = 20;
    const baseHeight = 80;
    const variableHandleHeight = variables.length * 25;
    const textHeight = lines.length * lineHeight;
    const calculatedHeight = Math.max(120, baseHeight + textHeight + Math.max(0, variableHandleHeight - 20));
    
    return { width: calculatedWidth, height: calculatedHeight };
  }, [variables.length]);

  useEffect(() => {
    if (data.text) {
      const newVariables = extractVariables(data.text);
      setVariables(newVariables);
      
      const newDimensions = calculateDimensions(data.text);
      setDimensions(newDimensions);
    }
  }, [data.text, calculateDimensions]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    updateNodeField(id, 'text', newText);
    
    // Auto-resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Create input handles for variables
  const variableHandles = variables.map((variable, index) => ({
    id: `input-${variable}`,
    label: variable,
    position: Position.Left,
    style: {
      top: `${50 + index * 25}px`,
      background: 'linear-gradient(90deg, #A000FF 0%, #FF00B8 100%)',
      boxShadow: '0 0 8px #A000FF, 0 0 16px #FF00B8',
      border: '2px solid #A000FF',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      transition: 'all 0.2s',
    }
  }));

  const customContent = (
    <div style={{ marginBottom: '8px' }}>
      <label style={{ 
        display: 'block', 
        fontSize: '11px', 
        marginBottom: '4px',
        color: '#666',
        fontWeight: '500'
      }}>
        Text Content:
      </label>
      <textarea
        ref={textareaRef}
        value={data.text || ''}
        onChange={handleTextChange}
        placeholder="Enter text here. Use {{variableName}} for variables."
        style={{
          width: '100%',
          minHeight: '60px',
          resize: 'none',
          overflow: 'hidden',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '12px',
          lineHeight: '1.4',
          boxSizing: 'border-box'
        }}
        onInput={(e) => {
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />
      {variables.length > 0 && (
        <div style={{ 
          fontSize: '10px', 
          color: '#2196f3', 
          marginTop: '4px',
          fontStyle: 'italic'
        }}>
          Variables detected: {variables.join(', ')}
        </div>
      )}
    </div>
  );

  return (
    <div 
      ref={containerRef} 
      className="text-node"
      style={{ 
        display: 'inline-block',
        minWidth: dimensions.width,
        minHeight: dimensions.height
      }}
    >
      <BaseNode
        id={id}
        data={data}
        title="Text"
        inputs={variableHandles}
        outputs={[{ 
          id: 'output', 
          label: 'Text Output',
          position: Position.Right
        }]}
        content={customContent}
        style={{
          width: dimensions.width,
          minHeight: dimensions.height,
          transition: 'all 0.3s ease'
        }}
        onFieldChange={(field, value) => updateNodeField(id, field, value)}
      />
    </div>
  );
};