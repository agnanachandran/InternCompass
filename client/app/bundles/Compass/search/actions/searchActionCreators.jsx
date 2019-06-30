import { actionTypes } from '../../constants/compassConstants';
import { get } from '../../utils/ajaxCamelCase';

export function setNavbarSearchQueryString(searchQueryString) {
  return {
    type: actionTypes.SET_NAVBAR_SEARCH_QUERY_STRING,
    searchQueryString,
  };
}

export function setSearchParams(params) {
  return {
    type: actionTypes.SET_SEARCH_PARAMS,
    ...params,
  };
}

export function clearSearchParams() {
  return {
    type: actionTypes.CLEAR_SEARCH_PARAMS,
  };
}

export function fetchSearchResults(query, page, order, locationFilter) {
  return dispatch => {
    return get('/search.json', {
      query,
      page,
      order,
      locationFilter,
    }).done(result => {
      dispatch(setSearchParams(result));
    });
  };
}

export function appendSearchResults(search) {
  const action = {
    type: actionTypes.APPEND_SEARCH_RESULTS,
    search,
  };
  return action;
}
