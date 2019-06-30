import { actionTypes } from '../constants/compassConstants';
import _ from 'lodash';

export const initialState = {
  recentReviews: null,
  review: null,
  createReview: {
    currency: 'CAD',
    suggestedPerks: null,
    prefilledCompany: '',
    success: false,
  },
  comments: { comments: [], totalPages: 1 },
};

function updateReviewVote(review, voteData) {
  let newReview = _.assign({}, review);
  const vote = voteData.vote;

  if (voteData.removed) {
    if (vote) {
      newReview.upvote -= 1;
    } else {
      newReview.downvote -=1;
    }
    newReview.userVote = null;
  } else {
    if (vote) {
      newReview.upvote += 1;
    } else {
      newReview.downvote += 1;
    }

    if (voteData.reCast) {
      if (vote) {
        newReview.downvote -= 1;
      } else {
        newReview.upvote -= 1;
      }
    }
    newReview.userVote = vote;
  }

  return newReview;
}

export default function reviewReducer(state = initialState, action) {
  switch(action.type) {
    case actionTypes.CLEAR_REVIEW_SUCCESS_MESSAGE:
      return _.assign({}, state, {
        createReview: _.merge({}, state.createReview, {
          success: false,
        }),
      });
    case actionTypes.RECEIVE_CREATE_REVIEW: {
      return _.assign({}, state, {
        createReview: _.merge({}, state.createReview, action.createReview),
      });
    }
    case actionTypes.RECEIVE_CURRENCY: {
      let newCreateReview = _.assign({}, state.createReview);
      newCreateReview.currency = action.currency;
      return _.assign({}, state, {
        createReview: newCreateReview,
      });
    }
    case actionTypes.RECEIVE_REVIEW: {
      return _.assign({}, state, {
        review: action.review,
        comments: action.comments,
      });
    }
    case actionTypes.SET_WRITE_REVIEW_COMPANY: {
      return _.assign({}, state, {
        createReview: _.merge({}, state.createReview, {
          prefilledCompany: action.company,
        }),
      });
    }
    case actionTypes.SET_REVIEW: {
      return _.assign({}, state, {
        review: action.review,
        createReview: _.merge({}, state.createReview, {
          success: true,
        }),
      });
    }
    case actionTypes.SET_REVIEW_LIST: {
      return _.assign({}, state, {
        reviews: action.reviews,
      });
    }

    case actionTypes.SET_REVIEW_COMMENT: {
      return _.assign({}, state, {
        comments: {
          comments: [action.comment].concat(state.comments.comments),
          totalPages: state.comments.totalPages,
        },
      });
    }
    case actionTypes.APPEND_REVIEW_COMMENTS: {
      return _.assign({}, state, {
        comments: {
          comments: state.comments.comments.concat(action.comments.comments),
          totalPages: state.comments.totalPages,
        },
      });
    }
    case actionTypes.SET_REVIEW_VOTE: {
      let newReview = updateReviewVote(state.review, action.vote);
      return _.assign({}, state, {
        review: newReview,
      });
    }
    case actionTypes.SET_REVIEW_VOTE_IN_LIST: {
      let reviews = _.assign([], state.reviews);
      const reviewIndex = _.findIndex(reviews, review => {
        return review.id === action.vote.userReviewId;
      });
      reviews[reviewIndex] = updateReviewVote(reviews[reviewIndex], action.vote);
      return _.assign({}, state, {
        reviews: reviews,
      });

    }
    case actionTypes.SET_RECENT_REVIEWS_LIST: {
      return _.assign({}, state, {
        recentReviews: action.reviews,
      });
    }
    default:
      return state;
  }
}

