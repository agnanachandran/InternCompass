import { actionTypes } from '../../constants/compassConstants';
import { get, post } from '../../utils/ajaxCamelCase';
import { setReviewList } from '../../review/actions/reviewActions';

export function setCompany(company) {
  return {
    type: actionTypes.SET_COMPANY,
    company,
  };
}

export function fetchCompany(slug) {
  return dispatch => {
    return get(`/companies/${slug}.json`).done(companyData => {
      companyData.company.fullyLoaded = true;
      dispatch(setCompany(companyData.company));
      dispatch(setRecommendedCompanies(companyData.recommendedCompanies));
      dispatch(setReviewList(companyData.reviews));
    });
  };
}

export function setCompanyList(companyList) {
  return {
    type: actionTypes.SET_COMPANY_LIST,
    companyList
  };
}

export function setIsFollowingCompany(isFollowing, company) {
  return {
    type: actionTypes.SET_IS_FOLLOWING_COMPANY,
    isFollowing,
    company,
  };
}

export function fetchCompanyList() {
  return dispatch => {
    return get('/companies.json').done(companyList => {
      companyList.loaded = true;
      dispatch(setCompanyList(companyList));
    });
  };
}

export function followCompany(company) {
  return dispatch => {
    return post('/companies/follow', { slug: company.slug }).done(() => {
      dispatch(setIsFollowingCompany(true, company));
    });
  };
}

export function unfollowCompany(company) {
  return dispatch => {
    return post('/companies/unfollow', { slug: company.slug }).done(() => {
      dispatch(setIsFollowingCompany(false, company));
    });
  };
}

export function setRecommendedCompanies(recommendedCompanies) {
  return {
    type: actionTypes.SET_RECOMMENDED_COMPANIES,
    recommendedCompanies,
  };
}
