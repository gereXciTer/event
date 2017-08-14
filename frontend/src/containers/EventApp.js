import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from '../components/Home'

export default class EventApp extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Router>
          <Switch>
            <Route path="/" component={Home} appTitle={this.props.appTitle} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    )
  }
}
