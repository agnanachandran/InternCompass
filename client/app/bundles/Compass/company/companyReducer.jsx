import _ from 'lodash';
import { actionTypes } from '../constants/compassConstants';

export const initialState = {
  company: {
    fullyLoaded: false
  },
  recommendedCompanies: [],
};

export default function companyReducer(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case actionTypes.SET_COMPANY:
      return _.assign({}, state, { company: action.company });
    case actionTypes.SET_IS_FOLLOWING_COMPANY:
      return _.assign({}, state, {
        company: _.assign({}, state.company, { isFollowing: action.isFollowing }),
      });
    case actionTypes.SET_RECOMMENDED_COMPANIES:
      return {
        ...state,
        recommendedCompanies: action.recommendedCompanies,
      };
    default:
      return state;
  }
}
