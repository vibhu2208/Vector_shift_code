// outputNode.js

import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Output"
      inputs={[{ id: 'value', label: 'Value' }]}
      fields={[
        {
          type: 'text',
          name: 'outputName',
          label: 'Name',
          defaultValue: id.replace('customOutput-', 'output_')
        },
        {
          type: 'select',
          name: 'outputType',
          label: 'Type',
          defaultValue: 'Text',
          options: [
            { value: 'Text', label: 'Text' },
            { value: 'Image', label: 'Image' }
          ]
        }
      ]}
      onFieldChange={(fieldName, value) => updateNodeField(id, fieldName, value)}
    />
  );
};
