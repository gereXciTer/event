import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { doSignup, changePage } from '../actions'

import { Container, Row, Col } from 'react-grid-system'
import { RaisedButton } from 'material-ui'

import { Form, EmailField, PasswordField, TextField } from './Forms'

const FORM_NAME = 'signupForm'

class Signup extends Component {
  constructor(props){
    super(props)
    this.state = {
      errors: {
        emailError: false,
        passwordError: false,
        passwordRepeatError: false,
        nameError: false
      },
      values: {
        password: '',
        passwordRepeat: '',
        email: '',
        name: ''
      }
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount(){
    this.props.dispatch(changePage('Signup'))
  }
  
  handleSubmit(payload) {
    this.props.dispatch(doSignup(payload, (err)=>{
      if(!err){
        if(this.props.user.redirectUrl){
          this.props.history.push(this.props.user.redirectUrl)
        }else{
          this.props.history.push('/events')
        }
      }else{
        let errors = Object.assign({
          name: {},
          email: {},
          password: {},
          passwordRepeat: {}
        }, err.errors)
        this.setState({
          errors: {
            nameError: errors.name.message,
            emailError: errors.email.message,
            passwordError: errors.password.message,
            passwordRepeatError: errors.passwordRepeat.message
          }
        })
      }
    }))

  }

  formSubmit = null

  render() {
    return (
      <Container xs={true}>
        <Row>
          <Col offset={{sm: 1, md: 3, lg: 4}} sm={10} md={6} lg={4}>
              <Form onSubmit={this.handleSubmit} name={FORM_NAME} formSubmit={handler => this.formSubmit = handler}>
                <EmailField 
                  hintText="Your Email"
                  floatingLabelText="Email"
                  fullWidth={true}
                  autoFocus={true}
                  formName={FORM_NAME}
                  error={this.state.errors.emailError}
                  name="email" />
                <TextField 
                  hintText="Type new Name"
                  floatingLabelText="Name"
                  fullWidth={true}
                  error={this.state.errors.nameError}
                  formName={FORM_NAME}
                  name="name" />
                <PasswordField
                  hintText="Type Password"
                  floatingLabelText="Password"
                  fullWidth={true}
                  formName={FORM_NAME}
                  validateOnChange={true}
                  error={this.state.errors.passwordError}
                  name="password" />
                <PasswordField
                  hintText="Type Password Again"
                  floatingLabelText="Repeat Password"
                  fullWidth={true}
                  formName={FORM_NAME}
                  validateOnChange={true}
                  error={this.state.errors.passwordRepeatError}
                  compareField="password"
                  name="passwordRepeat" />
                {/*<TextField
                  hintText="Repeat Password"
                  floatingLabelText="Repeat Password"
                  errorText={this.state.errors.passwordRepeatError}
                  type="password"
                  fullWidth={true}
                  onChange={this.handlePasswordRepeat}
                />*/}
                <RaisedButton primary={true} label="Sign up" onTouchTap={()=> this.formSubmit()} style={{float: 'right'}} />
              </Form>
          </Col>
        </Row>
      </Container>
    )
  }
}

Signup.propTypes = {
  user: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  const {user} = state
  return {
    user
  }
}

export default connect(mapStateToProps)(Signup)