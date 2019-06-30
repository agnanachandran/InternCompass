import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import UserReviewItem from './UserReviewItem';
import css from './UserReviews.scss';
import CenteredSpinner from '../../components/CenteredSpinner';

export default class UserReviews extends React.Component {
  static propTypes = {
    reviews: PropTypes.array.isRequired,
    deleteReview: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    isViewingCurrentUser: PropTypes.bool.isRequired,
  };

  renderReviews() {
    return _.map(this.props.reviews, review => (
        <UserReviewItem
          key={review.id}
          deleteReview={this.props.deleteReview}
          isViewingCurrentUser={this.props.isViewingCurrentUser}
          {...review}
        />
      )
    );
  }

  render() {
    if (this.props.loading) {
      return <CenteredSpinner size={1.5} marginTop='75px'/>;
    }

    return (
      <div className={css.container}>
        <p className={css.reviewCount}>
          Reviews ({this.props.reviews.length})
        </p>
        {this.renderReviews()}
      </div>
    );
  }
}
