import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import ThemeContext from './contexts/ThemeContext';

function Main() {
  const [theme, setTheme] = React.useState('dark');
  return (
    <React.StrictMode>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <App />
      </ThemeContext.Provider>
    </React.StrictMode>
  )
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);

reportWebVitals();
