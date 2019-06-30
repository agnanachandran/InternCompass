import { actionTypes } from '../../constants/compassConstants';
import { get } from '../../utils/ajaxCamelCase';

export function setRecentReviewsList(reviews) {
  const action = {
    type: actionTypes.SET_RECENT_REVIEWS_LIST,
    reviews,
  };
  return action;
}

export function fetchRecentReviewsList() {
  return dispatch => {
    return get('/user_reviews/recent.json').done(data => {
      dispatch(setRecentReviewsList(data.review.recentReviews));
    });
  };
}

