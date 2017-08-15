import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, Link } from 'react-router-dom';
import { doLogout, userAuth } from '../actions'

import Events from './Events'
import Event from './Event'
import Login from './Login'
import Signup from './Signup'
import Profile from './Profile'

import {AppBar, FlatButton, IconButton, IconMenu, MenuItem} from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Drawer from 'material-ui/Drawer';

class LoginButton extends Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <FlatButton {...this.props} label="Login/Sign Up" containerElement={<Link to="/login"/>} />
    );
  }
}

const LoggedMenu = (props) => (
  <IconMenu
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
  >
    <MenuItem primaryText={`Sign out (${props.user.name || ''})`} onTouchTap={props.handleLogout} />
  </IconMenu>
);

LoggedMenu.muiName = 'IconMenu';

class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      navOpen: false
    }
    this.showNavigation = this.showNavigation.bind(this)
    this.closeNavigation = this.closeNavigation.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.getDrawerWidth = this.getDrawerWidth.bind(this)
    this.props.dispatch(userAuth(success => {
      if(this.props.location.pathname === this.props.match.path){
        this.props.history.push(success ? this.props.user.redirectUrl || '/events' : '/login')
      }else if(!success){
        this.props.history.push('/login')
      }
    }))
  }

  showNavigation() {
    this.setState({
      navOpen: true
    })
  }

  closeNavigation() {
    this.setState({
      navOpen: false
    })
  }

  handleLogout() {
    this.props.dispatch(doLogout(()=>{
      this.props.history.push('/login')
    }))
  }

  getDrawerWidth() {
    return Math.min(400, Math.max(300, Math.round(window.innerWidth * 0.25)))
  }

  render() {
    return (
      <div>
        <AppBar
          title={ this.props.appTitle + (this.props.currentPage ? ' - ' + this.props.currentPage : '') }
          iconElementRight={this.props.user.logged ? <LoggedMenu handleLogout={this.handleLogout} user={this.props.user} /> : <LoginButton />}
          onLeftIconButtonTouchTap={this.showNavigation}
        />
        <Drawer
          docked={false}
          width={this.getDrawerWidth()}
          open={this.state.navOpen}
          onRequestChange={(navOpen) => this.setState({navOpen})}
        >
          <MenuItem onTouchTap={this.closeNavigation}>Close</MenuItem>
          <MenuItem onTouchTap={this.closeNavigation} containerElement={<Link to="/events"/>}>Events</MenuItem>
          {this.props.user.logged &&
            <MenuItem onTouchTap={this.closeNavigation} containerElement={<Link to="/profile"/>}>Profile</MenuItem>
          }
          {!this.props.user.logged &&
            <MenuItem onTouchTap={this.closeNavigation} containerElement={<Link to="/signup"/>}>Sign Up</MenuItem>
          }
        </Drawer>
        <Switch>
          <Route exact path="/events" component={Events} />
          <Route exact path="/event/:eventId/:inviteId" component={Event} />
          <Route exact path="/event/:eventId" component={Event} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </Switch>

      </div>
    )
  }
}

Home.propTypes = {
  user: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  const {user, currentPage, appTitle} = state
  return {
    user,
    currentPage,
    appTitle
  }
}

export default connect(mapStateToProps)(Home)