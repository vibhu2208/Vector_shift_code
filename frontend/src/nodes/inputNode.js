import { BaseNode } from './BaseNode';
import { useStore } from '../store';

// InputNode.js
export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Input"
      outputs={[{ id: 'value', label: 'Value' }]}
      fields={[
        {
          type: 'text',
          name: 'inputName',
          label: 'Name',
          defaultValue: id.replace('customInput-', 'input_')
        },
        {
          type: 'select',
          name: 'inputType',
          label: 'Type',
          defaultValue: 'Text',
          options: [
            { value: 'Text', label: 'Text' },
            { value: 'File', label: 'File' }
          ]
        }
      ]}
      onFieldChange={(fieldName, value) => updateNodeField(id, fieldName, value)}
    />
  );
};


