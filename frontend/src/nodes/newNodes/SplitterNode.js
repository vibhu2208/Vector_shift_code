import { BaseNode } from '../BaseNode';
import { useStore } from '../../store';
export const SplitterNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Splitter"
      inputs={[{ id: 'input', label: 'Input' }]}
      outputs={[
        { id: 'output1', label: 'Out 1' },
        { id: 'output2', label: 'Out 2' },
        { id: 'output3', label: 'Out 3' }
      ]}
      fields={[
        {
          type: 'select',
          name: 'splitType',
          label: 'Split Type',
          defaultValue: 'duplicate',
          options: [
            { value: 'duplicate', label: 'Duplicate' },
            { value: 'by_delimiter', label: 'By Delimiter' },
            { value: 'by_length', label: 'By Length' }
          ]
        },
        {
          type: 'text',
          name: 'delimiter',
          label: 'Delimiter',
          defaultValue: ',',
          placeholder: 'e.g., comma, space'
        }
      ]}
      onFieldChange={(fieldName, value) => updateNodeField(id, fieldName, value)}
      
    />
  );
};