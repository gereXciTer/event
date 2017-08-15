import { REQUEST_EVENT, RECEIVE_EVENT, ADD_INVITE, REMOVE_INVITE, ADD_DROP, REMOVE_DROP } from '../actions'


function event(state = {
  isFetching: false,
  didInvalidate: false,
  invites: [],
  drops: []
}, action) {
  switch (action.type) {
    case REQUEST_EVENT:
      return {...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_EVENT: 
      return {...state,
        isFetching: false,
        didInvalidate: false,
        lastUpdated: action.receivedAt,
        ...action.event
      }
    case ADD_INVITE:
      return {...state,
        invites: [...state.invites, action.invite]
      }
    case REMOVE_INVITE:
      return {...state,
        invites: state.invites.filter(invite => invite._id !== action.id)
      }
    case ADD_DROP:
      return {...state,
        drops: [...state.drops, action.drop]
      }
    case REMOVE_DROP:
      return {...state,
        drops: state.drops.filter(drop => drop._id !== action.id)
      }
    default: 
      return state
  }
}

export default event