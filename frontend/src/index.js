import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as Config from "./config/index.jsx";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Config.Provider>
      <App />
    </Config.Provider>
  </React.StrictMode>
);


