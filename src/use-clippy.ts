import * as React from 'react';

interface Clipboard {
  readText(): Promise<string>;
  writeText(text: string): Promise<void>;
}

interface ClipboardDataWindow extends Window {
  clipboardData: DataTransfer | null;
}

type ClipboardEventListener =
  EventListenerObject | null | ((event: ClipboardEvent) => void);

interface ClipboardEventTarget extends EventTarget {
  addEventListener(type: 'copy', eventListener: ClipboardEventListener): void;
  addEventListener(type: 'cut', eventListener: ClipboardEventListener): void;
  addEventListener(type: 'paste', eventListener: ClipboardEventListener): void;
  removeEventListener(type: 'copy', eventListener: ClipboardEventListener):
    void;
  removeEventListener(type: 'cut', eventListener: ClipboardEventListener):
    void;
  removeEventListener(type: 'paste', eventListener: ClipboardEventListener):
    void;
}

interface ClipboardNavigator extends Navigator {
  clipboard: Clipboard & ClipboardEventTarget;
}

type ClipboardTuple = [
  string,
  (clipboard: string) => void,
];

type VoidFunction = () => void;



const hasClipboardData = (w: Window): w is ClipboardDataWindow =>
  Object.prototype.hasOwnProperty.call(w, 'clipboardData');

const getClipboardData = (w: ClipboardDataWindow | Window): DataTransfer | null => {
  if (hasClipboardData(w)) {
    return w.clipboardData;
  }
  return null;
};

const isClipboardApiEnabled = (navigator: Navigator): navigator is ClipboardNavigator => (
  typeof navigator === 'object' &&
  typeof navigator.clipboard === 'object'
);

const NOT_ALLOWED_ERROR = new Error('NotAllowed');



const zeroStyles = (element: HTMLElement, ...properties: string[]): void => {
  for (const property of properties) {
    element.style.setProperty(property, '0');
  }
};

const createTextArea = (): HTMLTextAreaElement => {
  const textArea: HTMLTextAreaElement = document.createElement('textarea');
  textArea.setAttribute('cols', '0');
  textArea.setAttribute('rows', '0');
  zeroStyles(textArea,
    'border-width',
    'bottom',
    'margin-left', 'margin-top',
    'outline-width',
    'padding-bottom', 'padding-left', 'padding-right', 'padding-top',
    'right',
  );
  textArea.style.setProperty('box-sizing', 'border-box');
  textArea.style.setProperty('height', '1px');
  textArea.style.setProperty('margin-bottom', '-1px');
  textArea.style.setProperty('margin-right', '-1px');
  textArea.style.setProperty('max-height', '1px');
  textArea.style.setProperty('max-width', '1px');
  textArea.style.setProperty('min-height', '1px');
  textArea.style.setProperty('min-width', '1px');
  textArea.style.setProperty('outline-color', 'transparent');
  textArea.style.setProperty('position', 'absolute');
  textArea.style.setProperty('width', '1px');
  document.body.appendChild(textArea);
  return textArea;
};

const removeElement = (element: HTMLElement): void => {
  element.parentNode!.removeChild(element);
};

const read = (): string => {
  const textArea: HTMLTextAreaElement = createTextArea();
  textArea.focus();
  const success: boolean = document.execCommand('paste');

  // If we don't have permission to read the clipboard,
  //   cleanup and throw an error.
  if (!success) {
    removeElement(textArea);
    throw NOT_ALLOWED_ERROR;
  }
  const value: string = textArea.value;
  removeElement(textArea);
  return value;
};

const write = (text: string): void => {
  const textArea: HTMLTextAreaElement = createTextArea();
  textArea.value = text;
  textArea.select();
  const success: boolean = document.execCommand('copy');
  removeElement(textArea);
  if (!success) {
    throw NOT_ALLOWED_ERROR;
  }
};

const useClippy = (): ClipboardTuple => {
  const [clipboard, setClipboard] = React.useState('');

  // If the user manually updates their clipboard,
  //   re-render with the new value.
  React.useEffect((): void | VoidFunction => {
    if (isClipboardApiEnabled(navigator)) {
      const clipboardListener = ({ clipboardData }: ClipboardEvent): void => {
        const dataTransfer: DataTransfer | null =
          clipboardData ||
          getClipboardData(window) ||
          null;
        if (dataTransfer) {
          const text = dataTransfer.getData('text/plain');
          if (clipboard !== text) {
            setClipboard(text);
          }
        }
      };
      navigator.clipboard.addEventListener('copy', clipboardListener);
      navigator.clipboard.addEventListener('cut', clipboardListener);
      return (): void => {
        if (isClipboardApiEnabled(navigator)) {
          navigator.clipboard.removeEventListener('copy', clipboardListener);
          navigator.clipboard.removeEventListener('cut', clipboardListener);
        }
      };
    }

    // Fallback to reading document.getSelection
    const clipboardListener = (): void => {
      try {
        const selection: null | Selection = document.getSelection();
        if (selection) {
          setClipboard(selection.toString());
        }
      } catch (_err) { }
    }
    document.addEventListener('copy', clipboardListener);
    document.addEventListener('cut', clipboardListener);
    return (): void => {
      document.removeEventListener('copy',clipboardListener);
      document.removeEventListener('cut',clipboardListener);
    };
  }, [ clipboard ]);

  const syncClipboard = React.useCallback(async (text: string): Promise<void> => {
    try {
      write(text);
      setClipboard(text);
    }
    catch (e) {
      if (isClipboardApiEnabled(navigator)) {
        try {
          await navigator.clipboard.writeText(text);
          setClipboard(text);
        }
        catch (_err) { }
      }
    }
  }, []);

  // Try to read synchronously.
  React.useLayoutEffect((): void => {
    try {
      const text: string = read();
      if (clipboard !== text) {
        setClipboard(text);
      }
    }

    // If synchronous reading is disabled, try to read asynchronously.
    catch (_syncErr) {
      if (isClipboardApiEnabled(navigator)) {
        (async (): Promise<void> => {
          try {
            const text: string = await navigator.clipboard.readText();
            if (clipboard !== text) {
              setClipboard(text);
            }
          }
          catch (_asyncErr) { }
        })();
      }
    }
  }, [clipboard]);

  return [clipboard, syncClipboard];
};

// Required for TypeScript to output a correct .d.ts file.
export default useClippy;

module.exports = useClippy;
module.exports.default = useClippy;
