import { actionTypes } from '../../constants/compassConstants';
import { get, post, put, del } from '../../utils/ajaxCamelCase';
import request from 'superagent';
import $ from 'jquery';
import * as globalActions from '../../outer/actions/globalActions';

export function receiveCritiques(critique, user) {
  return {
    type: actionTypes.RECEIVE_CRITIQUES,
    ...critique,
    ...user,
  };
}

export function receiveCritique(critique, critiqueCreator) {
  return {
    type: actionTypes.RECEIVE_CRITIQUE,
    critique,
    critiqueCreator,
  };
}

function postComment() {
  return {
    type: actionTypes.POST_COMMENT,
  };
}

function postCommentError() {
  return {
    type: actionTypes.POST_COMMENT_ERROR,
  };
}

function postedComment(comments) {
  return {
    type: actionTypes.POSTED_COMMENT,
    comments,
  };
}

function deleteCritiqueInProgress() {
  return {
    type: actionTypes.DELETE_CRITIQUE_IN_PROGRESS,
  };
}

function deletedCritique() {
  return {
    type: actionTypes.DELETED_CRITIQUE,
  };
}

function deletedComment(comments) {
  return {
    type: actionTypes.DELETED_COMMENT,
    comments,
  };
}

function createCritique() {
  return {
    type: actionTypes.CREATE_CRITIQUE,
  };
}

function createCritiqueError() {
  return {
    type: actionTypes.CREATE_CRITIQUE_ERROR,
  };
}

function createdCritique() {
  return {
    type: actionTypes.CREATED_CRITIQUE,
  };
}

export function uploadCritiqueable(router, file, description) {
  return dispatch => {
    dispatch(createCritique());
    const req = request.post('/critiques/upload');
    const csrfToken = $('meta[name=csrf-token]').attr('content');
    req.field('description', description);
    req.attach('file', file);
    req.set('X-CSRF-Token', csrfToken);
    req.end((err, res) => {
      if (err) {
        if (res && res.body) {
          dispatch(globalActions.setSnackbarMessage(res.body.error));
        } else {
          dispatch(globalActions.setSnackbarMessage('Something went wrong! Please try again later.'));
        }
        dispatch(createCritiqueError());
        return;
      }
      dispatch(createdCritique());
      router.push(`/critiques/${res.body.critiqueToken}`);
    });
  };
}

export function fetchCritiques(numPage) {
  const page = numPage || 1;
  return dispatch => {
    return get('/critiques.json', {
      page,
    }).done(data => {
      dispatch(receiveCritiques(data.critique, data.user));
    });
  };
}

export function fetchCritique(critiqueToken) {
  return dispatch => {
    return get(`/critiques/${critiqueToken}.json`).done(data => {
      // TODO handle errors better
      if (data.critique === undefined) {
        dispatch(globalActions.setSnackbarMessage('We could not retrieve this critique. The user may have deleted it.'));
        return;
      }
      dispatch(receiveCritique(data.critique.critique, data.user.critiqueCreator));
    }).fail(data => {
      dispatch(globalActions.setSnackbarMessage('We could not retrieve this critique.'));
    });
  };
}

export function submitComment(text, critiqueToken) {
  return dispatch => {
    dispatch(postComment());
    return post('/critique_comments', {
      text,
      critiqueToken,
    }).done(data => {
      dispatch(postedComment(data.comments));
    }).fail(data => {
      dispatch(postCommentError());
      dispatch(globalActions.setSnackbarMessage(data.error));
    });
  };
}

export function submitCommentEdit(text, commentId) {
  return dispatch => {
    dispatch(postComment());
    return put('/critique_comments/${commentId}', {
      text,
      commentId,
    }).done(data => {
      dispatch(postedComment(data.comments));
    }).fail(data => {
      dispatch(postCommentError());
      dispatch(globalActions.setSnackbarMessage(data.error));
    });
  };
}

export function deleteComment(commentId) {
  return dispatch => {
    return del(`/critique_comments/${commentId}`, {
      commentId,
    }).done(data => {
      dispatch(deletedComment(data.comments));
    }).fail(data => {
      dispatch(globalActions.setSnackbarMessage(data.error));
    });
  };
}

export function deleteCritique(critiqueToken, router) {
  return dispatch => {
    dispatch(deleteCritiqueInProgress());
    return del(`/critiques/${critiqueToken}`, {
      critiqueToken,
    }).done(data => {
      router.push('/critiques');
      dispatch(globalActions.setSnackbarMessage('Successfully deleted your resume and critique.'));
      dispatch(deletedCritique());
    }).fail(data => {
      dispatch(globalActions.setSnackbarMessage(data.error));
    });
  };
}

export function reportComment(commentId) {
  return dispatch => {
    return post('/reports/critique_comment', {
      commentId,
    }).done(data => {
      dispatch(globalActions.setSnackbarMessage("Thank you for reporting this comment! We'll look into it ASAP."));
    });
  };
}

export function reportCritique(critiqueToken) {
  return dispatch => {
    return post('/reports/critique', {
      critiqueToken,
    }).done(data => {
      dispatch(globalActions.setSnackbarMessage("Thank you for reporting this critique! We'll look into it ASAP."));
    });
  };
}
