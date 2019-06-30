import { actionTypes } from '../constants/compassConstants';
import _ from 'lodash';

export const initialState = {
  currentUser: null,
  notifications: null,
  isDevelopment: false,
  outerMessage: '',
};

export default function compassReducer(state = initialState, action) {
  const { type } = action;
  switch (type) {
    case actionTypes.USER_SIGN_IN:
      return _.assign({}, state, {
        currentUser: action.user,
      });
    case actionTypes.USER_SIGN_OUT:
      return _.assign({}, state, {
        currentUser: null,
        notifications: null,
      });
    case actionTypes.SET_SNACKBAR_MESSAGE:
      return _.assign({}, state, {
        outerMessage: action.message,
      });
    case actionTypes.SET_NOTIFICATIONS:
      return _.assign({}, state, {
        notifications: action.notifications,
      });
    case actionTypes.CLEAR_SNACKBAR_MESSAGE:
      return _.assign({}, state, {
        outerMessage: '',
      });
    case actionTypes.SET_REDIRECT:
      return _.assign({}, state, {
        redirect: action.url,
      });
    default:
      return state;
  }
}
