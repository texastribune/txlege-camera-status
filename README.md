# TXLege Camera Status

A quick script that attempts to confirm whether a Texas House or Senate Granicus stream is live or not.

## Installation

```sh
npm install [--save-dev] txlege-camera-status
```

## Usage

```js
const { isCameraLive } = require('txlege-camera-status');

// first parameter is chamber, second parameter is camera ID
isCameraLive('house', 3).then((cameraIsLive) => {
  // if camera is live, `cameraIsLive` is true
});
```

There's also a tiny command line tool built in, too. (Mostly exists from when I was testing the script.)

```sh
> is-txlege-camera-live house 3
true
```

## License

MIT
