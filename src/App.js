import './App.css';

import { useState } from 'react';

import DarkAll from './Components/DarkAll';
import LightAll from './Components/LightAll';

function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <div className='App'>
      {theme==='dark' && <DarkAll setTheme={setTheme} />}
      {theme==='light' && <LightAll setTheme={setTheme} />}
    </div>
    
  );
}

export default App;
