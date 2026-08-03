# Getting Started

<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [1. Installation](#1-installation)
- [2. Adding `hamber-preprocess` to our build workflow](#2-adding-hamber-preprocess-to-our-build-workflow)
- [3. Configuring preprocessors](#3-configuring-preprocessors)
  - [3.1 Prepending content](#31-prepending-content)

<!-- /code_chunk_output -->

_Note: The examples below are going to be using a hypothetical `rollup.config.js` as if we were configuring a simple Hamber application, but `hamber-preprocess` can be used in various setups. See "[Usage](usage.md)"._

## 1. Installation

First things first, let's create a new Hamber app project and add `hamber-preprocess`.

```shell
$ npx degit hamberjs/template my-hamber-app
$ cd my-hamber-app
$ npm install -D hamber-preprocess
```

`hamber-preprocess` doesn't have any language-specific dependency, so it's up to us to install the rest of tools we are going to use:

- Babel: `npm install -D @babel/core @babel/preset-...`
- CoffeeScript: `npm install -D coffeescript`
- TypeScript: `npm install -D typescript`
- PostCSS: `npm install -D postcss postcss-load-config`
- SugarSS: `npm install -D postcss sugarss`
- Less: `npm install -D less`
- Sass: `npm install -D sass`
- Pug: `npm install -D pug`
- Stylus: `npm install -D stylus`

For now, let's just install the main library.

## 2. Adding `hamber-preprocess` to our build workflow

Let's use `hamber-preprocess` in [auto-preprocessing mode](/docs/preprocessing.md#auto-preprocessing) and add it to our `rollup.config.js`:

```diff
import hamber from 'rollup-plugin-hamber'
+ import hamberPreprocess from 'hamber-preprocess';

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js',
  },
  plugins: [
    hamber({
+      preprocess: hamberPreprocess(),
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write('public/bundle.css')
      },
    }),
  ],
}
```

Now our app's code can be written in any of the syntaxes supported by `hamber-preprocess`: Sass, Stylus, Less, CoffeeScript, TypeScript, Pug, PostCSS, Babel.

_**Note:** If you use VS Code, check [its usage guide](/docs/usage.md#with-hamber-vs-code) to make the Hamber VS Code extension understand the content of your components._

## 3. Configuring preprocessors

Now let's assume our app markup is going to be written in Pug, our scripts in TypeScript, and our styles in Sass. We also want our styles to be auto-prefixed, so we're also going to need PostCSS. Let's install these dependencies:

**Important:** `hamber-preprocess` only handles content passed to it by `hamber-loader`, `rollup-plugin-hamber` and similar tools. If our TypeScript component import a TypeScript file, the bundler will be the one responsible for handling it. We must make sure it knows how to handle it!

```shell
$ npm i -D typescript sass postcss autoprefixer pug @rollup/plugin-typescript
```

After the installation is complete, we still need to configure our PostCSS options and add `@rollup/plugin-typescript` to our config.

```diff
import hamber from 'rollup-plugin-hamber'
import hamberPreprocess from 'hamber-preprocess';
+ import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js',
  },
  plugins: [
+    // teach rollup how to handle typescript imports
+    typescript({ sourceMap: !production }),
    hamber({
+      preprocess: hamberPreprocess({
+         sourceMap: !production,
+         postcss: {
+           plugins: [require('autoprefixer')()]
+         }
+      }),
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write('public/bundle.css')
      },
    }),
  ],
}
```

And we're done! Our components can now be written as:

```html
<template lang="pug">
  h1 {name}
</template>

<script lang="ts">
  export let name: string = 'world';
</script>

<style lang="scss">
  h1 {
    color: red;
  }
</style>
```
### 3.1 Prepending content

Now we're in need of a SCSS file to hold some variables. Let's assume it's created at `src/styles/variables.scss`.

```scss
// src/styles/variables.scss
$primary-color: red;
```

As in any SCSS project, we could just `@use './path/to/variables.scss`, but that can also become boring. `hamber-preprocess` [accepts a `prependData`](/docs/preprocessing.md#preprocessors) for almost every processor. Let's use it to prepend our import!

```diff
import hamber from 'rollup-plugin-hamber'
import hamberPreprocess from 'hamber-preprocess';

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js',
  },
  plugins: [
    hamber({
      preprocess: hamberPreprocess({
         sourceMap: !production,
+        scss: {
+          // We can use a path relative to the root because
+          // hamber-preprocess automatically adds it to `includePaths`
+          // if none is defined.
+          prependData: `@import 'src/styles/variables.scss';`
+        },
         postcss: {
           plugins: [require('autoprefixer')()]
         }
      }),
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write('public/bundle.css')
      },
    }),
  ],
}
```

Voila! We can now reference a variable from our file without having to explicitly import it.

```html
<template lang="pug">
  h1 {name}
</template>

<script lang="ts">
  export let name: string = 'world';
</script>

<style lang="scss">
  h1 {
    color: $primary-color;
  }
</style>
```
