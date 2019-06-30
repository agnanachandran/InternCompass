import PropTypes from 'prop-types';
import React, { Component } from 'react';
import css from './AdminUserListItem.scss';
import commonCss from '../AdminListItem.scss';
import { formatDate } from '../../utils/formatUtils';

export default class AdminUserListItem extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    userReviewCount: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showDetails: false
    };
    this.handleUserListItemClick = this.handleUserListItemClick.bind(this);
  }

  handleUserListItemClick() {
    this.setState({ showDetails: !this.state.showDetails });
  }

  renderFacebookLabel(user) {
    if (user.provider === 'facebook') {
      return (
        <a href={`http://www.facebook.com/${user.uid}`}>
          <i className='fa fa-facebook-official' aria-hidden={true} /> facebook
        </a>
      );
    } else if (!user.provider) {
      return (
        'email/password'
      );
    }
  }

  renderUserTypeLabel(user) {
    if (user.admin) {
      return (
        <span style={{ color: 'red' }}>admin</span>
      );
    }
    return (
      <span>standard</span>
    );
  }

  render() {
    const {
      user,
      userReviewCount
    } = this.props;
    return (
      <div className={commonCss.listItemParent} onClick={this.handleUserListItemClick}>
        <div className={commonCss.listItemRow}>
          <div style={{ width: '5%' }}><strong>{user.id}</strong></div>
          <div style={{ width: '20%' }}><strong>{user.email}</strong></div>
          <div style={{ width: '15%' }}>{`${user.firstName} ${user.lastName}`}</div>
          <div style={{ width: '20%' }}>{formatDate(user.createdAt)}</div>
          <div style={{ width: '15%' }}>{this.renderFacebookLabel(user)}</div>
          <div style={{ width: '10%' }}>{this.renderUserTypeLabel(user)}</div>
        </div>
        {
          this.state.showDetails &&
          <div className={css.userFullDetails}>
            <div>{user.token}</div>
            <div>{user.id}</div>
            <div>{user.email}</div>
            <div>{`${user.firstName} ${user.lastName}`}</div>
            <div>Wrote {userReviewCount} user review(s)</div>
          </div>
        }
      </div>
    );
  }
}