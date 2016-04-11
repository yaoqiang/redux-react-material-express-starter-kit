import cookie from 'react-cookie';
import {GET_USER, LOGIN_SUCCESS, LOGIN_FAILURE, GET_USER_INFO_SUCCESS, LOGOUT_SUCCESS, CLEAR_COOKIE } from '../actions/user';

export default function user(state = {}, action) {
  switch (action.type) {
    case GET_USER:
      return state;
    case LOGIN_SUCCESS:
      if (action.result.data.err) {
        //
        return Object.assign({}, state, {
          err: action.result.data.err
        });
      }
      cookie.save('X-TOKEN', action.result.data.token);
      return Object.assign({}, state, {
        err: null,
        token: action.result.data.token,
        updateCookie: true,
        isLogin: true
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        err: action.error.data.err.message
      });
    case GET_USER_INFO_SUCCESS:
      return Object.assign({}, state, {
        info: action.result.data
      });
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        info: null,
        token: null,
        userId: null,
        clearCookie: true
      });
    case CLEAR_COOKIE:
      return Object.assign({}, state, {
        clearCookie: false
      });
    default:
      return state;
  }
}
