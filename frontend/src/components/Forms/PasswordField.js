import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CommonTextField from './CommonTextField'

// import { setError } from '../../actions'

class PasswordField extends Component {
  constructor(props){
    super(props)
    this.validate = this.validate.bind(this)
  }

  validate(strict, value, validationError){
    const { compareValue } = this.props,
      valueLength = value && value.length ? value.length : 0
    let error = false;
    if(strict || valueLength > 0){
      if(valueLength < 4){
        error = validationError || 'Password is too short'
      }
      if(compareValue && compareValue !== value){
        error = validationError || 'Passwords should match'
      }
    }
    return error
  }

  render(){
    const { compareField, ...parentProps } = this.props
    return (
      <CommonTextField
        {...parentProps}
        type="password"
        validator={this.validate}
      />
    )
  }
}

PasswordField.propTypes = {
  value: PropTypes.string,
  formName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

function mapStateToProps(state, ownProps) {
  const { forms } = state,
    form = forms && forms.find(f => f.name === ownProps.formName),
    field = form && form.fields && form.fields.find(f => f.name === ownProps.name),
    compareField = ownProps.compareField ?
     form && form.fields && form.fields.find(f => f.name === ownProps.compareField) : {}
  return field ? {
    name: field.name, 
    value: field.value, 
    compareValue: compareField.value
  } : {}
}


PasswordField = connect(mapStateToProps)(PasswordField)
export default PasswordField
