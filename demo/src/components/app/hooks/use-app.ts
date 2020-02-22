import React, { FormEvent } from 'react';
import useClippy from 'use-clippy';

interface State {
  clipboard: string;
  handleInputChange(event: FormEvent<HTMLInputElement>): void;
  handleInputCopyClick(): void;
  inputValue: string;
  isInputCopyDisabled: boolean;
}

export default function useApp(): State {
  const [clipboard, setClipboard] = useClippy();

  const [inputValue, setInputValue] = React.useState<string>('some value');

  const handleInputChange = React.useCallback(
    (e: FormEvent<HTMLInputElement>): void => {
      const newInputValue: string = e.currentTarget.value;
      setInputValue(newInputValue);
    },
    [setInputValue],
  );

  const handleInputCopyClick = React.useCallback((): void => {
    setClipboard(inputValue);
  }, [inputValue, setClipboard]);

  // Page mysteriously loads in the middle. Probably due to Prism rendering
  //   styles asynchronously. Scroll to the top of the body on load to fix this.
  React.useEffect((): void => {
    window.document.body.scrollIntoView();
  }, []);

  return {
    clipboard,
    handleInputChange,
    handleInputCopyClick,
    inputValue,
    isInputCopyDisabled: clipboard === inputValue,
  };
}
