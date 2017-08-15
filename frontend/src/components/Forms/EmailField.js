import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CommonTextField from './CommonTextField'

class EmailField extends Component {
  render(){
    return (
      <CommonTextField
        {...this.props}
        validator={this.props.validator || 'email'}
      />
    )
  }
}

EmailField.propTypes = {
  value: PropTypes.string,
  formName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

function mapStateToProps(state, ownProps) {
  const { forms } = state,
    form = forms && forms.find(f => f.name === ownProps.formName),
    field = form && form.fields && form.fields.find(f => f.name === ownProps.name)
  return field ? {
    name: field.name, 
    value: field.value
  } : {}
}


EmailField = connect(mapStateToProps)(EmailField)
export default EmailField
