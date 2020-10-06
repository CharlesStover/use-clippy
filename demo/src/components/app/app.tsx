import React, { ReactElement } from 'react';
import { Code } from '..';
import { useApp } from './hooks';
import './app.scss';

export default function App(): ReactElement {
  const {
    clipboard,
    handleTextAreaChange,
    handleTextAreaCopyClick,
    isInputCopyDisabled,
    textAreaValue,
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
        <a
          href="https://twitter.com/intent/tweet?text=useClippy%20lets%20you%20manage%20your%20users'%20clipboards%20with%20a%20React%20hook.&amp;url=https://www.npmjs.com/package/use-clippy&amp;via=CharlesStover&amp;hashtags=react,reactjs,javascript,typescript,webdev,webdevelopment"
          rel="nofollow noreferrer noopener"
          target="_blank"
          title="Share use-clippy on Twitter"
        >
          <img
            alt="Tweet"
            height={20}
            src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social"
          />
        </a>
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
        <textarea onChange={handleTextAreaChange} value={textAreaValue} />
        <button disabled={isInputCopyDisabled} onClick={handleTextAreaCopyClick}>
          Copy
        </button>
        <Code>{`
const [clipboard, setClipboard] = useClippy();

const isDisabled = clipboard === textAreaValue;

const handleClick = React.useCallback(() => {
  setClipboard(textAreaValue);
}, [setClipboard, textAreaValue]);

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
