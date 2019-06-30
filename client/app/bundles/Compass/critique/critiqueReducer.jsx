import { actionTypes } from '../constants/compassConstants';

export const initialState = {
  userCritiques: null, // Currently logged in user's critiques
  critiques: null, // Critiques created by any user
  totalPages: 1,
  critique: null,
  isUploading: false,
  isPostingComment: false,
  isDeletingCritique: false,
};

export default function critiqueReducer(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case actionTypes.RECEIVE_CRITIQUES:
      return {
        ...state,
        critiques: action.critiques,
        userCritiques: action.userCritiques,
      };
    case actionTypes.RECEIVE_CRITIQUE:
      return {
        ...state,
        critique: action.critique,
      };
    case actionTypes.CREATE_CRITIQUE:
      return {
        ...state,
        isUploading: true,
      };
    case actionTypes.CREATED_CRITIQUE:
      return {
        ...state,
        isUploading: false,
      };
    case actionTypes.CREATE_CRITIQUE_ERROR:
      return {
        ...state,
        isUploading: false,
      };
    case actionTypes.DELETE_CRITIQUE_IN_PROGRESS:
      return {
        ...state,
        isDeletingCritique: true,
      };
    case actionTypes.DELETED_CRITIQUE:
      return {
        ...state,
        isDeletingCritique: false,
      };
    case actionTypes.POST_COMMENT:
      return {
        ...state,
        isPostingComment: true,
      };
    case actionTypes.POSTED_COMMENT:
      return {
        ...state,
        critique: {
          ...state.critique,
          comments: action.comments,
        },
        isPostingComment: false,
      };
    case actionTypes.POST_COMMENT_ERROR:
      return {
        ...state,
        isPostingComment: false,
      };
    case actionTypes.DELETED_COMMENT:
      return {
        ...state,
        critique: {
          ...state.critique,
          comments: action.comments,
        },
      };
    default:
      return state;
  }
}

