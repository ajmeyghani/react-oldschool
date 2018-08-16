module.exports = {
  "parser": "babel-eslint",
  "plugins": [
    "flowtype"
  ],
  extends: [
    'google',
    'plugin:react/recommended'
  ],
  env: {
    browser: true,
    node: true
  },
  rules: {
    'require-jsdoc': ['off', 'always'],
    'no-invalid-this': ['off', 'always'],
    'react/react-in-jsx-scope': ['off', 'always'],
    'react/jsx-no-undef': ['off', 'always'],
    'no-unused-vars': ['off', 'always'],
    'max-len': [1, 101, 2]
  },
  "settings": {
    "react": {
      "version": "16.0", // React version, default to the latest React stable release
    },
  },
};
