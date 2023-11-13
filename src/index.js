import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

function Main() {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);

reportWebVitals();
