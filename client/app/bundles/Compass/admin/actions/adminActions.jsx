import { get, post } from '../../utils/ajaxCamelCase';

export function fetchContentSummaryData(callback) {
  get('/admin.json').done(callback);
}

export function fetchFullUserPageData(callback) {
  get('/admin/users.json').done(callback);
}

export function fetchUserPageData(page, callback) {
  get('/admin/users.json', {
    page: page,
    allUsersOnly: true
  }).done(callback);
}

export function fetchFullUserReviewPageData(page, callback) {
  get('/admin/user_reviews.json', {
    page: page
  }).done(callback);
}

export function fetchFullCompanyPageData(callback) {
  get('/admin/companies.json').done(callback);
}

export function fetchApprovedCompanyPageData(page, callback) {
  get('/admin/companies.json', {
    approved: true,
    approvedPage: page
  }).done(callback);
}

export function fetchNotApprovedCompanyPageData(page, callback) {
  get('/admin/companies.json', {
    approved: false,
    notApprovedPage: page
  }).done(callback);
}

export function fetchFeedback(callback) {
  get('/admin/feedback.json').done(callback);
}

export function fetchCompanyToEdit(companyId, callback) {
  get(`/admin/companies/edit/${companyId}.json`).done(callback);
}

export function updateCompany(company, callback) {
  post(`/admin/companies/update/${company.id}.json`, {
    company: { ...company }
  }).done(callback);
}

export function approveCompany(companyId, approvedCompaniesPage, notApprovedCompaniesPage, callback) {
  post('/admin/approve_company.json', {
    companyId: companyId,
    approvedPage: approvedCompaniesPage,
    notApprovedPage: notApprovedCompaniesPage
  }).done(callback);
}

export function toggleSpamUserReview(userReviewId, callback) {
  post('/admin/toggle_spam.json', {
    userReviewId: userReviewId
  }).done(callback);
}

export function toggleCuratedUserReview(userReviewId) {
  return post('/admin/toggle_curated.json', {
    userReviewId: userReviewId
  });
}

export function deleteUserReview(userReviewId, callback) {
  post('/admin/delete_review.json', {
    userReviewId,
  }).done(callback);
}
