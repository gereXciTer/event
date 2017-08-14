import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import { userAuth, LOGIN, LOGOUT } from '../actions';

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('user auth', () => {
    nock('http://localhost:3001')
      .post('/user/auth')
      .reply(200, {"_id":"1","email":"test@test.com","name":"test"})

    const expectedActions = [
        { type: LOGIN, user: {"_id":"1","email":"test@test.com","name":"test"} }
      ]
    const store = mockStore({ user: {} })
      
    return store.dispatch(userAuth()).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('user auth fail', () => {
    nock('http://localhost:3001')
      .post('/user/auth')
      .reply(401, {success: false})

    const expectedActions = [
        { type: LOGOUT, user: {} }
      ]
    const store = mockStore({ user: {} })
      
    return store.dispatch(userAuth()).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

})
