import './Style.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {

  return (
    <div className='w-12 h-12'>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);