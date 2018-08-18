# Old School React Boilerplate

This is a lightweight, old-school React boilerplate without Webpack, great for rapid prototyping and designing in the browser.

## What's Included

This is an old-school project set up without any project bundler. Everything is automatically loaded in the index file, without any module loader, which is great for rapid prototyping and designing in the browser. The following is provided:

- Automatic JSX transformation to JS (no compilation to ES5 or below)
- Automatic CSS injection with `browser-refresh`, great for designing in the browser
- Dev server automatically loading CSS and JavaScript files from `src` into the `index` file with old-school `link` or `script `tags

## Usage

- `yarn install`
- `yarn run dev`
- Open `http://localhost:8080` to view the page.

Any JavaScript or CSS file added in the `src` directory will be automatically loaded in the `index` file.

## Build (experimental)

Run `yarn run build` to build the app. The artifacts will be placed in the `dist` folder.

**Note**

You can configure the dev server using the config file in `config.json`.

## Development

All the dev scripts are in the `tasks` folder. To run the tests for the scripts, run the following:

```
npx tape 'tasks/**/*.test.js'
```
