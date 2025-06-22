// Updated toolbar.js with new nodes

import { DraggableNode } from './draggableNode';
import { useStore } from './store';
import { toast } from 'react-toastify';
import React from 'react';

export const PipelineToolbar = () => {
    const exportPipeline = useStore((state) => state.exportPipeline);
    const importPipeline = useStore((state) => state.importPipeline);
    const fileInputRef = React.useRef();
    const handleExport = () => {
        exportPipeline();
        toast.success('Pipeline exported!');
    };
    const handleImportClick = () => {
        if (fileInputRef.current) fileInputRef.current.value = null;
        fileInputRef.current.click();
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const imported = JSON.parse(evt.target.result);
                if (!imported.nodes || !imported.edges || !Array.isArray(imported.nodes) || !Array.isArray(imported.edges)) {
                    throw new Error('Invalid pipeline file: missing nodes or edges array.');
                }
                importPipeline(imported);
                toast.success('Pipeline imported!');
            } catch (err) {
                toast.error('Invalid pipeline file.');
            }
        };
        reader.readAsText(file);
    };
    return (
        <div style={{ 
            padding: '24px 20px', 
            background: '#18122B',
            borderBottom: '2px solid #A000FF',
            boxShadow: '0 0 24px 4px #A000FF88',
            fontFamily: 'Inter, Sora, Poppins, Space Grotesk, Segoe UI, Arial, sans-serif',
            color: '#C5AFFF',
            position: 'relative',
            zIndex: 10
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                <h3 style={{ 
                    margin: 0, 
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#E1D9FF',
                    letterSpacing: '0.01em',
                    textShadow: '0 0 8pxrgb(196, 187, 201), 0 0 16px #FF00B8',
                    background: 'linear-gradient(90deg, #A000FF 0%, #FF00B8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block',
                }}>Node Library</h3>
                <button
                    className="neon-button export-pipeline-btn"
                    style={{ margin: 0, padding: '10px 22px', fontSize: '1rem' }}
                    onClick={handleExport}
                >
                    Export Pipeline
                </button>
                <button
                    className="neon-button import-pipeline-btn"
                    style={{ margin: 0, padding: '10px 22px', fontSize: '1rem' }}
                    onClick={handleImportClick}
                >
                    Import Pipeline
                </button>
                <input
                    type="file"
                    accept="application/json"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>
            
            <div style={{ 
                display: 'flex',
                gap: '20px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                {/* Basic Nodes */}
                <div style={{ 
                    flex: 1,
                    minWidth: 220,
                    padding: '18px',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.10)',
                    boxShadow: '0 0 12px #A000FF44',
                    marginBottom: '16px',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)'
                }}>
                    <h4 style={{ 
                        margin: '0 0 12px 0', 
                        fontSize: '1.1rem', 
                        color: '#C5AFFF',
                        fontWeight: 700,
                        letterSpacing: '0.01em',
                        textShadow: '0 0 4px #A000FF',
                        background: 'linear-gradient(90deg, #A000FF 0%, #FF00B8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block',
                    }}>Basic Nodes</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <DraggableNode type='customInput' label='Input' />
                        <DraggableNode type='llm' label='LLM' />
                        <DraggableNode type='customOutput' label='Output' />
                        <DraggableNode type='text' label='Text' />
                    </div>
                </div>

                {/* Advanced Nodes */}
                <div style={{ 
                    flex: 1,
                    minWidth: 220,
                    padding: '18px',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.10)',
                    boxShadow: '0 0 12px #A000FF44',
                    marginBottom: '16px',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)'
                }}>
                    <h4 style={{ 
                        margin: '0 0 12px 0', 
                        fontSize: '1.1rem', 
                        color: '#C5AFFF',
                        fontWeight: 700,
                        letterSpacing: '0.01em',
                        textShadow: '0 0 4px #A000FF',
                        background: 'linear-gradient(90deg, #A000FF 0%, #FF00B8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block',
                    }}>Advanced Nodes</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        <DraggableNode type='math' label='Math' />
                        <DraggableNode type='filter' label='Filter' />
                        <DraggableNode type='delay' label='Delay' />
                        <DraggableNode type='splitter' label='Splitter' />
                        <DraggableNode type='conditional' label='Conditional' />
                    </div>
                </div>
            </div>
        </div>
    );
};