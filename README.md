# useClippy

`useClippy` is a React Hook for reading from and writing to the user's
clipboard.

_Not to be confused with Microsoft Office's Clippy assistant._ 📎

## Install

* `npm install use-clippy` or
* `yarn add use-clippy`

## Use

`useClippy()` returns a tuple analogous to `useState`, where the first item is
the clipboard contents and the second item is a function for setting the
clipboard contents.

```JavaScript
import useClippy from 'use-clippy';

function MyComponent() {

  // clipboard is the contents of the user's clipboard.
  // setClipboard('new value') wil set the cotnents of the user's clipboard.
  const [ clipboard, setClipboard ] = useClippy();

  return (
    <div>

      {/* Button that demonstrates reading the clipboard. */}
      <button
        onClick={() => {
          alert(`Your clipboard contains: ${clipboard}`);
        }}
        value="Read my clipboard"
      />

      {/* Button that demonstrates writing to the clipboard. */}
      <button
        onClick={() => {
          setClipboard(Math.random());
        }}
        value="Copy something new"
      />
    </div>
  );
}
```
