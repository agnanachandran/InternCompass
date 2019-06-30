import { actionTypes } from '../../constants/compassConstants';

export function setInterviewQuestionsList(interviewQuestions) {
  const action = {
    type: actionTypes.SET_INTERVIEW_QUESTIONS_LIST,
    interviewQuestions: interviewQuestions
  };
  return action;
}

export function setInterviewQuestion(interviewQuestion) {
  const action = {
    type: actionTypes.SET_INTERVIEW_QUESTION,
    interviewQuestion: interviewQuestion
  };
  return action;
}

export function setDifficulty(difficulty) {
  const action = {
    type: actionTypes.SET_INTERVIEW_QUESTION_CURRENT_FILTER,
    listFilter: { difficulty: difficulty }
  };
  return action;
}

export function setCategory(category) {
  const action = {
    type: actionTypes.SET_INTERVIEW_QUESTION_CURRENT_FILTER,
    listFilter: { category: category }
  };
  return action;
}

export function initFilters(data) {
  const action = {
    type: actionTypes.INIT_INTERVIEW_QUESTION_FILTERS,
    filters: data
  };
  return action;
}
