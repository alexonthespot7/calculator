import './App.css';

import Calculator from './Components/Calculator';
import Header from './Components/Header';
import bcground2 from './assets/bcground2.mp4';

function App() {
  return (
    <div className='App'>
      <video autoPlay loop muted>
        <source src={bcground2} type='video/mp4' />
      </video>
      <div className='App-header'></div>
      <div>
        <Header />
        <Calculator />
      </div>
    </div>
    
  );
}

export default App;
