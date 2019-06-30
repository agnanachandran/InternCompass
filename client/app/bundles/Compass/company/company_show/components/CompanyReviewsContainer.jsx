import PropTypes from 'prop-types';
import React from 'react';
import PromptReviewContainer from './PromptReviewContainer';
import CompanyJobsContainer from './CompanyJobsContainer';
import CompanySidebar from './CompanySidebar';
import css from './CompanyReviewsContainer.scss';
import _ from 'lodash';

export default class CompanyReviewsContainer extends React.Component {
  static propTypes = {
    companyName: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    reviews: PropTypes.array,
    jobs: PropTypes.array.isRequired,
    currentUserId: PropTypes.number,
    onVoteCast: PropTypes.func.isRequired,
    recommendedCompanies: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
  }

  renderJobs() {
    if (_.isEmpty(this.props.reviews)) {
      return (
        <PromptReviewContainer
          companyName={this.props.companyName}
          dispatch={this.props.dispatch}
        />
      );
    }
    return (
      <CompanyJobsContainer
        jobs={this.props.jobs}
        currentUserId={this.props.currentUserId}
        onVoteCast={this.props.onVoteCast}
      />
    );
  }

  render() {
    return (
      <div>
        <div
          className={css.innerContainer}
        >
          <div className={css.jobsContainer}>
            {this.renderJobs()}
          </div>
          <div className={css.sidebarContainer}>
            <CompanySidebar
              recommendedCompanies={this.props.recommendedCompanies}
            />
          </div>
        </div>

      </div>
    );
  }
}

