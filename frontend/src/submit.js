// submit.js
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

export const SubmitButton = ({ nodes, edges }) => {
    const handleSubmit = async (e) => {
        // Handle button press animation
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(33, 150, 243, 0.3)';

        // Show loading toast
        const loadingToast = toast.info('Submitting pipeline...', {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
        });

        try {
            console.log('Submitting pipeline with:', { nodes: nodes.length, edges: edges.length });
            
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nodes: nodes,
                    edges: edges
                })
            });

            // Dismiss loading toast
            toast.dismiss(loadingToast);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Backend response:', data);
            
            // Create success toast message
            toast.success(
                <div
                  style={{
                    padding: '2px 0 20px 0',
                    color: '#222',
                    fontFamily: 'Inter, Sora, Poppins, Segoe UI, Arial, sans-serif',
                    minWidth: 300,
                    maxWidth: 400,
                    margin: '0 auto',
                    textAlign: 'center',
                    letterSpacing: '0.01em',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 4 }}>
                    Pipeline Analysis
                  </div>
                  <div style={{ fontWeight: 400, fontSize: '1rem', color: '#444', marginBottom: 14 }}>
                    {data.is_dag ? 'Your pipeline is a valid Directed Acyclic Graph.' : 'Cycles detected in your pipeline.'}
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 24,
                    margin: '0 auto 8px auto',
                  }}>
                    <div style={{ fontSize: 14 }}>
                      <div style={{ fontWeight: 500 }}>Nodes</div>
                      <div>{data.num_nodes}</div>
                    </div>
                    <div style={{ fontSize: 14 }}>
                      <div style={{ fontWeight: 500 }}>Edges</div>
                      <div>{data.num_edges}</div>
                    </div>
                    <div style={{ fontSize: 14 }}>
                      <div style={{ fontWeight: 500 }}>DAG</div>
                      <div>{data.is_dag ? 'Yes' : 'No'}</div>
                    </div>
                  </div>
                  {!data.is_dag && (
                    <div style={{
                      fontSize: '0.98rem',
                      color: '#b00',
                      fontWeight: 400,
                      marginTop: 10,
                    }}>
                      Warning: Your pipeline contains cycles which may cause infinite loops.
                    </div>
                  )}
                </div>,
                {
                    position: "top-right",
                    autoClose: 7000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    icon: false,
                }
            );
            
        } catch (error) {
            console.error('Error submitting pipeline:', error);
            
            // Dismiss loading toast
            toast.dismiss(loadingToast);
            
            toast.error(
                <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                        ❌ Error submitting pipeline
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                        {error.message}
                    </div>
                    <div style={{ 
                        fontSize: '12px', 
                        color: '#666', 
                        marginTop: '8px',
                        fontStyle: 'italic'
                    }}>
                        Make sure the backend server is running on http://localhost:8000
                    </div>
                </div>,
                {
                    position: "top-right",
                    autoClose: 7000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            );
        }
    };

    return (
        <div style={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px',
            marginTop: '20px'
        }}>
            <button 
                type="button"
                onClick={handleSubmit}
                disabled={nodes.length === 0}
                style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    backgroundColor: nodes.length === 0 ? '#cccccc' : '#2196F3',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: nodes.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(33, 150, 243, 0.3)',
                    opacity: nodes.length === 0 ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                    if (nodes.length > 0) {
                        e.currentTarget.style.backgroundColor = '#1976D2';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(33, 150, 243, 0.4)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (nodes.length > 0) {
                        e.currentTarget.style.backgroundColor = '#2196F3';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(33, 150, 243, 0.3)';
                    }
                }}
            >
                {nodes.length === 0 ? 'Add nodes to submit' : 'Submit Pipeline'}
            </button>
        </div>
    );
}