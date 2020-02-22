import React from 'react';
import { usePrism } from './hooks';

interface Props {
  children: string;
  lang: string;
}

export default function Prism({ children, lang }: Props): JSX.Element {
  const { ref } = usePrism();

  return (
    <pre>
      <code className={`language-${lang}`} ref={ref}>
        {children}
      </code>
    </pre>
  );
}
