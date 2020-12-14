import 'antd/dist/antd.css';
import './common.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { LocationProvider } from '@reach/router';
import { App } from './App';
import { StateProvider } from './globalState';

const initialState = {
  searchResults: {
    hits: [],
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SEARCH_RESULTS': {
      return { ...state, searchResults: action.payload };
    }
    case 'CLEAR_SEARCH_RESULTS': {
      return { ...state, searchResults: initialState.searchResults.hits };
    }

    default:
      return state;
  }
};

ReactDOM.render(
  <LocationProvider>
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </LocationProvider>,
  document.getElementById('root'),
);
