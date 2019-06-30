import PropTypes from 'prop-types';
import React, { Component } from 'react';
import JobWidget from '../components/JobWidget';
import { connect } from 'react-redux';
import * as jobActions from '../actions/jobActions';
import { bindActionCreators } from 'redux';

class JobContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    job: PropTypes.object,
    companySlug: PropTypes.string.isRequired,
    jobSlug: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const { dispatch, job, companySlug, jobSlug } = this.props;
    const { fetchJob } = bindActionCreators(jobActions, dispatch);
    if (!job) {
      fetchJob(companySlug, jobSlug);
    }
  }

  render() {
    return this.props.job && (
      <JobWidget {...this.props.job} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  let job = state.job.job;

  if (!job || job.slug !== ownProps.params.jobSlug) {
    job = null;
  }
  return {
    job: job,
    companySlug: ownProps.params.companySlug,
    jobSlug: ownProps.params.jobSlug,
  };
}

export default connect(mapStateToProps)(JobContainer);
