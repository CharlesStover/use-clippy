import Prism from 'prismjs';
import React from 'react';

interface DangerouslySetInnerHTML {
  __html: string;
}

interface Props {
  children: string;
  lang: string;
}

interface State {
  dangerouslySetInnerHTML: DangerouslySetInnerHTML;
}

export default function usePrism({ children, lang }: Props): State {
  const dangerouslySetInnerHTML = React.useMemo(
    (): DangerouslySetInnerHTML => ({
      __html: Prism.highlight(children, Prism.languages[lang], lang),
    }),
    [children, lang],
  );

  return {
    dangerouslySetInnerHTML,
  };
}
