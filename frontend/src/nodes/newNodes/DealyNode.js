import { BaseNode } from '../BaseNode';
import { useStore } from '../../store';
export const DelayNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Delay"
      inputs={[{ id: 'input', label: 'Input' }]}
      outputs={[{ id: 'output', label: 'Output' }]}
      fields={[
        {
          type: 'number',
          name: 'duration',
          label: 'Duration (seconds)',
          defaultValue: 1,
          min: 0,
          step: 0.1
        },
        {
          type: 'select',
          name: 'unit',
          label: 'Unit',
          defaultValue: 'seconds',
          options: [
            { value: 'seconds', label: 'Seconds' },
            { value: 'minutes', label: 'Minutes' },
            { value: 'hours', label: 'Hours' }
          ]
        }
      ]}
      content={<span style={{ fontSize: '10px', color: '#666' }}>⏱️ Time delay</span>}
      onFieldChange={(fieldName, value) => updateNodeField(id, fieldName, value)}
      
    />
  );
};