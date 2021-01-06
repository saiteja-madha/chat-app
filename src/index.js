import React from 'react';
import ReactDOM from 'react-dom';
import reducer, { initialState } from './contexts/reducer';
import { StateProvider } from './contexts/StateProvier';
import './index.css';
import Main from './Main';


ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <Main />
    </StateProvider>
  </React.StrictMode>,
  document.getElementById('root')
);