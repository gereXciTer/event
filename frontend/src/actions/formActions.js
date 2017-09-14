const CHANGE_FIELD = 'CHANGE_FIELD'
const SET_VALIDATOR = 'SET_VALIDATOR'
const SET_ERROR = 'SET_ERROR'
const INIT_FORM = 'INIT_FORM'
const RESET_FORM = 'RESET_FORM'

const formActions = {
  changeField,
  setValidator,
  setError,
  initForm,
  resetForm,
  validateField,
  CHANGE_FIELD,
  SET_VALIDATOR,
  SET_ERROR,
  INIT_FORM,
  RESET_FORM
}

const validators = {
  email: (strict, newValue, validationError) => {
    const value = newValue,
      valueLength = value && value.length
    let regex = /^[a-zA-Z_0-9]+[.]?[a-zA-Z0-9]+@[a-zA-Z_0-9]+?\.[a-zA-Z]{2,6}$/,
      error = (strict || valueLength > 0) && !regex.test(value) &&
            (validationError || 'Please check email format')
    return error
  },
  text: (strict, newValue, validationError) => {
    const value = newValue,
      valueLength = value && value.length
    let error = (strict || valueLength > 0) && !valueLength &&
            (validationError || 'Please enter correct value')
    return error
  }
}

function setValue(formName, fieldName, value){
  return {
    type: CHANGE_FIELD,
    formName,
    fieldName,
    value
  }
}

function changeField(formName, fieldName, value){
  return (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch(setValue(formName, fieldName, value))
      resolve(value)
    })
  }
}

function setValidator(formName, fieldName, validator, validationError){
  if(typeof validator === 'string' && validators[validator]){
    validator = validators[validator]
  }
  return {
    type: SET_VALIDATOR,
    formName,
    fieldName,
    validator,
    validationError
  }
}

function setError(formName, fieldName, error){
  return {
    type: SET_ERROR,
    formName,
    fieldName,
    error
  }
}

function initForm(formName){
  return {
    type: INIT_FORM,
    formName
  }
}

function resetForm(formName){
  return {
    type: RESET_FORM,
    formName
  }
}

function validateField(formName, field, strict){
  return (dispatch, getState) => {
    return new Promise(resolve => {
      let error = field.validator && field.validator(strict, field.value, field.validationError)
      dispatch(setError(formName, field.name, error))
      resolve(error)
    })
  }
}


export default formActions