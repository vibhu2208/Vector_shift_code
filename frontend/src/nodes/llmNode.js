// llmNode.js

import { BaseNode } from './BaseNode';
import { useStore } from '../store';


export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="LLM"
      inputs={[
        { id: 'system', label: 'System' },
        { id: 'prompt', label: 'Prompt' }
      ]}
      outputs={[{ id: 'response', label: 'Response' }]}
      content={<span style={{ fontSize: '11px', color: '#666' }}>Large Language Model</span>}
    />
  );
};