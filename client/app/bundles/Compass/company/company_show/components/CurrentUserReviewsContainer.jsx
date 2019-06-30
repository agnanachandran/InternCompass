import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import pluralize from 'pluralize';
import CompanyJobReview from './CompanyJobReview';
import css from './CurrentUserReviewsContainer.scss';

export default class CurrentUserReviewsContainer extends React.Component {
  static propTypes = {
    reviews: PropTypes.array.isRequired,
    userId: PropTypes.number.isRequired,
    onVoteCast: PropTypes.func.isRequired,
  };

  renderUserReviews() {
    return _.map(this.props.reviews, (review) => {
      return (
        <div key={review.id}>
          <h3 className={css.reviewHeader}>
            {review.jobTitle} ({review.jobLocation})
          </h3>
          <h4 className={css.reviewAnonymousHeader}>
            {review.anonymous && 'Note that your review shows up anonymously to everyone else'}
          </h4>
          <CompanyJobReview
            review={review}
          />
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <h2 className={css.title}>Your {pluralize('Review', this.props.reviews.length)}</h2>
        {this.renderUserReviews()}
      </div>
    );
  }
}


