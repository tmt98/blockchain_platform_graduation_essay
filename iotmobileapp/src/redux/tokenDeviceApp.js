import remove from 'lodash.remove';

import {ADD_TOKEN, UPDATE_TOKEN, REMOVE_TOKEN} from './action';

export function addToken(token) {
  return {
    type: ADD_TOKEN,
    deviceID: token.deviceID,
    token: token.tokenKey,
  };
}

export function updateToken(deviceID, tokenKey) {
  return {
    type: UPDATE_TOKEN,
    deviceID: deviceID,
    token: tokenKey,
  };
}

export function removeToken(deviceID) {
  return {
    type: REMOVE_TOKEN,
    deviceID: deviceID,
  };
}

const initialState = [];

function tokenDeviceReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TOKEN:
      return [
        ...state,
        {
          id: action.deviceID,
          token: action.token,
        },
      ];
    case UPDATE_TOKEN:
      return state;
    case REMOVE_TOKEN:
      const deletedNewArray = remove(state, (obj) => {
        return obj.id != action.deviceID;
      });
      return deletedNewArray;
    default:
      return state;
  }
}

export default tokenDeviceReducer;
