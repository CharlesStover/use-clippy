import Prism from 'prismjs';
import React, { RefObject } from 'react';

interface State {
  ref: RefObject<HTMLElement>;
}

export default function usePrism(): State {
  const ref: RefObject<HTMLElement> = React.useRef<HTMLElement>(null);

  React.useEffect((): void => {
    if (ref.current) {
      Prism.highlightElement(ref.current, false);
    }
    Prism.highlightAll();
  }, []);

  return {
    ref,
  };
}
