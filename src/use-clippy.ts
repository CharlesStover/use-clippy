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



const zeroStyles = (i: HTMLInputElement, ...properties: string[]): void => {
  for (const property of properties) {
    i.style.setProperty(property, '0');
  }
};

const createInput = (): HTMLInputElement => {
  const i: HTMLInputElement = document.createElement('input');
  i.setAttribute('size', '0');
  zeroStyles(i,
    'border-width',
    'bottom',
    'margin-left', 'margin-top',
    'outline-width',
    'padding-bottom', 'padding-left', 'padding-right', 'padding-top',
    'right',
  );
  i.style.setProperty('box-sizing', 'border-box');
  i.style.setProperty('height', '1px');
  i.style.setProperty('margin-bottom', '-1px');
  i.style.setProperty('margin-right', '-1px');
  i.style.setProperty('max-height', '1px');
  i.style.setProperty('max-width', '1px');
  i.style.setProperty('min-height', '1px');
  i.style.setProperty('min-width', '1px');
  i.style.setProperty('outline-color', 'transparent');
  i.style.setProperty('position', 'absolute');
  i.style.setProperty('width', '1px');
  document.body.appendChild(i);
  return i;
};

const removeInput = (i: HTMLInputElement): void => {
  document.body.removeChild(i);
};

const read = (): string => {
  const i = createInput();
  i.focus();
  const success = document.execCommand('paste');

  // If we don't have permission to read the clipboard,
  //   cleanup and throw an error.
  if (!success) {
    removeInput(i);
    throw NOT_ALLOWED_ERROR;
  }
  const value = i.value;
  removeInput(i);
  return value;
};

const write = (text: string): void => {
  const i = createInput();
  i.setAttribute('value', text);
  i.select();
  const success = document.execCommand('copy');
  removeInput(i);
  if (!success) {
    throw NOT_ALLOWED_ERROR;
  }
};

const useClippy = (): ClipboardTuple => {
  const [ clipboard, setClipboard ] = React.useState('');

  // If the user manually updates their clipboard,
  //   re-render with the new value.
  React.useEffect((): void | VoidFunction => {
    if (isClipboardApiEnabled(navigator)) {
      const clipboardListener = ({ clipboardData }: ClipboardEvent) => {
        const cd: DataTransfer | null =
          clipboardData ||
          getClipboardData(window) ||
          null;
        if (cd) {
          const text = cd.getData('text/plain');
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
  }, [ clipboard ]);

  // Try to read synchronously.
  try {
    const text: string = read();
    if (clipboard !== text) {
      setClipboard(text);
    }
  }

  // If synchronous reading is disabled, try to read asynchronously.
  catch (e) {
    if (isClipboardApiEnabled(navigator)) {
      (async (): Promise<void> => {
        try {
          const text: string = await navigator.clipboard.readText();
          if (clipboard !== text) {
            setClipboard(text);
          }
        }
        catch (_e) { }
      })();
    }
  }

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
        catch (_e) { }
      }
    }
  }, []);

  return [
    clipboard,
    syncClipboard,
  ];
};

// Required for TypeScript to output a correct .d.ts file.
export default useClippy;

module.exports = useClippy;
module.exports.default = useClippy;
