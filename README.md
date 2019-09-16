# covi (competitive-visualizer)

[![Latest NPM release][npm-badge]][npm-badge-url]
[![Install Size][npm-size-badge]][npm-size-badge-url]
[![License][license-badge]][license-badge-url]

A command line tool to visualize test cases in competitive programming.

競技プログラミングのテストケースを可視化するコマンドラインツール。

## Installation

1. **Install [Google Chrome](https://www.google.com/chrome/)**
2. Install `yarn` (or `npm`)
3. `yarn global add covi` (or `npm install --global covi`)

We use [Carlo](https://github.com/GoogleChromeLabs/carlo) to render the GUI and it depends on Google Chrome.

## Usage

```bash
# print available commands
covi --help

# visualize a directed graph
covi graph --directed < input.txt
```

### Graph

#### Input

- `N`: The number of nodes
- `a_i`, `b_i`: Edge `i` (from `a_i` to `b_i`)
- `c_i`: Label of edge `i`

```
N
a_1 b_1 [c_1]
a_2 b_2 [c_2]
:
a_M b_M [c_M]
```

## Development

```bash
# install dependencies
$ yarn install

# serve with hot reload
$ yarn start

# build for production
$ yarn run build
```

## License

[![License][license-badge]][license-badge-url]

[npm-badge]: https://img.shields.io/npm/v/covi.svg
[npm-badge-url]: https://www.npmjs.com/package/covi
[npm-size-badge]: https://packagephobia.now.sh/badge?p=covi
[npm-size-badge-url]: https://packagephobia.now.sh/result?p=covi
[license-badge]: https://img.shields.io/github/license/rdrgn/covi
[license-badge-url]: ./LICENSE
