import PropTypes from 'prop-types';

export const COMPANY_JOB_SHAPE = PropTypes.shape({
  title: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  reviews: PropTypes.array.isRequired,
});

export const USER_PROFILE_DATA_SHAPE = PropTypes.shape({
  school: PropTypes.string,
  program: PropTypes.string,
  personal_website: PropTypes.string,
  github: PropTypes.string,
  linkedin: PropTypes.string,
  twitter: PropTypes.string,
  blog: PropTypes.string,
  dribbble: PropTypes.string,
  bio: PropTypes.string,
});
