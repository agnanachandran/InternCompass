import PropTypes from 'prop-types';
import React from 'react';
import WriteReviewForm from './WriteReviewForm';
import css from './WriteReviewWidget.scss';
import Paper from 'material-ui/Paper';

export default class WriteReviewWidget extends React.Component {
  static propTypes = {
    prefilledCompanyName: PropTypes.string,
    fetchCurrency: PropTypes.func.isRequired,
    submitReview: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    serverError: PropTypes.bool.isRequired,
  };

  render() {
    return (
      <div className={css.outerContainer}>
        <Paper zDepth={3} className={css.container}>
          <h2 className={css.header}>Share Your Experience</h2>
          <WriteReviewForm {...this.props}/>
        </Paper>
      </div>
    );
  }
}
