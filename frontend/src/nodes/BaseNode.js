// BaseNode.js - Node Abstraction Component

import { useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import * as Tooltip from '@radix-ui/react-tooltip';

// Tooltip metadata for each node type
const NODE_TOOLTIPS = {
  LLM: {
    name: 'LLM Node',
    description: 'Runs a large language model (LLM) on the input prompt and system message.',
    inputs: ['System', 'Prompt'],
    outputs: ['Response']
  },
  Text: {
    name: 'Text Node',
    description: 'Displays or processes static or templated text.',
    inputs: ['Variables (if any)'],
    outputs: ['Text Output']
  },
  Input: {
    name: 'Input Node',
    description: 'Entry point for user or external data into the pipeline.',
    outputs: ['Value']
  },
  Output: {
    name: 'Output Node',
    description: 'Collects and displays the final output of the pipeline.',
    inputs: ['Value']
  },
  Math: {
    name: 'Math Node',
    description: 'Performs mathematical operations on inputs.',
    inputs: ['A', 'B'],
    outputs: ['Result']
  },
  Conditional: {
    name: 'Conditional Node',
    description: 'Routes data based on a condition (if-then-else logic).',
    inputs: ['Condition', 'True', 'False'],
    outputs: ['Output']
  },
  Splitter: {
    name: 'Splitter Node',
    description: 'Splits input data into multiple outputs.',
    inputs: ['Input'],
    outputs: ['Out 1', 'Out 2', 'Out 3']
  },
  Filter: {
    name: 'Filter Node',
    description: 'Filters data based on a condition.',
    inputs: ['Data'],
    outputs: ['Filtered']
  },
  Delay: {
    name: 'Delay Node',
    description: 'Delays the flow for a specified duration.',
    inputs: ['Input'],
    outputs: ['Output']
  }
};

export const BaseNode = ({ 
  id, 
  data, 
  title,
  inputs = [], // Array of input handles: {id, label, position, style}
  outputs = [], // Array of output handles: {id, label, position, style}
  fields = [], // Array of form fields: {type, name, label, options, defaultValue}
  content = null, // Custom content component
  style = {},
  onFieldChange
}) => {
  const [fieldValues, setFieldValues] = useState(() => {
    const initialValues = {};
    fields.forEach(field => {
      initialValues[field.name] = data?.[field.name] || field.defaultValue || '';
    });
    return initialValues;
  });
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState(data?.comment || '');
  const commentHoverRef = useRef(false);
  const closeTimerRef = useRef();

  const handleFieldChange = (fieldName, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
    if (onFieldChange) {
      onFieldChange(fieldName, value);
    }
  };

  const handleCommentSave = () => {
    if (onFieldChange) {
      onFieldChange('comment', commentDraft);
    }
    setCommentOpen(false);
  };
  const handleCommentDelete = () => {
    setCommentDraft('');
    if (onFieldChange) {
      onFieldChange('comment', '');
    }
    setCommentOpen(false);
  };

  const renderField = (field) => {
    const value = fieldValues[field.name];
    
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            style={{ width: '100%', marginBottom: '4px' }}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            style={{ width: '100%', marginBottom: '4px', resize: 'vertical' }}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            style={{ width: '100%', marginBottom: '4px' }}
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            min={field.min}
            max={field.max}
            step={field.step}
            style={{ width: '100%', marginBottom: '4px' }}
          />
        );
      
      default:
        return null;
    }
  };

  const defaultStyle = {
    width: 200,
    minHeight: 80,
    border: '2px solid',
    borderImage: 'linear-gradient(90deg, #A000FF 0%, #FF00B8 100%) 1',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.02)',
    boxShadow: '0 0 12px 2px #A000FF44, 0 0 24px 4px #FF00B844',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    padding: '20px',
    fontSize: '12px',
    transition: 'all 0.2s ease',
    ':hover': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      border: '1px solid #999'
    },
    ...style
  };

  // Determine if this is a special node that needs larger title
  const isSpecialNode = ['Math', 'Conditional', 'Splitter'].includes(title);
  const titleStyle = {
    fontWeight: 'bold',
    marginBottom: '12px',
    textAlign: 'center',
    fontSize: isSpecialNode ? '16px' : '14px'
  };

  const handleStyle = {
    width: '8px',
    height: '8px',
    background: '#333',
    border: '1px solid #fff',
    transition: 'all 0.2s ease',
  };

  // const handleHoverStyle = {
  //   width: '10px',
  //   height: '10px',
  //   background: '#2196f3',
  //   border: '1px solid #fff',
  // };

  // Tooltip content for this node
  const tooltip = NODE_TOOLTIPS[title] || { name: title, description: '', inputs: inputs?.map(i=>i.label), outputs: outputs?.map(o=>o.label) };

  // Helper to handle hover for icon and popover
  const handlePopoverEnter = () => {
    commentHoverRef.current = true;
    clearTimeout(closeTimerRef.current);
    setCommentOpen(true);
  };
  const handlePopoverLeave = () => {
    commentHoverRef.current = false;
    closeTimerRef.current = setTimeout(() => {
      if (!commentHoverRef.current) setCommentOpen(false);
    }, 120);
  };

  return (
    <div
      style={{ ...defaultStyle, position: 'relative' }}
    >
      {/* Elegant Info Icon in Top-Left */}
      <Tooltip.Root delayDuration={100}>
        <Tooltip.Trigger asChild>
          <span
            style={{
              position: 'absolute',
              top: -18,
              left: -18,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #232042 60%, #A000FF 100%)',
              color: '#fff',
              borderRadius: '50%',
              boxShadow: '0 2px 8px #A000FF44',
              border: '2px solid #A000FF',
              cursor: 'pointer',
              fontSize: 18,
              zIndex: 20,
              transition: 'all 0.2s',
            }}
            tabIndex={0}
            role="button"
          >
            {/* Elegant info icon SVG */}
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9" fill="#fff" fillOpacity="0.10" stroke="#A000FF" strokeWidth="1.5"/>
              <rect x="9.1" y="7.2" width="1.8" height="6.2" rx="0.9" fill="#A000FF"/>
              <rect x="9.1" y="5" width="1.8" height="1.8" rx="0.9" fill="#A000FF"/>
            </svg>
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="start"
            sideOffset={12}
            style={{
              background: 'rgba(24,18,43,0.98)',
              color: '#F5F5F5',
              borderRadius: 12,
              padding: 18,
              minWidth: 240,
              maxWidth: 320,
              boxShadow: '0 0 24px #A000FF88',
              zIndex: 9999,
              fontSize: 13,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              border: '1.5px solid #A000FF',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{tooltip.name}</div>
            <div style={{ color: '#C5AFFF', fontSize: 13, marginBottom: 6 }}>{tooltip.description}</div>
            <div style={{ display: 'flex', gap: 18 }}>
              {tooltip.inputs && tooltip.inputs.length > 0 && (
                <div>
                  <div style={{ fontWeight: 600, color: '#00FFB8', fontSize: 12, marginBottom: 2 }}>Inputs</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 12 }}>
                    {tooltip.inputs.map((input, i) => (
                      <li key={i} style={{ color: '#F5F5F5' }}>• {input}</li>
                    ))}
                  </ul>
                </div>
              )}
              {tooltip.outputs && tooltip.outputs.length > 0 && (
                <div>
                  <div style={{ fontWeight: 600, color: '#A000FF', fontSize: 12, marginBottom: 2 }}>Outputs</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 12 }}>
                    {tooltip.outputs.map((output, i) => (
                      <li key={i} style={{ color: '#F5F5F5' }}>• {output}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Tooltip.Arrow style={{ fill: '#18122B' }} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      {/* Floating Comment Icon in Top-Right (click to open) */}
      <Tooltip.Root delayDuration={100} open={commentOpen} onOpenChange={setCommentOpen}>
        <Tooltip.Trigger asChild>
          <span
            style={{
              position: 'absolute',
              top: -18,
              right: -18,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: data?.comment
                ? 'linear-gradient(90deg, #A000FF 0%, #FF00B8 100%)'
                : 'rgba(40,40,60,0.85)',
              color: data?.comment ? '#fff' : '#C5AFFF',
              borderRadius: '50%',
              boxShadow: data?.comment
                ? '0 0 12px #A000FF, 0 0 24px #FF00B8'
                : '0 2px 8px #0006',
              border: data?.comment ? '2px solid #A000FF' : '2px solid #232042',
              cursor: 'pointer',
              fontSize: 18,
              zIndex: 20,
              transition: 'all 0.2s',
            }}
            title={data?.comment ? 'Edit comment' : 'Add comment'}
            onClick={(e) => {
              e.stopPropagation();
              setCommentDraft(data?.comment || '');
              setCommentOpen(true);
            }}
            role="button"
            tabIndex={0}
          >
            <span style={{fontSize: 18, marginTop: 2}}>💬</span>
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          {commentOpen && (
            <Tooltip.Content
              side="top"
              align="end"
              sideOffset={12}
              style={{
                background: '#18122B',
                color: '#F5F5F5',
                borderRadius: 10,
                padding: 16,
                minWidth: 220,
                boxShadow: '0 0 24px #A000FF88',
                zIndex: 9999,
                fontSize: 13,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Node Comment</div>
              <textarea
                value={commentDraft}
                onChange={e => setCommentDraft(e.target.value)}
                placeholder="Add a note or comment..."
                rows={3}
                style={{
                  width: '100%',
                  borderRadius: 6,
                  border: '1px solid #A000FF',
                  padding: 8,
                  fontSize: 13,
                  background: '#232042',
                  color: '#F5F5F5',
                  resize: 'vertical',
                  marginBottom: 8,
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  onClick={handleCommentSave}
                  style={{
                    background: 'linear-gradient(90deg, #A000FF 0%, #FF00B8 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >Save</button>
                {data?.comment && (
                  <button
                    onClick={handleCommentDelete}
                    style={{
                      background: 'none',
                      color: '#FF6B6B',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >Delete</button>
                )}
                <button
                  onClick={() => setCommentOpen(false)}
                  style={{
                    background: 'none',
                    color: '#C5AFFF',
                    border: 'none',
                    borderRadius: 6,
                    padding: '6px 16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >Cancel</button>
              </div>
              <Tooltip.Arrow style={{ fill: '#18122B' }} />
            </Tooltip.Content>
          )}
        </Tooltip.Portal>
      </Tooltip.Root>
      {/* Input Handles */}
      {inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={input.position || Position.Left}
          id={`${id}-${input.id}`}
          style={{
            ...handleStyle,
            top: inputs.length > 1 ? `${((index + 1) * 100) / (inputs.length + 1)}%` : '50%',
            ...input.style
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.width = '10px';
            e.currentTarget.style.height = '10px';
            e.currentTarget.style.background = '#2196f3';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.width = '8px';
            e.currentTarget.style.height = '8px';
            e.currentTarget.style.background = '#333';
          }}
        />
      ))}

      {/* Node Header */}
      <div style={titleStyle}>
        {title}
      </div>

      {/* Custom Content */}
      {content && <div style={{ marginBottom: '12px' }}>{content}</div>}

      {/* Form Fields */}
      {fields.map(field => (
        <div key={field.name} style={{ marginBottom: '10px' }}>
          {field.label && (
            <label style={{ 
              display: 'block', 
              fontSize: '11px', 
              marginBottom: '4px',
              color: '#666'
            }}>
              {field.label}:
            </label>
          )}
          {renderField(field)}
          {field.name === 'delimiter' && (
            <div style={{ 
              fontSize: '10px', 
              color: '#888', 
              marginTop: '4px',
              fontStyle: 'italic'
            }}>
              Enter a character to split text (e.g., comma, space, newline)
            </div>
          )}
        </div>
      ))}

      {/* Output Handles */}
      {outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={output.position || Position.Right}
          id={`${id}-${output.id}`}
          style={{
            ...handleStyle,
            top: outputs.length > 1 ? `${((index + 1) * 100) / (outputs.length + 1)}%` : '50%',
            ...output.style
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.width = '10px';
            e.currentTarget.style.height = '10px';
            e.currentTarget.style.background = '#2196f3';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.width = '8px';
            e.currentTarget.style.height = '8px';
            e.currentTarget.style.background = '#333';
          }}
        />
      ))}
    </div>
  );
};