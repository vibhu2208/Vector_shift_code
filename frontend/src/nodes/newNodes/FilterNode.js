import { BaseNode } from '../BaseNode';
import { useStore } from '../../store';
export const FilterNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  return (
    <BaseNode
      id={id}
      data={data}
      title="Filter"
      inputs={[{ id: 'data', label: 'Data' }]}
      outputs={[{ id: 'filtered', label: 'Filtered' }]}
      fields={[
        {
          type: 'select',
          name: 'condition',
          label: 'Condition',
          defaultValue: 'contains',
          options: [
            { value: 'contains', label: 'Contains' },
            { value: 'equals', label: 'Equals' },
            { value: 'greater_than', label: 'Greater Than' },
            { value: 'less_than', label: 'Less Than' }
          ]
        },
        {
          type: 'text',
          name: 'value',
          label: 'Value',
          defaultValue: '',
          placeholder: 'Filter value'
        }
      ]}
      onFieldChange={(fieldName, value) => updateNodeField(id, fieldName, value)}
     
    />
  );
};