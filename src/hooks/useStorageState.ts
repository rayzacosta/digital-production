import React from 'react';

function useStorageState<T = any>(key: string) {
  const sData = localStorage.getItem(key);
  const initialData = sData ? JSON.parse(sData) : null;
  const [state, setState] = React.useState<T>(initialData);

  const handleSetState = (newValue: any) => {
    setState(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [state as T, handleSetState];
}

export { useStorageState };
