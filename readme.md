# download-chakracore

**Download a [Node-ChakraCore](https://github.com/nodejs/node-chakracore#installing-prebuilt-node-chakracore-binaries) binary.**

[![npm version](https://img.shields.io/npm/v/download-chakracore.svg)](https://www.npmjs.com/package/download-chakracore)
[![build status](https://img.shields.io/travis/derhuerst/download-chakracore.svg)](https://travis-ci.org/derhuerst/download-chakracore)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/download-chakracore.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)


## Installing

```shell
npm install download-chakracore
```


## Requirements

In order to use this, you need `unzip` or `tar`. `download-chakracore` will prefer `.zip` over `.tar.gz` when downloading from [the releases](https://github.com/nodejs/node-chakracore/releases).


## Usage from the command line

```shell
download-chakracore <destination>
```

`destination` must be the final path of the `node` executable.


## Usage from JS

```js
const download = require('download-chakracore')

download(dest, [version], [arch], [platform], [cache], [log])
```

- `dest` must be the final path of the `node` executable.
- `version` is `latest` by default.
- `arch` is `process.arch` by default.
- `platform` is `process.platform` by default.
- `cache` is [`require('env-paths')().cache`](https://github.com/sindresorhus/env-paths#pathscache) by default.

Returns a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) that rejects if an error occurs.


## Contributing

If you have a question or have difficulties using `download-chakracore`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/download-chakracore/issues).
