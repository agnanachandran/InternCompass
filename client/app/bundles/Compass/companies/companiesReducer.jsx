import _ from 'lodash';
import { actionTypes } from '../constants/compassConstants';

export const initialState = {
  companyCategories: null,
};

export default function companiesReducer(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case actionTypes.SET_COMPANIES:
      return _.assign({}, state, { companyCategories: action.companyCategories });
    default:
      return state;
  }
}
