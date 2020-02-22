import React from 'react';
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
      <h1>use-clippy demo</h1>
      <section>
        <h2>Clipboard contents</h2>
        <textarea disabled value={clipboard} />
        <p>Your clipboard's contents are displayed here.</p>
      </section>
      <section>
        <h2>Set your clipboard</h2>
        <input onChange={handleInputChange} value={inputValue} />
        <button disabled={isInputCopyDisabled} onClick={handleInputCopyClick}>
          Copy
        </button>
        <p>
          Clicking the <em>Copy</em> button will set your clipboard's value to
          the input value.
        </p>
        <p>
          <strong>Note:</strong> By reading your clipboard, the <em>Copy</em>{' '}
          button is disabled if your clipboard already matches the input value.
        </p>
      </section>
    </main>
  );
}
