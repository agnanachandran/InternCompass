import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import CompanyJobContainer from './CompanyJobContainer';
import { COMPANY_JOB_SHAPE } from '../../../constants/propTypesConstants';

export default class CompanyJobsContainer extends React.Component {
  static propTypes = {
    jobs: PropTypes.arrayOf(COMPANY_JOB_SHAPE).isRequired,
    currentUserId: PropTypes.number,
    onVoteCast: PropTypes.func.isRequired,
  };

  renderJobs() {
    return _.map(this.props.jobs, (job, i) => {
      const { title, location, reviews } = job;
      return (
        <CompanyJobContainer
          key={i}
          title={title}
          location={location}
          reviews={reviews}
          currentUserId={this.props.currentUserId}
          onVoteCast={this.props.onVoteCast}
        />
      );
    });
  }

  render() {
    return (
      <div>
        {this.renderJobs()}
      </div>
    );
  }
}

