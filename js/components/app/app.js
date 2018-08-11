const App = props => React.createElement(
  'div',
  null,
  React.createElement(
    'p',
    null,
    'Hello React!'
  ),
  React.createElement(
    MyButton,
    null,
    'Click'
  )
);

ReactDOM.render(React.createElement(App, null), document.getElementById('app-root'), () => console.log('Ready to go5'));
//# sourceMappingURL=app.js.map