const App = props => React.createElement(
  'div',
  null,
  React.createElement(
    'p',
    null,
    'Hello React3!'
  ),
  React.createElement(
    FancyButton,
    null,
    'Click'
  )
);

ReactDOM.render(React.createElement(App, null), document.getElementById('app-root'), () => console.log('Ready to go5'));
//# sourceMappingURL=index.js.map