import { INIT_FORM, CHANGE_FIELD, SET_VALIDATOR, SET_ERROR, RESET_FORM } from '../actions'

function field(state = {
  value: ''
}, action) {
  switch (action.type) {
    case CHANGE_FIELD:
      if(state.name !== action.fieldName)
        return state
      return {...state,
        value: action.value
      }
    case SET_VALIDATOR:
      if(state.name !== action.fieldName)
        return state
      return {...state,
        validator: action.validator,
        validationError: action.validationError
      }
    case SET_ERROR:
      if(state.name !== action.fieldName)
        return state
      return {...state,
        error: action.error
      }
    default:
      return state
  }
}
function form(state = {
  lastUpdated: Date.now()
}, action) {
  switch (action.type) {
    case CHANGE_FIELD:
    case SET_VALIDATOR:
    case SET_ERROR:
      if(state.name !== action.formName){
        return state
      }
      if(!state.fields.some(f => f.name === action.fieldName)){
        return {...state,
        lastUpdated: Date.now(),
        fields: [...state.fields, {
          name: action.fieldName,
          value: action.value,
          validator: action.validator,
          error: !(action.value || action.validator) && action.error
        }]
      }
      }
      return {...state,
        lastUpdated: Date.now(),
        fields: state.fields.map(v => field(v, action))
      }
    case INIT_FORM:
      if(state.name !== action.formName){
        return state
      }
      return {...state,
        fields: []
      }
    case RESET_FORM:
      if(state.name !== action.formName){
        return state
      }
      return {...state,
        fields: state.fields.map(field => {return {...field, value: undefined}})
      }
    default:
      return state
  }
}

function forms(state = [], action) {
  switch (action.type) {
    case INIT_FORM:
    case RESET_FORM:
      if(state.some(form => form.name === action.formName)){
        return state.map(v => form(v, action))
      }else{
        return [...state,
          { name: action.formName, fields: [] }
        ]
      }
    case CHANGE_FIELD:
    case SET_VALIDATOR:
    case SET_ERROR:
      return state.map(v => form(v, action))
    default: 
      return state
  }
}

export default forms