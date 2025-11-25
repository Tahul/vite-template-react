import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import GradientSelector from './components/GradientSelector';

const App = () => {
  const [count, setCount] = useState(0);
  const [currentGradient, setCurrentGradient] = useState(null);

  return (
    <div className="App">
      <GradientSelector onGradientChange={setCurrentGradient} />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Vite + React</h1>
        <p>
          <button onClick={() => setCount(count => count + 1)}>
            gigacount is {count}
          </button>
        </p>
        <p>
          Edit <code>App.jsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
        {currentGradient && (
          <p className="current-gradient-info">
            Current gradient: {currentGradient.name}
          </p>
        )}
      </header>
    </div>
  );
};

export default App;
