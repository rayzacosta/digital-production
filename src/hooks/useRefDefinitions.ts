import React from 'react';

export type DimensionsState = {
  width: number;
  height: number;
};

export function useRefDimensions({
  initialValue,
  delay = 300,
}: {
  initialValue?: DimensionsState;
  delay?: number;
}): DimensionsState & { ref: React.RefObject<any> } {
  const ref = React.useRef<any>();

  const [dimensions, setDimensions] = React.useState<DimensionsState>(
    initialValue || { width: 0, height: 0 }
  );

  const handleCheckDimensions = () => {
    if (ref.current) {
      const { current } = ref;
      const boundingRect = current?.getBoundingClientRect?.();
      const { width, height } = boundingRect;

      setDimensions({ width: Math.round(width), height: Math.round(height) });
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => handleCheckDimensions(), delay);

    return () => clearTimeout(timer);
  });

  return { ...dimensions, ref };
}
