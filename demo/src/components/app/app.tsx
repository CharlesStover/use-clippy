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
          target="_blank"
          title="use-clippy - npm"
        >
          use-clippy
        </a>{' '}
        demo
      </h1>
      <div>
        <img
          alt="npm version"
          height={20}
          src="https://img.shields.io/npm/v/use-clippy.svg"
        />
        <img
          alt="minzipped size"
          height={20}
          src="https://img.shields.io/bundlephobia/minzip/use-clippy.svg"
        />
        <img
          alt="npm downloads"
          height={20}
          src="https://img.shields.io/npm/dt/use-clippy.svg"
        />
      </div>
      <section>
        <h2>
          Reading your clipboard{' '}
          <span aria-label="" role="img">
            👓
          </span>
        </h2>
        <p>Your clipboard's contents are displayed here.</p>
        <textarea disabled value={clipboard} />
        <Code>{`
const [clipboard] = useClippy();

return <textarea disabled value={clipboard} />;
        `}</Code>
      </section>
      <section>
        <h2>
          Setting your clipboard{' '}
          <span aria-label="" role="img">
            ✍
          </span>
        </h2>
        <p>
          Clicking the <em>Copy</em> button will set your clipboard's value to
          the input value.
        </p>
        <p>
          The <em>Copy</em> button is disabled if your clipboard already matches
          the input value.
        </p>
        <p>The textarea in the previous section will update.</p>
        <input onChange={handleInputChange} value={inputValue} />
        <button disabled={isInputCopyDisabled} onClick={handleInputCopyClick}>
          Copy
        </button>
        <Code>{`
const [clipboard, setClipboard] = useClippy();

const isDisabled = clipboard === inputValue;

const handleClick = React.useCallback(() => {
  setClipboard(inputValue);
}, [inputValue]);

return (
  <button disabled={isDisabled} onClick={handleClick}>
    Copy
  </button>
);
        `}</Code>
      </section>
      <section>
        <h2>
          Sponsor{' '}
          <span aria-label="" role="img">
            💗
          </span>
        </h2>
        <p>
          If you are a fan of this project, you may{' '}
          <a
            href="https://github.com/sponsors/CharlesStover"
            rel="nofollow noreferrer noopener"
            target="_blank"
            title="Sponsor @CharlesStover on GitHub Sponsors"
          >
            become a sponsor
          </a>{' '}
          via GitHub's Sponsors Program.
        </p>{' '}
      </section>
    </main>
  );
}
