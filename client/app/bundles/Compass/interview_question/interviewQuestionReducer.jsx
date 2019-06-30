import { actionTypes } from '../constants/compassConstants';
import _ from 'lodash';

export const initialState = {
  interviewQuestions: null,
  interviewQuestion: null,
  listFilter: {
    difficulty: 'all',
    category: 'all'
  },
  difficulties: null,
  categories: null
};

export default function interviewQuestionReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_INTERVIEW_QUESTIONS_LIST:
      return _.assign({}, state, { interviewQuestions: action.interviewQuestions });
    case actionTypes.SET_INTERVIEW_QUESTION:
      return _.assign({}, state, { interviewQuestion: action.interviewQuestion });
    case actionTypes.SET_INTERVIEW_QUESTION_CURRENT_FILTER:
      return _.merge({}, state, { listFilter: action.listFilter });
    case actionTypes.INIT_INTERVIEW_QUESTION_FILTERS:
      return _.merge({}, state, action.filters);
    default:
      return state;
  }
}
