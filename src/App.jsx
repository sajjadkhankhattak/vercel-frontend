import Menu from './Menu';
import AuthDebugger from './components/AuthDebugger';
import './App.css';
import "bootstrap/dist/js/bootstrap.js";

function App() {
  return (
    <div className="App">
      <AuthDebugger />
      <Menu />
    </div>
  );
}

export default App;