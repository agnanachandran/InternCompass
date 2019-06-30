import PropTypes from 'prop-types';
import React, { Component } from 'react';
import css from './AdminUserReviewListItem.scss';
import commonCss from '../AdminListItem.scss';
import { formatDate } from '../../utils/formatUtils';
import Checkbox from 'material-ui/Checkbox';

export default class AdminUserReviewListItem extends Component {
  static propTypes = {
    userReview: PropTypes.object.isRequired,
    handleSpamToggle: PropTypes.func.isRequired,
    handleCurationToggle: PropTypes.func.isRequired,
    deleteReview: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
    };
    this.handleUserReviewListItemClick = this.handleUserReviewListItemClick.bind(this);
  }

  handleUserReviewListItemClick() {
    this.setState({ showDetails: !this.state.showDetails });
  }

  renderSpamLabel(userReview) {
    if (userReview.userReviewSpamId) {
      return (
        <span style={{ color: 'red' }}>spam</span>
      );
    } else {
      return '';
    }
  }

  render() {
    const {
      userReview,
      handleSpamToggle,
      handleCurationToggle,
      deleteReview,
    } = this.props;
    return (
      <div className={commonCss.listItemParent} onClick={this.handleUserReviewListItemClick}>
        <div className={commonCss.listItemRow}>
          <div className={css.colId}><span className={commonCss.bold}>{userReview.id}</span></div>
          <div className={css.colCreatedAt}>{formatDate(userReview.createdAt)}</div>
          <div className={css.colCompanyName}>{userReview.company.name}</div>
          <div className={css.colJobTitle}>{userReview.job.title}</div>
          <div className={css.colUserEmail}>{userReview.user.email}</div>
          <div className={css.colSpamLabel}>{this.renderSpamLabel(userReview)}</div>
          <div className={css.colCurateCheckbox}>
            <Checkbox
              className={css.checkbox}
              checked={!!userReview.curatedRecentReview}
              onCheck={handleCurationToggle}
            />
          </div>
        </div>
        {
          this.state.showDetails &&
            <div className={css.userReviewFullDetails}>
              <div>{userReview.token}</div>
              <div>{`${userReview.company.name}, ${userReview.job.title}`}</div>
              <div>{`${userReview.user.email}, ${userReview.user.firstName} ${userReview.user.lastName}`}</div>
              <div className={css.description}>"{userReview.description}"</div>
              <div><span className={commonCss.bold}>Overall Rating:</span> {userReview.overallRating}</div>
              <div><span className={commonCss.bold}>Mentorship Rating:</span> {userReview.mentorshipRating}</div>
              <div><span className={commonCss.bold}>Work Life Balance Rating:</span> {userReview.workLifeBalanceRating}</div>
              <div><span className={commonCss.bold}>Meaningful Work Rating:</span> {userReview.meaningfulWorkRating}</div>
              <div><span className={commonCss.bold}>Salary:</span> {`${userReview.salaryInCents/100} ${userReview.currency} ${userReview.payPeriod}`}</div>
              {
                !userReview.userReviewSpamId &&
                  <div onClick={handleSpamToggle} className={css.markAsSpam}>Mark As Spam</div>
              }
              {
                userReview.userReviewSpamId &&
                  <div onClick={handleSpamToggle} className={css.unmarkAsSpam}>Unmark As Spam</div>
              }
              <button onClick={deleteReview}>Delete</button>
            </div>
        }
      </div>
    );
  }
}