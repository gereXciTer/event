import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from '../configureStore'
import EventApp from './EventApp'

const store = configureStore({
  appTitle: 'Title'
})

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <EventApp appTitle={this.props.appTitle} />
      </Provider>
    );
  }
}

export default App;
