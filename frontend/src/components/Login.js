import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { doLogin, changePage } from '../actions'
import { Link } from 'react-router-dom';

import { Container, Row, Col } from 'react-grid-system'
import { RaisedButton } from 'material-ui'

import { Form, EmailField, PasswordField } from './Forms'

const FORM_NAME = 'loginForm'

class Login extends Component {
  constructor(props){
    super(props)
    this.state = {
      emailError: false,
      passwordError: false,
      password: '',
      email: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
  }
  
  componentDidMount(){
    this.props.dispatch(changePage('Login'))
  }

  handleSubmit(payload) {
    this.props.dispatch(doLogin(payload, (err)=>{
      if(!err){
        if(this.props.user.redirectUrl){
          this.props.history.push(this.props.user.redirectUrl)
        }else{
          this.props.history.push('/events')
        }
      }else{
        this.setState({
          emailError: err.emailError,
          passwordError: err.passwordError
        })
      }
    }))
  }

  validatePassword(strict, cb = ()=>{}){
    this.setState({
      passwordError: (strict || this.state.password.length > 0) && this.state.password.length < 3 &&
        'Please check password format'
    }, cb)
  }

  validateEmail(strict, cb = ()=>{}){
    let regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
    this.setState({
      emailError: (strict || this.state.email.length > 0) && !regex.test(this.state.email) &&
        'Please check email format'
    }, cb)
  }

  handleEmailChange(e){
    e.preventDefault()
    this.setState({
      email: e.target.value
    }, this.validateEmail)
  }

  handlePasswordChange(e){
    e.preventDefault()
    this.setState({
      password: e.target.value
    }, this.validatePassword)
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
                  error={this.state.emailError}
                  name="email" />
                <PasswordField
                  hintText="Type Password"
                  floatingLabelText="Password"
                  fullWidth={true}
                  formName={FORM_NAME}
                  error={this.state.passwordError}
                  name="password" />
                <RaisedButton primary={true} fullWidth={true} label="Login" onTouchTap={()=> this.formSubmit()} />
                <div style={{clear: 'both', paddingTop: '1em'}}>
                  <Link to="/signup">Don't have account?</Link>
                </div>
              </Form>
          </Col>
        </Row>
      </Container>
    )
  }
}

Login.propTypes = {
  user: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  const {user} = state
  return {
    user
  }
}

export default connect(mapStateToProps)(Login)