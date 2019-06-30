import { actionTypes } from '../constants/compassConstants';
import _ from 'lodash';

export const initialState = {
  critiqueCreator: null,
  critiqueCreators: null,
  user: null,
  signup: { confirmationSent: false, errors: {} },
  signin: { errorMsg: '' },
  changePassword: { error: false },
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.RECEIVE_CRITIQUES:
      return _.assign({}, state, {
        critiqueCreators: action.critiqueCreators,
      });
    case actionTypes.RECEIVE_CRITIQUE:
      return _.assign({}, state, {
        critiqueCreator: action.critiqueCreator,
      });
    case actionTypes.RECEIVE_USER:
      return _.assign({}, state, {
        user: action.user,
      });
    case actionTypes.SIGN_UP_ERROR:
      return _.assign({}, state, {
        signup: { confirmationSent: false, errors: action.errors },
      });
    case actionTypes.SIGN_UP_LOADING:
      return _.assign({}, state, {
        signup: { confirmationSent: false },
      });
    case actionTypes.CONFIRMATION_SENT:
      return _.assign({}, state, {
        signup: { confirmationSent: true },
      });
    case actionTypes.CLEAR_CONFIRMATION:
      return _.assign({}, state, {
        signup: { confirmationSent: false },
      });
    case actionTypes.CLEAR_SIGN_IN_ERROR:
      return _.assign({}, state, {
        signin: { errorMsg: '' },
      });
    case actionTypes.SIGN_IN_ERROR:
      return _.assign({}, state, {
        signin: { errorMsg: action.errorMsg },
      });
    case actionTypes.CHANGE_PASSWORD_ERROR:
      return _.assign({}, state, {
        changePassword: { error: true },
      });
    case actionTypes.SET_IS_FOLLOWING_COMPANY:
      const following = state.user ? state.user.following.slice() : [];
      if (action.isFollowing) {
        following.push(action.company);
      } else {
        _.remove(following, company => company.slug === action.company.slug);
      }
      return _.assign({}, state, {
        user: _.assign({}, state.user, { following: following }),
      });
    case actionTypes.USER_REVIEW_DELETED:
      const userReviews = state.user.reviews.slice();
      _.remove(userReviews, review => review.token === action.userReviewToken);
      return _.assign({}, state, {
        user: _.assign({}, state.user, { reviews: userReviews }),
      });
    case actionTypes.USER_PROFILE_UPDATED:
      return {
        ...state,
        user: {
          ...state.user,
          profileData: action.profileData,
        },
      };
    default:
      return state;
  }
}
