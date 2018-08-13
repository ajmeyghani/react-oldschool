const App = (props) => (
  <div>
    <p>Hello React!!</p>
    <MyButton>Button</MyButton>
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app-root'),
  () => console.log('Ready to go5'),
);
