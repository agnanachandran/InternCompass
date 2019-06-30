import { actionTypes } from '../../constants/compassConstants';
import { del, get, post, put } from '../../utils/ajaxCamelCase';
import $ from 'jquery';

function receiveUser(user) {
  return {
    type: actionTypes.RECEIVE_USER,
    user,
  };
}

function setUserSigningUp() {
  return {
    type: actionTypes.SIGN_UP_LOADING,
  };
}

function confirmationSent() {
  return {
    type: actionTypes.CONFIRMATION_SENT,
  };
}

function clearConfirmationSent() {
  return {
    type: actionTypes.CLEAR_CONFIRMATION,
  };
}

function clearSigninError() {
  return {
    type: actionTypes.CLEAR_SIGN_IN_ERROR,
  };
}

function signupError(errors) {
  return {
    type: actionTypes.SIGN_UP_ERROR,
    errors,
  };
}

function signinError(errorMsg) {
  return {
    type: actionTypes.SIGN_IN_ERROR,
    errorMsg,
  };
}

function signinSuccess(user) {
  return {
    type: actionTypes.USER_SIGN_IN,
    user,
  };
}

function userSignout() {
  return {
    type: actionTypes.USER_SIGN_OUT,
  };
}

function changePasswordError() {
  return {
    type: actionTypes.CHANGE_PASSWORD_ERROR,
  };
}

function updateCSRFToken() {
  return get('/token').then(response => {
    $('meta[name="csrf-token"]').attr('content', response.token);
  });
}

function userProfileUpdated(profileData) {
  return {
    type: actionTypes.USER_PROFILE_UPDATED,
    profileData,
  };
}

export function fetchUser(token) {
  return dispatch => {
    return get(`/users/${token}.json`).done(data => {
      dispatch(receiveUser(data.user.user));
    });
  };
}

export function resetPassword(email) {
  return dispatch => {
    return post('/forgot_password', { user: { email } });
  };
}

export function updatePassword(password, resetPasswordToken, router) {
  return dispatch => {
    return put('/change_password', { user: { password, resetPasswordToken } })
      .done(currentUser => {
        updateCSRFToken().then(()=> {
          dispatch(signinSuccess(currentUser));
          router.replace('/');
        });
      })
      .fail(() => {
        dispatch(changePasswordError());
      });
  };
}

export function updateProfile(profileData, userToken, router) {
  return dispatch => {
    return put('/users/update-profile', profileData)
      .done(() => {
        dispatch(userProfileUpdated(profileData));
        router.replace(`/users/${userToken}`);
      });
  };
}

export function signup(firstName, lastName, email, password) {
  return dispatch => {
    dispatch(setUserSigningUp());
    return post('/users', {
      user: {
        firstName,
        lastName,
        email,
        password,
      }
    }).done(data => {
      dispatch(confirmationSent());
    }).fail(error => {
      dispatch(signupError(error.responseJSON.errors));
    });
  };
}

export function signin(url, email, password, rememberMe, router) {
  return dispatch => {
    return post('/login', {
      user: {
        email,
        password,
        rememberMe,
      }
    }).done(currentUser => {
      updateCSRFToken().then(()=> {
        dispatch(signinSuccess(currentUser));
        router.replace(url ? url : '/');
      });
    }).fail(error => {
      dispatch(signinError(error.responseText));
    });
  };
}

export function signout(router) {
  return dispatch => {
    del('/logout').then(() => {
      updateCSRFToken().then(() => {
        dispatch(userSignout());
        router.replace('/');
      });
    });
  };
}

export function clearConfirmation() {
  return dispatch => {
    dispatch(clearConfirmationSent());
  };
}

export function clearSigninErrorMsg() {
  return dispatch => {
    dispatch(clearSigninError());
  };
}