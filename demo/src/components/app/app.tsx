import React from 'react';
import { Code } from '..';
import { useApp } from './hooks';
import './app.scss';

export default function App(): JSX.Element {
  const {
    clipboard,
    handleInputChange,
    handleInputCopyClick,
    inputValue,
    isInputCopyDisabled,
  } = useApp();

  return (
    <main>
      <h1>
        <a
          href="https://www.npmjs.com/package/use-clippy"
          rel="noreferrer noopener"
          title="use-clippy - npm"
        >
          use-clippy
        </a>{' '}
        demo
      </h1>
      <section>
        <h2>Reading your clipboard</h2>
        <p>Your clipboard's contents are displayed here.</p>
        <textarea disabled value={clipboard} />
        <Code>{`
const [clipboard] = useClippy();

return <textarea disabled value={clipboard} />;
        `}</Code>
      </section>
      <section>
        <h2>Setting your clipboard</h2>
        <p>
          Clicking the <em>Copy</em> button will set your clipboard's value to
          the input value.
        </p>
        <p>
          <strong>Note:</strong> By reading your clipboard, the <em>Copy</em>{' '}
          button is disabled if your clipboard already matches the input value.
        </p>
        <input onChange={handleInputChange} value={inputValue} />
        <button disabled={isInputCopyDisabled} onClick={handleInputCopyClick}>
          Copy
        </button>
        <Code>{`
const [clipboard, setClipboard] = useClippy();

const isCopyDisabled = clipboard === inputValue;

const handleCopyClick = React.useCallback(() => {
  setClipboard(inputValue);
}, [inputValue]);

return (
  <button disabled={isCopyDisabled} onClick={handleCopyClick}>
    Copy
  </button>
);
        `}</Code>
      </section>
    </main>
  );
}
