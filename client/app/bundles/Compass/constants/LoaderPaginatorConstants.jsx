import mirrorCreator from 'mirror-creator';

export const dataSources = mirrorCreator([
  'REVIEW_COMMENTS',
  'SEARCH_RESULTS',
]);

export const dataSourcesToUrls = {
  REVIEW_COMMENTS: '/user_reviews/comments',
  SEARCH_RESULTS: '/search.json',
};
