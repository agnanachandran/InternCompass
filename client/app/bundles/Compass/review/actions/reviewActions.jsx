import { actionTypes } from '../../constants/compassConstants';
import { get, post, del } from '../../utils/ajaxCamelCase';

function reviewCreated(review) {
  return {
    type: actionTypes.SET_REVIEW,
    review,
  };
}

function receiveReview(review) {
  return {
    type: actionTypes.RECEIVE_REVIEW,
    review: review.review,
    comments: review.comments,
  };
}

function receiveCurrency(currency) {
  return {
    type: actionTypes.RECEIVE_CURRENCY,
    currency,
  };
}

function receiveCreateReview(createReview) {
  return {
    type: actionTypes.RECEIVE_CREATE_REVIEW,
    createReview,
  };
}

function deletedUserReview(userReviewToken) {
  return {
    type: actionTypes.USER_REVIEW_DELETED,
    userReviewToken,
  };
}

export function setReviewList(reviews) {
  const action = {
    type: actionTypes.SET_REVIEW_LIST,
    reviews,
  };
  return action;
}

export function setReviewCommentsList(comments) {
  const action = {
    type: actionTypes.SET_REVIEW_COMMENTS_LIST,
    comments,
  };
  return action;
}

export function appendReviewComments(comments) {
  const action = {
    type: actionTypes.APPEND_REVIEW_COMMENTS,
    comments,
  };
  return action;
}

export function fetchReviewComments(url, comments, errorHandler) {
  return dispatch => {
    return get(
      url,
      comments,
      comments => {
        dispatch(appendReviewComments(comments));
      },
      errorHandler
    );
  };
}

export function setReviewComment(comment) {
  const action = {
    type: actionTypes.SET_REVIEW_COMMENT,
    comment,
  };

  return action;
}

export function submitReviewComment(comment) {
  return dispatch => {
    return post('/user_reviews/comments', comment, comment => {
      dispatch(setReviewComment(comment));
    });
  };
}

export function setReviewVote(vote) {
  const action = {
    type: actionTypes.SET_REVIEW_VOTE,
    vote,
  };
  return action;
}

export function setReviewVoteInList(vote) {
  const action = {
    type: actionTypes.SET_REVIEW_VOTE_IN_LIST,
    vote,
  };
  return action;
}

export function setWriteReviewCompany(company) {
  return dispatch => {
    dispatch({
      type: actionTypes.SET_WRITE_REVIEW_COMPANY,
      company,
    });
  };
}

export function submitReview(review, router) {
  return dispatch => {
    return post('/user_reviews', review)
      .done(review => {
        dispatch(reviewCreated(review));
        router.replace(`/companies/${review.companySlug}`);
      });
  };
}

export function clearReviewSuccessMessage() {
  return dispatch => {
    dispatch({
      type: actionTypes.CLEAR_REVIEW_SUCCESS_MESSAGE,
    });
  };
}

export function fetchReview(token) {
  return dispatch => {
    return get(`/user_reviews/${token}.json`).done(data => {
      dispatch(receiveReview(data.review));
    });
  };
}

export function fetchCurrency(countryCode) {
  return dispatch => {
    return get('/user_reviews/currency_from_country.json', { countryCode }).done(data => {
      dispatch(receiveCurrency(data.currency));
    });
  };
}

export function fetchCreateReview() {
  return dispatch => {
    return get('/write-review.json').done(data => {
      dispatch(receiveCreateReview(data.review.createReview));
    });
  };
}

export function deleteReview(userReviewToken) {
  return dispatch => {
    return del(`/user_reviews/${userReviewToken}`)
      .done(() => {
        dispatch(deletedUserReview(userReviewToken));
      });
  };
}
