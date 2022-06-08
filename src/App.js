import './App.css';

import { useContext } from 'react';

import DarkAll from './Components/DarkAll';
import LightAll from './Components/LightAll';

import ThemeContext from './contexts/ThemeContext';

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className='App'>
      {theme==='dark' && <DarkAll />}
      {theme==='light' && <LightAll />}
    </div>
    
  );
}

export default App;
