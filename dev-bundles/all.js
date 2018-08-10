const FancyButton = props => React.createElement(
  "button",
  { className: "sr-fancy-button" },
  props.children
);
const App = props => React.createElement(
  'div',
  null,
  React.createElement(
    'p',
    null,
    'Hello React!'
  ),
  React.createElement(
    FancyButton,
    null,
    'Click here'
  )
);

ReactDOM.render(React.createElement(App, null), document.getElementById('app-root'), () => console.log('Ready to go5'));
