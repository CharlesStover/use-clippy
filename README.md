# useClippy [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=useClippy%20lets%20you%20manage%20your%20users'%20clipboards%20with%20a%20React%20Hook.&url=https://github.com/CharlesStover/use-clippy&via=CharlesStover&hashtags=react,reactjs,javascript,typescript,webdev,webdevelopment) [![version](https://img.shields.io/npm/v/use-clippy.svg)](https://www.npmjs.com/package/use-clippy) [![minified size](https://img.shields.io/bundlephobia/min/use-clippy.svg)](https://www.npmjs.com/package/use-clippy) [![minzipped size](https://img.shields.io/bundlephobia/minzip/use-clippy.svg)](https://www.npmjs.com/package/use-clippy) [![downloads](https://img.shields.io/npm/dt/use-clippy.svg)](https://www.npmjs.com/package/use-clippy) [![build](https://api.travis-ci.com/CharlesStover/use-clippy.svg)](https://travis-ci.com/CharlesStover/use-clippy/)

`useClippy` is a TypeScript-friendly React hook for reading from and writing to
the user's clipboard.

_Not to be confused with Microsoft Office's assistant, Clippy._ 📎

## Demo

You can see
[`use-clippy` in action via GitHub Pages](https://charlesstover.github.io/use-clippy/),
which hosts the
[`demo`](https://github.com/CharlesStover/demo/tree/master/src) directory.

## Install

- `npm install use-clippy` or
- `yarn add use-clippy`

## Use

`useClippy()` returns a tuple analogous to `useState`, where the first item is
the clipboard contents and the second item is a function for setting the
clipboard contents.

```JavaScript
import React from 'react';
import useClippy from 'use-clippy';

export default function MyComponent() {

  // clipboard is the contents of the user's clipboard.
  // setClipboard('new value') wil set the contents of the user's clipboard.
  const [clipboard, setClipboard] = useClippy();

  return (
    <div>

      {/* Button that demonstrates reading the clipboard. */}
      <button
        onClick={() => {
          alert(`Your clipboard contains: ${clipboard}`);
        }}
      >
        Read my clipboard
      </button>

      {/* Button that demonstrates writing to the clipboard. */}
      <button
        onClick={() => {
          setClipboard(`Random number: ${Math.random()}`);
        }}
      >
        Copy something new
      </button>
    </div>
  );
}
```

## Sponsor 💗

If you are a fan of this project, you may
[become a sponsor](https://github.com/sponsors/CharlesStover)
via GitHub's Sponsors Program.
