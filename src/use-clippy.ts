import useForceUpdate from 'use-force-update';

type ClipboardTuple = [
  string,
  (clipboard: string) => void,
];

const zeroStyles = (i: HTMLInputElement, ...properties: string[]): void => {
  for (const property of properties) {
    i.style.setProperty(property, '0');
  }
};

const createInput = (): HTMLInputElement => {
  const i: HTMLInputElement = document.createElement('input');
  i.setAttribute('size', '0');
  zeroStyles(i,
    'border-width', 'height',
    'margin-bottom', 'margin-left', 'margin-right', 'margin-top',
    'outline-width',
    'padding-bottom', 'padding-left', 'padding-right', 'padding-top',
    'width',
  );
  i.style.setProperty('box-sizing', 'border-box');
  document.body.appendChild(i);
  return i;
};

const removeInput = (i: HTMLInputElement): void => {
  document.body.removeChild(i);
};

const read = () => {
  const i = createInput();
  i.focus();
  document.execCommand('paste');
  const value = i.value;
  removeInput(i);
  return value;
};

const write = (text: string): void => {
  const i = createInput();
  i.setAttribute('value', text);
  i.select();
  document.execCommand('copy');
  removeInput(i);
};

// TODO: async/await
//   navigator.clipboard.readText() and navigator.clipboard.writeText()
const useClippy = (rerender: boolean = true): ClipboardTuple => {
  const forceUpdate = useForceUpdate();
  return [

    read(),

    function clipboardWrite(text: string): void {
      write(text);
      if (rerender) {
        forceUpdate();
      }
    }

  ];
};

// Required for TypeScript to output a correct .d.ts file.
export default useClippy;

module.exports = useClippy;
module.exports.default = useClippy;
