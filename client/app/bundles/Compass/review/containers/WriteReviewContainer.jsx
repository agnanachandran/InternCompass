import PropTypes from 'prop-types';
import React, { Component } from 'react';
import WriteReviewWidget from '../components/WriteReviewWidget';
import { connect } from 'react-redux';
import * as reviewActions from '../actions/reviewActions';
import _ from 'lodash';
import { bindActionCreators } from 'redux';

class WriteReviewContainer extends Component {
  static propTypes = {
    createReview: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: false,
      serverError: false,
    };
    this.actions = bindActionCreators(reviewActions, props.dispatch);
    this.handleSubmitReview = this.handleSubmitReview.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
  }

  componentDidMount() {
    if (this.props.createReview.suggestedPerks === null) {
      this.actions.fetchCreateReview();
    }
  }

  handleSubmitReview(review) {
    this.setState({ loading: true, serverError: false });
    this.actions.submitReview(review, this.context.router)
      .fail(() => this.setState({ loading: false, serverError: true }));
  }

  handleCurrencyChange(country) {
    this.actions.fetchCurrency(country);
  }

  render() {
    const prefilledCompanyName = _.get(this.props.location, 'query.company', null);
    return (
      <WriteReviewWidget
        prefilledCompanyName={prefilledCompanyName}
        submitReview={this.handleSubmitReview}
        fetchCurrency={this.handleCurrencyChange}
        loading={this.state.loading}
        serverError={this.state.serverError}
        {...this.props.createReview}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    createReview: state.review.createReview,
  };
}

export default connect(mapStateToProps)(WriteReviewContainer);
