import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Snackbar } from 'material-ui'

import { initForm, resetForm, validateField } from '../../actions'

class Form extends Component {
  constructor(props){
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.props.dispatch(initForm(this.props.name))
  }

  handleSubmit(e){
    e && e.preventDefault()
    const { dispatch, name } = this.props
    let inError = false
    Promise.all(this.props.fields.map(f => dispatch(validateField(name, f, true))))
    .then(errors => {
      inError = errors.some(error => error)
      if(inError){
        return
      }
      let payload = {}
      this.props.fields.forEach(v => {
        payload[v.name] = v.value
      })
      this.props.onSubmit(payload, this.props.fields)
      if(this.props.resetOnSubmit){
        this.props.dispatch(resetForm(this.props.name))
      }
    })
    // this.props.fields.forEach(field => {
    //   dispatch(validateField(name, field, false)).then(()=>{
    //     console.log(1)
    //   })
    // })
    // this.props.fields.forEach(field => {
    //   console.log(field, field.error)
    //   inError = field.error || inError
    // })
    // if(inError){
    //   return
    // }
    // let payload = {}
    // this.props.fields.forEach(v => {
    //   payload[v.name] = v.value
    // })
    // this.props.onSubmit(payload, this.props.fields)
    // if(this.props.resetOnSubmit){
    //   this.props.dispatch(resetForm(this.props.name))
    // }
  }

  render() {
    const {children} = this.props
    return(
      <form onSubmit={this.handleSubmit} action="" ref={form => {this.props.formSubmit && this.props.formSubmit(this.handleSubmit)}}>
        {children}
        <input type="submit" style={{position: 'absolute', left: '-9999px'}} />
        <Snackbar
          open={this.props.error}
          message={this.props.error}
          autoHideDuration={4000}
        />
      </form>
    )
  }
}

Form.propTypes = {
  fields: PropTypes.array,
  name: PropTypes.string.isRequired
}

function mapStateToProps(state, ownProps) {
  const { forms } = state
  const { fields, error, lastUpdated } = (forms && forms.find(f => f.name === ownProps.name)) || {}
  return {
    fields,
    error,
    lastUpdated
  }
}

Form = connect(mapStateToProps)(Form)
export default Form