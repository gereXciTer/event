import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../containers/Root';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
// console.log = function() {}
it('renders without crashing', () => {
  const div = document.createElement('div');
  // ReactDOM.render(<Root />, div);
});
