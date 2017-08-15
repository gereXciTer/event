import { REQUEST_EVENTS, RECEIVE_EVENTS, EDIT_EVENT, SAVE_EVENT, ADD_EVENT, DELETE_EVENT } from '../actions'

function event(state = {}, action) {
  switch (action.type) {
    case EDIT_EVENT:
      if(state._id !== action.id)
        return state
      return {...state,
        edit: action.state
      }
    case SAVE_EVENT:
      if(state._id !== action.id)
        return state
      return {...state,
        edit: false,
        name: action.name
      }
    default:
      return state
  }
}

function events(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case REQUEST_EVENTS:
      return {...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_EVENTS: 
      return {...state,
        isFetching: false,
        didInvalidate: false,
        items: action.events,
        lastUpdated: action.receivedAt
      }
    case EDIT_EVENT:
    case SAVE_EVENT:
      return {...state,
          items: state.items.map(item => event(item, action))
        }
    case ADD_EVENT:
      return {...state,
        items: [...state.items, action.event]
      }
    case DELETE_EVENT:
      return {...state,
        items: state.items.filter(item => item._id !== action.id)
      }
    default: 
      return state
  }
}

export default events