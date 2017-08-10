import fetch from 'isomorphic-fetch'

import { setLoginRedirect, api } from './index'
const LOAD_USER = 'LOAD_USER'
const REQUEST_USER = 'REQUEST_USER'

const userActions = {
  getProfile,
  saveProfile,
  LOAD_USER,
  REQUEST_USER
}

function receiveUser(user) {
  return {
    type: LOAD_USER,
    user
  }
}

function requestUser() {
  return {
    type: REQUEST_USER
  }
}

function getProfile (cb) {
  return (dispatch, getState) => {
    dispatch(requestUser())
    return fetch(api.userProfile(), {credentials: 'include'})
      .then(res => {
        if (res.status >= 400) {
            res.json().then(json=>{
              if(json.redirect){
                dispatch(setLoginRedirect('/profile/'))
              }
              cb(json)
            })
            throw new Error("Bad response from server");
        }
        return res.json()
      })
      .then(json => {
        dispatch(receiveUser(json))
        cb(json)
      })
      .catch(function(error) {
        dispatch(receiveUser({}))
        console.log('request failed', error)
      })
  }
}

function saveProfile(profile, cb) {
  return (dispatch, getState) => {
    dispatch(requestUser())
    return fetch(api.userProfile(), {
        method: 'put',
        credentials: 'include',
        body: JSON.stringify(profile),
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(res => {
        if (res.status >= 400) {
            res.json().then(json=>{
              if(json.redirect){
                dispatch(setLoginRedirect('/profile/'))
              }
              cb(json)
            })
            throw new Error("Bad response from server");
        }
        return res.json()
      })
      .then(json => {
        dispatch(receiveUser(json))
        cb(json)
      })
      .catch(function(error) {
        dispatch(receiveUser({}))
        console.log('request failed', error)
      })
  }
}

export default userActions