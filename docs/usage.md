# Usage

<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [With Hamber VS Code](#with-hamber-config)
- [With HamberKit](#with-hamber-config)
- [With `rollup-plugin-hamber`](#with-rollup-plugin-hamber)
- [With `hamber-loader`](#with-hamber-loader)
- [With Ramber](#with-ramber)

<!-- /code_chunk_output -->

## With Hamber Config

Some tools of the Hamber ecosystem, such as [hamber-vscode](https://marketplace.visualstudio.com/items?itemName=hamberjs.hamber-vscode) and [hamber-kit](https://github.com/hamberjs/kit), need access to your hamber configuration so they know how to properly handle your Hamber files. This can be achieved by creating a `hamber.config.js` file at the root of your project which exports a hamber options object (similar to `hamber-loader` and `rollup-plugin-hamber`).

**Example**:

```js
// hamber.config.js
import preprocess from 'hamber-preprocess';

/** 
 * This will add autocompletion if you're working with HamberKit
 * 
 * @type {import('@hamberjs/kit').Config} 
 */
const config = {
  preprocess: preprocess({
    // ...hamber-preprocess options
  }),
  // ...other hamber options
};

export default config;
```

_Tip: this file can be imported in your bundle config instead of having multiple hamber configurations lying around._

## With `rollup-plugin-hamber`

```js
// rollup.config.js
import hamber from 'rollup-plugin-hamber';
import hamberPreprocess from 'hamber-preprocess'
import { scss, coffeescript, pug } from 'hamber-preprocess'

export default {
  ...,
  plugins: [
    hamber({
      /**
       * Auto preprocess supported languages with
       * '<template>'/'external src files' support
       **/
      preprocess: hamberPreprocess({ /* options */ })
      /**
       * It is also possible to manually enqueue
       * stand-alone processors
       * */
      preprocess: [
        pug({ /* pug options */ }),
        scss({ /* scss options */ }),
        coffeescript({ /* coffeescript options */ })
      ]
    })
  ]
}
```

## With `hamber-loader`

```js
  ...
  module: {
    rules: [
      ...
      {
        test: /\.(html|hamber)$/,
        exclude: [],
        use: {
          loader: 'hamber-loader',
          options: {
            preprocess: require('hamber-preprocess')({
              /* options */
          })
          },
        },
      },
      ...
    ]
  }
  ...
```

## With Ramber

[Ramber](https://ramberjs.web.app/) has two build configurations, one for the client bundle and one for the server. To use `hamber-preprocess` with Ramber, you need to define it on both configurations.

```js
// ...
import hamberPreprocess from 'hamber-preprocess';

const preprocess = hamberPreprocess({
  postcss: true,
  // ...
});

export default {
  client: {
    plugins: [
      hamber({
        preprocess,
        // ...
      }),
  },
  server: {
    plugins: [
      hamber({
        preprocess,
        // ...
      }),
    ],
  },
};
```
