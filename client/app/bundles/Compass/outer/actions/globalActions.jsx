import { actionTypes } from '../../constants/compassConstants';

export function clearSnackbarMessage() {
  return {
    type: actionTypes.CLEAR_SNACKBAR_MESSAGE,
  };
}

export function setSnackbarMessage(message) {
  return {
    type: actionTypes.SET_SNACKBAR_MESSAGE,
    message,
  };
}
