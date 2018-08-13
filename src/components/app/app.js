const App = (props) => (
  <div>
    <p>Hello React2!</p>
    <MyButton>Click</MyButton>
    <Footer></Footer>
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app-root'),
  () => console.log('Ready to go5'),
);
