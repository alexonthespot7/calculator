import './App.css';

import { useContext } from 'react';

import DarkContent from './Components/DarkContent';
import LightContent from './Components/LightContent';

import ThemeContext from './contexts/ThemeContext';

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className='App'>
      {theme === 'dark' && <DarkContent />}
      {theme === 'light' && <LightContent />}
    </div>

  );
}

export default App;
