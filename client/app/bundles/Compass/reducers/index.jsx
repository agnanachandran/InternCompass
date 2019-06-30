// This file is our manifest of all reducers for the app.
import { routerReducer } from 'react-router-redux';
import compassReducer, { initialState as compassState } from './compassReducer';
import companyReducer, { initialState as companyState } from '../company/companyReducer';
import interviewQuestionReducer, { initialState as interviewQuestionState } from '../interview_question/interviewQuestionReducer';
import userReducer, { initialState as userState } from '../user/userReducer';
import jobReducer, { initialState as jobState } from '../job/jobReducer';
import reviewReducer, { initialState as reviewState } from '../review/reviewReducer';
import searchReducer, { initialState as searchState } from '../search/searchReducer';
import companiesReducer, { initialState as companiesState } from '../companies/companiesReducer';
import critiqueReducer, { initialState as critiqueState } from '../critique/critiqueReducer';

import _ from 'lodash';
import { combineReducers } from 'redux';

export default combineReducers({
  compassStore: compassReducer,
  company: companyReducer,
  interviewQuestion: interviewQuestionReducer,
  routing: routerReducer,
  user: userReducer,
  job: jobReducer,
  review: reviewReducer,
  search: searchReducer,
  companies: companiesReducer,
  critique: critiqueReducer,
});

export const initialState = {
  compassStore: _.cloneDeep(compassState),
  company: _.cloneDeep(companyState),
  interviewQuestion: _.cloneDeep(interviewQuestionState),
  user: _.cloneDeep(userState),
  job: _.cloneDeep(jobState),
  review: _.cloneDeep(reviewState),
  search: _.cloneDeep(searchState),
  companies: _.cloneDeep(companiesState),
  critique: _.cloneDeep(critiqueState),
};
