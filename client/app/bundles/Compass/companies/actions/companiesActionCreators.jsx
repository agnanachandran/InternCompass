import { actionTypes } from '../../constants/compassConstants';
import { get } from '../../utils/ajaxCamelCase';

export function setCompanies(companyCategories) {
  return {
    type: actionTypes.SET_COMPANIES,
    companyCategories,
  };
}

export function fetchCompanies() {
  return dispatch => {
    return get('/companies.json').done(companyCategories => {
      dispatch(setCompanies(companyCategories));
    });
  };
}
