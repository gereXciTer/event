import { CHANGE_PAGE } from '../actions'
import { combineReducers } from 'redux'
import events from './eventsReducer'
import event from './eventReducer'
import user from './userReducers'
import app from './appReducers'
import forms from './formReducers'
const rootReducer = combineReducers({
  events,
  user,
  event,
  app,
  forms,
  appTitle: (state='Unknown App') => state,
  currentPage: (state='', action) => {
    switch (action.type) {
      case CHANGE_PAGE:
        return action.name
      default:
        return state
    }
  }
});

export default rootReducer