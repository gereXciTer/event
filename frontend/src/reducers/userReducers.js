import { LOGIN, LOGOUT, LOGIN_REDIRECT, LOAD_USER, REQUEST_USER } from '../actions'

function user (state = {
  logged: false
}, action){
  switch (action.type) {
    case LOGIN:
      return {...state,
        logged: true,
        isFetching: false,
        ...action.user
      }
    case LOGOUT:
      return {
        logged: false
      }
    case LOGIN_REDIRECT:
      return {
        ...state,
        redirectUrl: action.redirectUrl
      }
    case REQUEST_USER:
      return {...state,
        isFetching: true
      }
    case LOAD_USER:
      return {...state,
        isFetching: false,
        ...action.user
      }
    default: 
      return state
  }
}

export default user