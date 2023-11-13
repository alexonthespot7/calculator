import React from 'react';

import './App.css';
import ThemeContext from './contexts/ThemeContext';

import Content from './Components/Content';

function App() {
  const [theme, setTheme] = React.useState('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className='App'>
        <Content />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
