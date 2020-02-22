import React from 'react';
import { usePrism } from './hooks';

interface Props {
  children: string;
  lang: string;
}

export default function Prism({ children, lang }: Props): JSX.Element {
  const { dangerouslySetInnerHTML } = usePrism({ children, lang });

  return (
    <pre className={`language-${lang}`}>
      <code
        className={`language-${lang}`}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
    </pre>
  );
}
