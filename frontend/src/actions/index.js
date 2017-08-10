const baseApiUrl = 'http://localhost:3001'
export const api = {
  getEvent: (id) => `${baseApiUrl}/events/${id}`,
  getEvents: () => `${baseApiUrl}/events/`,
  createInvite: () => `${baseApiUrl}/invite/`,
  readInvite: (id) => `${baseApiUrl}/invite/${id}`,
  userLogin: () => `${baseApiUrl}/user/login`,
  userLogout: () => `${baseApiUrl}/user/logout`,
  userAuth: () => `${baseApiUrl}/user/auth`,
  userSignup: () => `${baseApiUrl}/user/signup`,
  userProfile: () => `${baseApiUrl}/user/profile`,
  addDrop: () => `${baseApiUrl}/drop`,
  modifyDrop: (id) => `${baseApiUrl}/drop/${id}`
}

import userActions from './userActions'

export const { getProfile, saveProfile, LOAD_USER, REQUEST_USER } = userActions

import formActions from './formActions'

export const { 
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
} = formActions

import loginActions from './authActions'

export const { doSignup, doLogin, doLogout, userAuth, LOGIN, LOGOUT, SIGNUP } = loginActions

import eventActions from './eventActions'

export const { 
  fetchEvents,
  fetchEventsIfNeeded,
  toggleEvent,
  saveEvent,
  createEvent,
  deleteEvent,
  selectEvent,
  fetchEvent,
  createInvite,
  deleteInvite,
  acceptInvite,
  RECEIVE_EVENTS,
  REQUEST_EVENTS,
  EDIT_EVENT,
  SAVE_EVENT,
  ADD_EVENT,
  DELETE_EVENT,
  RECEIVE_EVENT,
  ADD_INVITE,
  REMOVE_INVITE } = eventActions

import dropActions from './dropActions'

export const { 
  createDrop,
  deleteDrop,
  saveDrop,
  ADD_DROP,
  REMOVE_DROP,
  UPDATE_DROP
} = dropActions
  

export const LOGIN_REDIRECT = 'LOGIN_REDIRECT'
export const DIALOG_OPEN = 'DIALOG_OPEN'
export const CHANGE_PAGE = 'CHANGE_PAGE'

export function changePage(name){
  return {
    type: CHANGE_PAGE,
    name
  }
}

export function setLoginRedirect(redirectUrl) {
  return {
    type: LOGIN_REDIRECT,
    redirectUrl
  }
}

export function openDialog(state = true) {
  return {
    type: DIALOG_OPEN,
    state
  }
}

