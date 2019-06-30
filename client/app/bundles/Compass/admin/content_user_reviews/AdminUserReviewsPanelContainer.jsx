import React, { Component } from 'react';
import * as adminActions from '../actions/adminActions';
import CenteredSpinner from '../../components/CenteredSpinner';
import AdminUserReviewListItem from '../components/AdminUserReviewListItem';
import Paginator from '../components/Paginator';
import _ from 'lodash';
import css from './AdminUserReviewsPanelContainer.scss';
import AdminCard from '../components/AdminCard';
import CardTitle from 'material-ui/Card/CardTitle';
import CardText from 'material-ui/Card/CardText';

export default class AdminUserReviewsPanelContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.handlePageClick = this.handlePageClick.bind(this);
    this.receiveFullPageData = this.receiveFullPageData.bind(this);
  }

  componentDidMount() {
    adminActions.fetchFullUserReviewPageData(1, this.receiveFullPageData);
  }

  handlePageClick(data) {
    if (parseInt(this.state.userReviewsPagination.currentPage) === data.selected + 1) {
      return;
    }
    this.setState({ loading: true }, () => {
      adminActions.fetchFullUserReviewPageData(data.selected + 1, this.receiveFullPageData);
    });
  }

  handleCurationToggle(userReview) {
    return () => {
      this.setState({ loading: true }, () => {
        adminActions.toggleCuratedUserReview(userReview.id)
          .done(curatedRecentReview => {
            userReview.curatedRecentReview = curatedRecentReview;
            this.setState({ loading: false });
          });
      });
    };
  }

  handleSpamToggle(userReview) {
    return () => {
      this.setState({ loading: true }, () => {
        adminActions.toggleSpamUserReview(userReview.id, (data) => {
          userReview.userReviewSpamId = data.userReviewSpamId;
          this.setState({ loading: false });
        });
      });
    };
  }

  handleDeleteReview(userReview) {
    const parent = this;
    return () => {
      this.setState({ loading: true }, () => {
        adminActions.deleteUserReview(userReview.id, data => {
          const newUserReviews = parent.state.userReviews.slice();
          _.remove(newUserReviews, review => review.id === userReview.id);
          this.setState({ loading: false, userReviews: newUserReviews });
        });
      });
    };
  }

  receiveFullPageData(data) {
    this.setState({
      loading: false,
      ...data
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <CenteredSpinner size={1.5} marginTop={'56px'} />
      );
    }
    return (
      <AdminCard>
        <CardTitle title={'All User Reviews'} className={css.cardHeader} />
        <CardText>
          <div className={css.header}>
            <div className={css.columnLabel}>Show in recent review widget</div>
          </div>
          <div>
            {
              _.map(this.state.userReviews, userReview =>
                (
                  <AdminUserReviewListItem
                    userReview={userReview}
                    key={userReview.token}
                    handleSpamToggle={this.handleSpamToggle(userReview)}
                    handleCurationToggle={this.handleCurationToggle(userReview)}
                    deleteReview={this.handleDeleteReview(userReview)}
                  />
                )
              )
            }
          </div>
          <Paginator
            pageNum={this.state.userReviewsPagination.totalPages}
            initialSelected={this.state.userReviewsPagination.currentPage - 1}
            handlePageClick={this.handlePageClick}
          />
        </CardText>
      </AdminCard>
    );
  }
}