import { useState, useEffect } from 'react';

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



const IS_CLIPBOARD_API_ENABLED = (
  typeof navigator === 'object' &&
  typeof (navigator as ClipboardNavigator).clipboard === 'object'
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

// TODO: async/await
//   navigator.clipboard.readText() and navigator.clipboard.writeText()
const useClippy = (): ClipboardTuple => {
  const [ clipboard, setClipboard ] = useState('');

  // If the user manually updates their clipboard,
  //   re-render with the new value.
  if (IS_CLIPBOARD_API_ENABLED) {
    useEffect(() => {
      const clipboardListener = ({ clipboardData }: ClipboardEvent) => {
        const cd: DataTransfer | null =
          clipboardData ||
          (window as ClipboardDataWindow).clipboardData ||
          null;
        if (cd) {
          const text = cd.getData('text/plain');
          if (clipboard !== text) {
            setClipboard(text);
          }
        }
      };
      const nav: ClipboardNavigator = navigator as ClipboardNavigator;
      nav.clipboard.addEventListener('copy', clipboardListener);
      nav.clipboard.addEventListener('cut', clipboardListener);
      return () => {
        nav.clipboard.removeEventListener('copy', clipboardListener);
        nav.clipboard.removeEventListener('cut', clipboardListener);
      };
    }, [ clipboard, setClipboard ]);
  }

  // Try to read synchronously.
  try {
    const text = read();
    if (clipboard !== text) {
      setClipboard(text);
    }
  }

  // If synchronous reading is disabled, try to read asynchronously.
  catch (e) {
    if (IS_CLIPBOARD_API_ENABLED) {
      const nav: ClipboardNavigator = navigator as ClipboardNavigator;
      nav.clipboard.readText()
        .then(text => {
          if (clipboard !== text) {
            setClipboard(text);
          }
        })
        .catch(() => {});
    }
  }
  return [

    clipboard,

    function clippySetter(text: string): void {

      /**
       * Always update the clipboard and re-render,
       *   even if the current value is the same.
       * This accounts for when the user updates their clipboard
       *   from outside the application.
       * This also allows render animations to re-trigger,
       *   e.g. "Copied successfully!"
       */
      try {
        write(text);
        setClipboard(text);
      }
      catch (e) {
        if (IS_CLIPBOARD_API_ENABLED) {
          const nav: ClipboardNavigator = navigator as ClipboardNavigator;
          nav.clipboard.writeText(text)
            .then(() => {
              setClipboard(text);
            })
            .catch(() => {});
        }
      }
    }

  ];
};

// Required for TypeScript to output a correct .d.ts file.
export default useClippy;

module.exports = useClippy;
module.exports.default = useClippy;
