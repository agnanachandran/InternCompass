import React, { Component } from 'react';
import * as adminActions from '../actions/adminActions';
import CenteredSpinner from '../../components/CenteredSpinner';
import AdminUserListItem from '../components/AdminUserListItem';
import Paginator from '../components/Paginator';
import _ from 'lodash';
import css from './AdminUsersPanelContainer.scss';
import AdminCard from '../components/AdminCard';
import CardTitle from 'material-ui/Card/CardTitle';
import CardText from 'material-ui/Card/CardText';

export default class AdminUsersPanelContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      allUsersLoading: false
    };
    this.handlePageClick = this.handlePageClick.bind(this);
    this.receiveFullPageData = this.receiveFullPageData.bind(this);
    this.receiveUserPaginationData = this.receiveUserPaginationData.bind(this);
  }

  componentDidMount() {
    adminActions.fetchFullUserPageData(this.receiveFullPageData);
  }

  receiveFullPageData(data) {
    this.setState({
      loading: false,
      allUsersLoading: false,
      ...data
    });
  }

  receiveUserPaginationData(data) {
    this.setState({
      users: data.users,
      usersPagination: data.usersPagination,
      allUsersLoading: false
    });
  }

  handlePageClick(data) {
    if (parseInt(this.state.usersPagination.currentPage) === data.selected + 1) {
      return;
    }
    this.setState({ allUsersLoading: true }, () => {
      adminActions.fetchUserPageData(data.selected + 1, this.receiveUserPaginationData);
    });
  }

  renderUsers(users, userReviewCounts) {
    return _.map(users, user =>
      (
        <AdminUserListItem
          user={user}
          userReviewCount={userReviewCounts[user.id]}
          key={user.token}
        />
      )
    );
  }

  renderAllUsers() {
    if (this.state.allUsersLoading) {
      return (
        <CenteredSpinner size={1} marginTop={'5px'} />
      );
    }
    return (
      <div>
        <div>
          {this.renderUsers(this.state.users, this.state.userReviewCounts)}
        </div>
        <Paginator
          pageNum={this.state.usersPagination.totalPages}
          initialSelected={this.state.usersPagination.currentPage - 1}
          handlePageClick={this.handlePageClick}
        />
      </div>
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <CenteredSpinner size={1} marginTop={'56px'} />
      );
    }
    return (
      <div>
        <div className={css.parent}>
          <AdminCard>
            <CardTitle title={'Admin Users'} className={css.cardHeader} />
            <CardText>
              {this.renderUsers(this.state.adminUsers, this.state.userReviewCounts)}
            </CardText>
          </AdminCard>
        </div>
        <div className={css.parent}>
          <AdminCard>
            <CardTitle title={'New Users Today'} className={css.cardHeader} />
            <CardText>
              {this.renderUsers(this.state.newUsers, this.state.userReviewCounts)}
            </CardText>
          </AdminCard>
        </div>
        <div className={css.parent}>
          <AdminCard>
            <CardTitle title={'All Users'} className={css.cardHeader} />
            <CardText>
              {this.renderAllUsers()}
            </CardText>
          </AdminCard>
        </div>
      </div>
    );
  }
}