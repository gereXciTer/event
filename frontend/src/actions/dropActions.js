import fetch from 'isomorphic-fetch'

import { api, fetchEvent } from './index'

const ADD_DROP = 'ADD_DROP'
const REMOVE_DROP = 'REMOVE_DROP'
const UPDATE_DROP = 'UPDATE_DROP'

const dropActions = {
  createDrop,
  deleteDrop,
  saveDrop,
  ADD_DROP,
  REMOVE_DROP,
  UPDATE_DROP
}

function addDrop(drop) {
  return {
    type: ADD_DROP,
    drop
  }
}

function removeDrop(id) {
  return {
    type: REMOVE_DROP,
    id
  }
}

function updateDrop(drop) {
  return {
    type: UPDATE_DROP,
    drop
  }
}

function createDrop(drop, cb) {
  return (dispatch, getState) => {
    return fetch(api.addDrop(), {
        method: 'post',
        credentials: 'include',
        body: JSON.stringify(drop),
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
        dispatch(addDrop(json))
        dispatch(fetchEvent(drop.event))
        cb(json)
      })
      .catch(function(error, res) {
        console.log('request failed', error)
      })
    
  }
}

function saveDrop(drop, cb){
  return (dispatch, getState) => {
    return fetch(api.modifyDrop(drop.id), {
        method: 'put',
        credentials: 'include',
        body: JSON.stringify(drop),
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
        dispatch(updateDrop(json))
        dispatch(fetchEvent(drop.event))
        cb(json)
      })
      .catch(function(error, res) {
        console.log('request failed', error)
      })
  }
}

function deleteDrop(id) {
  return (dispatch, getState) => {
    return fetch(api.modifyDrop(id), {
        method: 'delete',
        credentials: 'include'
      })
      .then(res => {
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        return res.json()
      })
      .then(json => {dispatch(removeDrop(json._id))})
      .catch(function(error) {
        console.log('request failed', error)
      })
  }
}


export default dropActions