import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TextField } from 'material-ui'

import { changeField, setValidator, validateField } from '../../actions'

class CommonTextField extends Component {
  constructor(props){
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.onBlur = this.onBlur.bind(this)

    const { dispatch, formName, value, name, validationError } = this.props
    dispatch(changeField(formName, name, value))
    dispatch(setValidator(formName, name, this.props.validator, validationError))
  }

  handleChange(e) {
    const {dispatch, formName, name, field, validateOnChange, onChange} = this.props,
      value = e.target.value
    dispatch(changeField(formName, name, value))
      .then((value) => {
        if(validateOnChange){
          dispatch(validateField(formName, {...field, value}, false))
        }
      })
    this.changed = true
    if(onChange){
      onChange(e)
    }
  }

  textInput = null

  autoFocused = false

  changed = false

  componentDidUpdate(){
    if(this.props.autoFocus && !this.autoFocused){
      this.textInput.focus()
      this.autoFocused = true
    }
  }

  onBlur(){
    const {dispatch, formName, field} = this.props
    if(this.changed){
      dispatch(validateField(formName, field, false))
    }
  }

  render(){
    const {dispatch, value, field, formName, name, autoFocus, compareValue
      , validator, validateFn, error, validateOnChange, validationError
      , ...parentProps} = this.props
    return (
      <TextField
        {...parentProps}
        errorText={this.props.error}
        type={this.props.type || "text"}
        value={value || ''}
        onChange={this.handleChange}
        ref={(input) =>{this.textInput = input}}
        onBlur={this.onBlur}
      />
    )
  }
}

CommonTextField.propTypes = {
  value: PropTypes.string,
  validationError: PropTypes.string,
  formName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

function mapStateToProps(state, ownProps) {
  const { forms } = state,
    form = forms && forms.find(f => f.name === ownProps.formName),
    field = form && form.fields && form.fields.find(f => f.name === ownProps.name)
  return field ? {
    field,
    name: field.name, 
    value: field.value, 
    error: ownProps.error || field.error
  } : {}
}


CommonTextField = connect(mapStateToProps)(CommonTextField)
export default CommonTextField
