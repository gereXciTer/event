import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { AutoComplete } from 'material-ui'

import { changeField, setValidator, validateField } from '../../actions'

class AutoCompleteField extends Component {
  constructor(props){
    super(props)
    this.handleChange = this.handleChange.bind(this)

    const { dispatch, formName, value, name, validationError, validator } = this.props
    dispatch(changeField(formName, name, value))
    dispatch(setValidator(formName, name, validator || "text", validationError))
  }

  handleChange(searchText) {
    const {dispatch, field, formName, name, validateOnChange} = this.props,
      value = searchText
    dispatch(changeField(formName, name, value))
    if(validateOnChange){
      dispatch(validateField(formName, field, false))
      // this.validate(false, value)
    }
    this.changed = true
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

  render(){
    const {dispatch, value, field, formName, name, autoFocus, compareValue
      , validator, validateFn, error, validateOnChange, validationError
      , dataSource, ...parentProps} = this.props
    return (
      <AutoComplete
        {...parentProps}
        errorText={this.props.error}
        type={this.props.type || "text"}
        searchText={value || ''}
        onUpdateInput={this.handleChange}
        ref={(input) =>{this.textInput = input}}
        dataSource={dataSource || []}
        popoverProps={{
          canAutoPosition: true
        }}
      />
    )
  }
}

AutoCompleteField.propTypes = {
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


AutoCompleteField = connect(mapStateToProps)(AutoCompleteField)

export default AutoCompleteField
