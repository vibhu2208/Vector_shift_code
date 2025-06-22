// draggableNode.js

export const DraggableNode = ({ type, label }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    // Node type specific styles
    const getNodeStyle = (type) => {
        const baseStyle = {
            cursor: 'grab',
            minWidth: '100px',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden'
        };

        const typeStyles = {
            customInput: {
                backgroundColor: '#E3F2FD',
                border: '2px solid #2196F3'
            },
            llm: {
                backgroundColor: '#E8F5E9',
                border: '2px solid #4CAF50'
            },
            customOutput: {
                backgroundColor: '#FCE4EC',
                border: '2px solid #E91E63'
            },
            text: {
                backgroundColor: '#FFF3E0',
                border: '2px solid #FF9800'
            },
            math: {
                backgroundColor: '#E8EAF6',
                border: '2px solid #3F51B5'
            },
            filter: {
                backgroundColor: '#F3E5F5',
                border: '2px solid #9C27B0'
            },
            delay: {
                backgroundColor: '#E0F7FA',
                border: '2px solid #00BCD4'
            },
            splitter: {
                backgroundColor: '#F1F8E9',
                border: '2px solid #8BC34A'
            },
            conditional: {
                backgroundColor: '#FFF8E1',
                border: '2px solid #FFC107'
            }
        };

        return {
            ...baseStyle,
            ...typeStyles[type]
        };
    };
  
    return (
      <div
        className={type}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        style={getNodeStyle(type)}
        draggable
      >
          <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              padding: '4px 8px',
              fontSize: '10px',
              color: '#666',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
              {type.replace(/([A-Z])/g, ' $1').trim()}
          </div>
          <span style={{ 
              color: '#333',
              fontWeight: '500',
              marginTop: '8px'
          }}>{label}</span>
      </div>
    );
};
  