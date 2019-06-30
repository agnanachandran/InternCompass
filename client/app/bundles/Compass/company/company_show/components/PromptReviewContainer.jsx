import PropTypes from 'prop-types';
import React from 'react';
import Card from 'material-ui/Card';
import css from './PromptReviewContainer.scss';
import { Link } from 'react-router';
import * as reviewActions from '../../../review/actions/reviewActions';
import { bindActionCreators } from 'redux';

export default class PromptReviewContainer extends React.Component {
  static propTypes = {
    companyName: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.actions = bindActionCreators(reviewActions, props.dispatch);
    this.handleWriteReview = this.handleWriteReview.bind(this);
  }

  handleWriteReview() {
    this.actions.setWriteReviewCompany(this.props.companyName);
  }

  renderUserInfo() {
    return (
      <div className={css.userInfoContainer}>
        <div className={css.userInfoInnerContainer}>
          <img src={'/images/user_placeholder.png'} className={css.userPlaceholderProfilePhoto} />
          <div className={css.userPlaceholderName}>
            You
          </div>
        </div>
      </div>
    );
  }

  renderReviewInfo() {
    return (
      <div className={css.reviewInfoContainer}>
        <div className={css.reviewInfoInnerContainer}>
          <p className={css.reviewPrompt}>
            Have you interned here before? Help out the community and&nbsp;
            <Link
              to={{ pathname: '/write-review', query: { company: this.props.companyName } }}
              className={css.link}
              onClick={this.handleWriteReview}
            >
              write a review.
            </Link>
          </p>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={css.outerContainer}>
        <Card>
          <div className={css.container}>
            {this.renderUserInfo()}
            {this.renderReviewInfo()}
          </div>
        </Card>
      </div>
    );
  }
}

