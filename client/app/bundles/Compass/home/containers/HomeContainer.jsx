import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as homeActions from '../actions/homeActions';
import { bindActionCreators } from 'redux';
import HomeWidget from '../components/HomeWidget';
import { connect } from 'react-redux';

class HomeContainer extends Component {
  static propTypes = {
    recentReviews: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.actions = bindActionCreators(homeActions, this.props.dispatch);
    if (this.props.recentReviews === null) {
      this.actions.fetchRecentReviewsList();
    }
  }

  componentDidMount() {
    if (window.location.hash === '#_=_') {
      history.replaceState
        ? history.replaceState(null, null, window.location.href.split('#')[0])
        : window.location.hash = '';
    }
  }

  componentWillUnmount() {
    this.actions.setRecentReviewsList(null);
  }

  render() {
    const { dispatch, recentReviews } = this.props;
    return (
      <HomeWidget
        recentReviews={recentReviews}
        dispatch={dispatch}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    recentReviews: state.review.recentReviews,
  };
}

export default connect(mapStateToProps)(HomeContainer);
