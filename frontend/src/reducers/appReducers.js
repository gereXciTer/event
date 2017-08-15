import { DIALOG_OPEN } from '../actions'

function app (state = {
  dialogOpen: false
}, action){
  switch (action.type) {
    case DIALOG_OPEN:
      return {...state,
        dialogOpen: action.state
      }
    default: 
      return state
  }
}

export default app