import { actionTypes } from '../constants/compassConstants';

export function setRedirectAction(url) {
  return {
    type: actionTypes.SET_REDIRECT,
    url,
  };
}

export function setRedirect(url) {
  return dispatch => {
    dispatch(setRedirectAction(url));
  };
}

export function clearRedirect() {
  return dispatch => {
    dispatch(setRedirectAction(''));
  };
}