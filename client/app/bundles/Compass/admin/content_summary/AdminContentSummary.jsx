import React, { Component } from 'react';
import * as adminActions from '../actions/adminActions';
import css from './AdminContentSummary.scss';
import CenteredSpinner from '../../components/CenteredSpinner';
import AdminPaper from '../components/AdminPaper';

export default class AdminContentSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.receiveData = this.receiveData.bind(this);
  }

  componentDidMount() {
    adminActions.fetchContentSummaryData(this.receiveData);
  }

  receiveData(data) {
    this.setState({
      loading: false,
      data
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <CenteredSpinner size={1.5} marginTop={'56px'} />
      );
    }
    const {
      newUsersCount,
      newReviewsCount,
      newJobsCount,
      newCompaniesCount,
      allUsersCount,
      allReviewsCount,
      allJobsCount,
      allCompaniesCount
    } = this.state.data;
    return (
      <div>
        <div className={css.row}>
          <div className={css.todayStatParent}>
            <AdminPaper>
              <span className={css.todayStatNumber}>{newUsersCount}</span> new users today
            </AdminPaper>
          </div>
          <div className={css.todayStatParent}>
            <AdminPaper>
              <span className={css.todayStatNumber}>{newReviewsCount}</span> new reviews today
            </AdminPaper>
          </div>
          <div className={css.todayStatParent}>
            <AdminPaper>
              <span className={css.todayStatNumber}>{newJobsCount}</span> new jobs today
            </AdminPaper>
          </div>
          <div className={css.todayStatParent}>
            <AdminPaper>
              <span className={css.todayStatNumber}>{newCompaniesCount}</span> new companies today
            </AdminPaper>
          </div>
        </div>
        <div className={css.row}>
          <div className={css.todayStatParent}>
            <AdminPaper>
              <span className={css.todayStatNumber}>{allUsersCount}</span> total users
            </AdminPaper>
          </div>
          <div className={css.todayStatParent}>
            <AdminPaper>
              <span className={css.todayStatNumber}>{allReviewsCount}</span> total reviews
            </AdminPaper>
          </div>
          <div className={css.todayStatParent}>
            <AdminPaper>
              <span className={css.todayStatNumber}>{allJobsCount}</span> total jobs
            </AdminPaper>
          </div>
          <div className={css.todayStatParent}>
            <AdminPaper>
              <span className={css.todayStatNumber}>{allCompaniesCount}</span> total companies
            </AdminPaper>
          </div>
        </div>
      </div>
    );
  }
}