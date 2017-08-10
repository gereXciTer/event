import fetch from 'isomorphic-fetch'

import { setLoginRedirect, api } from './index'

const RECEIVE_EVENTS = 'RECEIVE_EVENTS'
const REQUEST_EVENTS = 'REQUEST_EVENTS'
const EDIT_EVENT = 'EDIT_EVENT'
const SAVE_EVENT = 'SAVE_EVENT'
const ADD_EVENT = 'ADD_EVENT'
const DELETE_EVENT = 'DELETE_EVENT'
const REQUEST_EVENT = 'REQUEST_EVENT'
const RECEIVE_EVENT = 'RECEIVE_EVENT'
const ADD_INVITE = 'ADD_INVITE'
const REMOVE_INVITE = 'REMOVE_INVITE'

const eventActions = {
  fetchEvents,
  fetchEventsIfNeeded,
  toggleEvent,
  saveEvent,
  createEvent,
  deleteEvent,
  receiveEvent,
  fetchEvent,
  createInvite,
  acceptInvite,
  deleteInvite,
  RECEIVE_EVENTS,
  REQUEST_EVENTS,
  EDIT_EVENT,
  SAVE_EVENT,
  ADD_EVENT,
  DELETE_EVENT,
  RECEIVE_EVENT,
  ADD_INVITE,
  REMOVE_INVITE
}

function requestEvents(json) {
  return {
    type: REQUEST_EVENTS
  }
}

function receiveEvents(json) {
  return {
    type: RECEIVE_EVENTS,
    events: json,
    receivedAt: Date.now()
  }
}

function requestEvent(json) {
  return {
    type: REQUEST_EVENT
  }
}

function receiveEvent (event) {
  return {
    type: RECEIVE_EVENT,
    event,
    receivedAt: Date.now()
  }
}

function fetchEvent(id, cb) {
  return (dispatch, getState) => {
    dispatch(requestEvent())
    return fetch(api.getEvent(id), {credentials: 'include'})
      .then(res => {
        if (res.status >= 400) {
            res.json().then(json=>{
              if(json.redirect === true){
                dispatch(setLoginRedirect(`/event/${id}`))
              }
              cb(json)
            })
            throw new Error("Bad response from server");
        }
        return res.json()
      })
      .then(json => dispatch(receiveEvent(json)))
      .catch(function(error) {
        dispatch(receiveEvent(null))
        console.log('request failed', error)
      })
  }
}

function fetchEvents(cb) {
  return (dispatch, getState) => {
    dispatch(requestEvents())
    return fetch(api.getEvents(), {credentials: 'include'})
      .then(res => {
        if (res.status >= 400) {
            res.json().then(json=>{
              if(json.redirect){
                dispatch(setLoginRedirect('/events/'))
              }
              cb(json)
            })
            throw new Error("Bad response from server");
        }
        return res.json()
      })
      .then(json => dispatch(receiveEvents(json)))
      .catch(function(error) {
        dispatch(receiveEvents([]))
        console.log('request failed', error)
      })
  }
}

function ifEventsUpdateNeeded(state){
  return !state.events.isFetching
}
function fetchEventsIfNeeded(cb) {
  return (dispatch, getState) => {
    if(!ifEventsUpdateNeeded(getState())){
      return Promise.resolve()
    }
    return dispatch(fetchEvents(cb))
  }
}

function toggleEvent(id, state) {
  return {
    type: EDIT_EVENT,
    id,
    state
  }
}

function updateEvent(id, name) {
  return {
    type: SAVE_EVENT,
    id,
    name
  }
}

function addEvent(event) {
  return {
    type: ADD_EVENT,
    event
  }
}

function removeEvent(id) {
  return {
    type: DELETE_EVENT,
    id
  }
}

function saveEvent(id, event) {
  return (dispatch, getState) => {
    return fetch(api.getEvent(id), {
        method: 'put',
        credentials: 'include',
        body: JSON.stringify({name: event.name}),
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(res => {
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        return res.json()
      })
      .then(json => dispatch(updateEvent(id, json.name)))
      .catch(function(error) {
        console.log('request failed', error)
      })
  }
}

function createEvent(event, cb) {
  return (dispatch, getState) => {
    console.log(event)
    return fetch(api.getEvents(), {
        method: 'post',
        credentials: 'include',
        body: JSON.stringify({name: event.name}),
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(res => {
        if (res.status >= 400) {
          res.json().then(json=>cb(json))
          throw new Error("Bad response from server", );
        }
        return res.json()
      })
      .then(json => {
        dispatch(addEvent(json))
        cb()
      })
      .catch(function(error) {
        console.log('request failed', error)
      })
  }
}

function deleteEvent(id) {
  return (dispatch, getState) => {
    return fetch(api.getEvent(id), {
        method: 'delete',
        credentials: 'include'
      })
      .then(res => {
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        return res.json()
      })
      .then(json => {dispatch(removeEvent(json._id))})
      .catch(function(error) {
        console.log('request failed', error)
      })
  }
}

function addInvite(invite) {
  return {
    type: ADD_INVITE,
    invite
  }
}

function createInvite(invite, cb) {
  return (dispatch, getState) => {
    return fetch(api.createInvite(), {
        method: 'post',
        credentials: 'include',
        body: JSON.stringify(invite),
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(res => res.json())
      .then(json => {
        dispatch(addInvite(json))
        cb(json)
      })
  }
}

function removeInvite(id) {
  return {
    type: REMOVE_INVITE,
    id
  }
}

function deleteInvite(id) {
  return (dispatch, getState) => {
    return fetch(api.readInvite(id), {
        method: 'delete',
        credentials: 'include'
      })
      .then(res => {
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        return res.json()
      })
      .then(json => {dispatch(removeInvite(id))})
      .catch(function(error) {
        console.log('request failed', error)
      })
  }
}

function acceptInvite(inviteId, eventId, cb) {
  return (dispatch, getState) => {
    return fetch(api.readInvite(inviteId), {credentials: 'include'})
      .then(res => {
        if (res.status >= 400) {
            res.json().then(json=>{
              if(json.redirect === true){
                dispatch(setLoginRedirect(`/event/${eventId}/${inviteId}`))
              }
              cb(json)
            })
            throw new Error("Bad response from server");
        }
        return res.json()
      })
      .then(json => {
        cb(json)
      })
      .catch(function(error) {
        console.log('request failed', error)
      })
  }
}

export default eventActions