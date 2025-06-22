import { BaseNode } from '../BaseNode';
import { useStore } from '../../store';

// 1. MathNode - Performs mathematical operations
export const MathNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Math"
      inputs={[
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' }
      ]}
      outputs={[{ id: 'result', label: 'Result' }]}
      fields={[
        {
          type: 'select',
          name: 'operation',
          label: 'Operation',
          defaultValue: 'add',
          options: [
            { value: 'add', label: 'Add (+)' },
            { value: 'subtract', label: 'Subtract (-)' },
            { value: 'multiply', label: 'Multiply (×)' },
            { value: 'divide', label: 'Divide (÷)' },
            { value: 'power', label: 'Power (^)' }
          ]
        }
      ]}
      onFieldChange={(fieldName, value) => updateNodeField(id, fieldName, value)}
    />
  );
};