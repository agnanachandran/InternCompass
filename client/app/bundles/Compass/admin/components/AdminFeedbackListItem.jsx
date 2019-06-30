import PropTypes from 'prop-types';
import React from 'react';
import css from './AdminFeedbackListItem.scss';
import moment from 'moment';

export default class AdminFeedbackRow extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    email: PropTypes.string,
    comment: PropTypes.string,
    createdAt: PropTypes.string,
  };

  render() {
    return (
      <div className={css.listItem}>
        <span className={css.label}>Name:</span>
        {this.props.name || 'Anonymous'}<br/>
        <span className={css.label}>Email:</span>
        {this.props.email}<br/>
        <span className={css.label}>Date:</span>
        {moment(this.props.createdAt).format('MMM DD YYYY, h:mm:ss a')}
        <div className={`${css.label} ${css.comment}`}>Comment:</div>
        <div>
          {this.props.comment}
        </div>
      </div>
    );
  }
}
