import { useState } from 'react';

let id = 0;
const useCustomId = () => {
  const [uniqueId] = useState(() => ++id);
  return uniqueId.toString();
};

const useWdgsId = (id?: string) => {
  const autoId = useCustomId();
  return id ? id : `wds-${autoId}`;
};

export default useWdgsId;
