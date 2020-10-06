import React, { FormEvent } from 'react';
import useClippy from 'use-clippy';

interface State {
  clipboard: string;
  handleTextAreaCopyClick(): void;
  handleTextAreaChange(event: FormEvent<HTMLTextAreaElement>): void;
  isInputCopyDisabled: boolean;
  textAreaValue: string;
}

export default function useApp(): State {
  const [clipboard, setClipboard] = useClippy();

  const [textAreaValue, setTextAreaValue] = React.useState('some value');

  const handleTextAreaChange = React.useCallback(
    (e: FormEvent<HTMLTextAreaElement>): void => {
      const newValue: string = e.currentTarget.value;
      setTextAreaValue(newValue);
    },
    [],
  );

  const handleTextAreaCopyClick = React.useCallback((): void => {
    setClipboard(textAreaValue);
  }, [setClipboard, textAreaValue]);

  // Page mysteriously loads in the middle. Probably due to Prism rendering
  //   styles asynchronously. Scroll to the top of the body on load to fix this.
  React.useEffect((): void => {
    window.document.body.scrollIntoView();
  }, []);

  return {
    clipboard,
    handleTextAreaChange,
    handleTextAreaCopyClick,
    isInputCopyDisabled: clipboard === textAreaValue,
    textAreaValue,
  };
}
