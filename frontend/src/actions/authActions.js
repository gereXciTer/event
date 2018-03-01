import fetch from 'isomorphic-fetch'

import { setLoginRedirect, api, setError } from './index'

const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'
const SIGNUP = 'SIGNUP'

const loginActions = {
  doLogin,
  doSignup,
  doLogout,
  userAuth,
  LOGIN,
  LOGOUT,
  SIGNUP
}

function updateLogin(status, user) {
  return {
    type: status ? LOGIN : LOGOUT,
    user
  }
}
function doLogin(user, cb) {
  return (dispatch, getState) => {
    return fetch(api.userLogin(), {
        method: 'post',
        credentials: 'include',
        body: JSON.stringify(user),
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
        dispatch(updateLogin(true, json))
        cb()
        dispatch(setLoginRedirect(null))
      })
      .catch(function(error, res) {
        dispatch(setError('loginForm', '', 'Connection error'))
        console.log('request failed', error)
      })
    
  }
}

function doSignup(user, cb){
  return (dispatch, getState) => {
    return fetch(api.userSignup(), {
        method: 'post',
        credentials: 'include',
        body: JSON.stringify(user),
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
        dispatch(updateLogin(true, json))
        cb()
        dispatch(setLoginRedirect(null))
      })
      .catch(function(error, res) {
        console.log('request failed', error)
      })
    
  }
}

function doLogout(cb) {
  return (dispatch, getState) => {
    return fetch(api.userLogout(), {
        method: 'post',
        credentials: 'include',
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
        dispatch(updateLogin(false))
        dispatch(setLoginRedirect(null))
        cb()
      })
      .catch(function(error, res) {
        console.log('request failed', error)
      })
  }
}

function userAuth(cb = () => {}) {
  return (dispatch, getState) => {
    return fetch(api.userAuth(), {
        method: 'post',
        credentials: 'include'
      })
      .then(res => {
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        return res.json()
      })
      .then(json => {
        if(json){
          dispatch(updateLogin(true, json))
          cb(true)
        }
      })
      .catch(function(error) {
        cb(false)
        dispatch(updateLogin(false, {}))
      })
  }
}

export default loginActions