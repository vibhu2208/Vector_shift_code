import { BaseNode } from '../BaseNode';
import { useStore } from '../../store';
export const ConditionalNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Conditional"
      inputs={[
        { id: 'condition', label: 'Condition' },
        { id: 'true_input', label: 'True' },
        { id: 'false_input', label: 'False' }
      ]}
      outputs={[{ id: 'output', label: 'Output' }]}
      fields={[
        {
          type: 'select',
          name: 'operator',
          label: 'Operator',
          defaultValue: 'equals',
          options: [
            { value: 'equals', label: 'Equals (==)' },
            { value: 'not_equals', label: 'Not Equals (!=)' },
            { value: 'greater_than', label: 'Greater Than (>)' },
            { value: 'less_than', label: 'Less Than (<)' },
            { value: 'contains', label: 'Contains' }
          ]
        },
        {
          type: 'text',
          name: 'compareValue',
          label: 'Compare Value',
          defaultValue: '',
          placeholder: 'Value to compare against'
        }
      ]}
      content={<span style={{ fontSize: '10px', color: '#666' }}>🔀 If-Then-Else</span>}
      onFieldChange={(fieldName, value) => updateNodeField(id, fieldName, value)}
    />
  );
};