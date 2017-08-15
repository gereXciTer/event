import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getProfile, changePage, saveProfile } from '../actions'

import { Container, Row, Col } from 'react-grid-system'
import { FlatButton, RaisedButton, CircularProgress,
  List, ListItem
 } from 'material-ui'

import { Form, EmailField, TextField } from './Forms'

class Profile extends Component {
  constructor(props){
    super(props)
    const {user} = this.props
    this.state = {
      editProfile: false,
      values: {
        name: user.name,
        email: user.email
      }
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.toggleForm = this.toggleForm.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props
    
    dispatch(changePage('Profile'))

    dispatch(getProfile(() => {}))
  }

  toggleForm(state = false) {
    const {user} = this.props
    this.setState({
      editProfile: state,
      values: state && {
        name: user.name,
        email: user.email
      },
      errors: {}
    })
  }

  handleSubmit(payload) {
    this.props.dispatch(saveProfile(payload, json => {
      console.log(json)
      if(json.errors){
        const {
          email: {message: emailError} = '',
          name: {message: nameError} = ''
        } = json.errors
        return this.setState({
          errors: {
            email: emailError,
            name: nameError
          }
        })
      }
      if(!json.success && json.redirect){
        return this.props.history.push(json.redirect === true ? '/login' : json.redirect)
      }
      this.setState({
        editProfile: false
      })
    }))
  }

  formSubmit = null

  render() {
    const {user} = this.props,
      FORM_NAME = 'profileForm'
    return (
      <Container xs={true}>
        <Row>
          <Col offset={{sm: 0, md: 1, lg: 2}} sm={12} md={10} lg={8}>
            {user.isFetching &&
              <CircularProgress />
            }
            {!user.isFetching && !this.state.editProfile && 
              <List>
                <ListItem primaryText="Name" secondaryText={user.name} />
                <ListItem primaryText="Email" secondaryText={user.email} />
                <ListItem primaryText="Friends" primaryTogglesNestedList={true}
                  secondaryText={user.friends && user.friends.map(friend => friend.name || friend.email).join(', ')}
                  nestedItems={user.friends && user.friends.map((friend, i) =>
                        <ListItem key={i} primaryText={friend.name || friend.email} />
                      )} />
                <RaisedButton primary={true} fullWidth={true} label="Edit" onTouchTap={() => this.toggleForm(true)} />
              </List>
            }
            {!user.isFetching && this.state.editProfile &&
              <Form onSubmit={this.handleSubmit} name={FORM_NAME} formSubmit={handler => this.formSubmit = handler}>
                <TextField 
                  hintText="Type new Name"
                  floatingLabelText="Name"
                  fullWidth={true}
                  value={this.state.values.name}
                  error={this.state.errors.name}
                  formName={FORM_NAME}
                  name="name" />
                <EmailField 
                  hintText="Type new Email"
                  floatingLabelText="Email"
                  fullWidth={true}
                  value={this.state.values.email}
                  error={this.state.errors.email}
                  formName={FORM_NAME}
                  name="email" />
                <RaisedButton primary={true} fullWidth={true} label="Save" onTouchTap={()=> this.formSubmit()} />
                <FlatButton primary={true} fullWidth={true} label="Cancel" onTouchTap={() => this.toggleForm(false)} />
              </Form>
            }
            
          </Col>
        </Row>
      </Container>
    )
  }
}

Profile.propTypes = {
  user: PropTypes.object
}

function mapStateToProps(state) {
  const {user} = state
  return {
    user
  }
}

Profile = connect(mapStateToProps)(Profile)
export default Profile