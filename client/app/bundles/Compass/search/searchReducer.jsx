import _ from 'lodash';
import { actionTypes } from '../constants/compassConstants';
import { searchResultOrders } from '../constants/SearchResultOrderConstants';

export const initialState = {
  navbarSearchQueryString: '',
  query: '',
  page: 1,
  totalPages: 0,
  results: [],
  order: searchResultOrders.MOST_REVIEWS,
  locationFilter: [],
};

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CLEAR_SEARCH_PARAMS:
      return initialState;
    case actionTypes.SET_NAVBAR_SEARCH_QUERY_STRING:
      return {
        ...state,
        navbarSearchQueryString: action.searchQueryString,
      };
    case actionTypes.SET_SEARCH_PARAMS:
      return {
        ...state,
        ...action,
      };
    case actionTypes.APPEND_SEARCH_RESULTS:
      return _.assign({}, state, {
        query: state.query,
        page: state.page,
        totalPages: state.totalPages,
        results: state.results.concat(action.search.results),
      });
    default:
      return state;
  }
}
