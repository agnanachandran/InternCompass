import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as companyActionCreators from '../actions/companyActionCreators';
import * as reviewActions from '../../review/actions/reviewActions';
import CompanyContent from './components/CompanyContent';
import CenteredSpinner from '../../components/CenteredSpinner';
import Snackbar from 'material-ui/Snackbar';

class CompanyContainer extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired, // object whose only key is `companySlug`
    company: PropTypes.object.isRequired,
    recommendedCompanies: PropTypes.array.isRequired,
    reviews: PropTypes.array,
    currentUser: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    fromSuccessfulWriteReview: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.actions = bindActionCreators({ ...companyActionCreators, ...reviewActions }, props.dispatch);
    this.handleSuccessMessageClose = this.handleSuccessMessageClose.bind(this);
  }

  componentDidMount() {
    if (!this.props.company.fullyLoaded) {
      this.actions.fetchCompany(this.props.params.companySlug);
    }
  }

  componentWillReceiveProps(nextProps) {
    // Ensure navigating to another company page fetches the new company's data
    if (this.props.company.fullyLoaded && this.props.params.companySlug !== nextProps.params.companySlug) {
      this.actions.fetchCompany(nextProps.params.companySlug);
    }
  }

  componentWillUnmount() {
    this.actions.setCompany({
      fullyLoaded: false,
    });
  }

  handleSuccessMessageClose() {
    this.actions.clearReviewSuccessMessage();
  }

  render() {
    const company = this.props.company;
    const currentUser = this.props.currentUser;

    let currentUserId = null;
    if (currentUser) {
      currentUserId = currentUser.id;
    }

    if (!company.fullyLoaded) {
      return (
        <CenteredSpinner size={1} marginTop={'56px'} />
      );
    }
    return (
      <div>
        <CompanyContent
          name={company.name}
          description={company.description}
          dispatch={this.props.dispatch}
          logoUrl={company.logoUrl}
          websiteUrl={company.websiteUrl}
          careersUrl={company.careersUrl}
          hqCity={company.hqCity}
          hqRegion={company.hqRegion}
          avgRating={company.avgRating}
          slug={this.props.params.companySlug}
          reviews={this.props.reviews}
          currentUserId={currentUserId}
          onVoteCast={this.actions.setReviewVoteInList}
          isFollowing={company.isFollowing}
          recommendedCompanies={this.props.recommendedCompanies}
        />
        <Snackbar
          open={this.props.fromSuccessfulWriteReview}
          message='Thanks for submitting your review!'
          autoHideDuration={4000}
          onRequestClose={this.handleSuccessMessageClose}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    company: state.company.company,
    recommendedCompanies: state.company.recommendedCompanies,
    reviews: state.review.reviews,
    currentUser: state.compassStore.currentUser,
    fromSuccessfulWriteReview: state.review.createReview.success,
  };
}

export default connect(mapStateToProps)(CompanyContainer);
