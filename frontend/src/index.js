import 'babel-polyfill';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import React from 'react';
import ReactDOM from 'react-dom';

import Root from './containers/Root';
import './index.css';

ReactDOM.render(
  <Root appTitle="Title" />,
  document.getElementById('root')
);
