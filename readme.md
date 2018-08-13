# React Boilerplate 2018

This is a lightweight React boilerplate without Webpack. You can add Webpack if you need to, but I tried to keep things as simple as possible.

## What's Included

- JSX transformation to JS
- CSS concatenation
- Dev server with auto refresh using `browser-refresh`

## Usage

- `yarn install`
- `yarn run dev`
- Open `http://localhost:8080` to view the page.

Any JavaScript file added in the `src` folder is merged into one during development and is placed in `dev-bundles/all.js`. Similarly, any `css` file in the `src` folder is grouped into a single css file placed in `dev-bundles/all.css`.

## Build

Run `yarn run build` to build the app.

**Note**

You can configure the dev server using the config file in `dev-server/config.json`.

## Development

All the dev scripts are in the `dev-server/scripts` folder. To run the tests for the scripts, run the following:

```
npx tape 'dev-server/**/*.test.js'
```
