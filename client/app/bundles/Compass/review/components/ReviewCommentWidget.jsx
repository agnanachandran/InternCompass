import PropTypes from 'prop-types';
import React from 'react';
import css from './ReviewCommentWidget.scss';
import moment from 'moment';

class ReviewCommentWidget extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    commenter: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  };

  render() {
    const { commenter, text, updatedAt } = this.props;
    const postedTime = moment(updatedAt).fromNow();

    return (
      <div className={css.container}>
        <span className={css.header}>{`${commenter} `}</span>
        <span className={css.faded}>{postedTime}</span>
        <p className={css.text}>{text}</p>
      </div>
    );
  }
}

export default ReviewCommentWidget;
