import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import css from './ReviewCommentBoxWidget.scss';
import classnames from 'classnames';
import $ from 'jquery';
import _ from 'lodash';

export default class ReviewCommentBoxWidget extends React.Component {
  static propTypes = {
    reviewId: PropTypes.number.isRequired,
    commenter: PropTypes.string,
    onCommentPosted: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      hideButtons: true,
    };

    this.canComment = this.canComment.bind(this);
    this.getPostButtonStyle = this.getPostButtonStyle.bind(this);
    this.getCancelButtonStyle = this.getCancelButtonStyle.bind(this);
    this.hideButtons = this.hideButtons.bind(this);
  }

  getPostButtonStyle() {
    return classnames([css.commentButton], {
      [css.hidden]: this.state.hideButtons,
    });
  }

  getCancelButtonStyle() {
    return classnames([css.cancelButton], {
      [css.hidden]: this.state.hideButtons,
    });
  }

  canComment() {
    return (this.props.commenter !== null);
  }

  showButtons() {
    if (this.canComment()) {
      this.setState({
        hideButtons: false,
      });
    }
  }

  hideButtons() {
    this.setState({
      hideButtons: true,
    });
  }

  onCancel() {
    this.hideButtons();
    this.$commentBox.val('');
  }

  postComment(event) {
    this.hideButtons();

    const text = this.$commentBox.val();
    const trimmed = text.trim();
    if (trimmed.length > 0) {
      const newCommentData = {
        text: trimmed,
        userReviewId: this.props.reviewId,
      };
      this.props.onCommentPosted(newCommentData);
    }
    this.$commentBox.val('');
  }

  renderBox() {
    const box = (
      <textarea
        className={css.commentBox}
        ref={(e) => this.$commentBox = $(e)}
        type='text'
        placeholder='Write a public comment...'
        onFocus={_.bind(this.showButtons, this)}
      />
    );
    if (!this.canComment()) {
      return (
        <Link to='/login'>
          {box}
        </Link>
      );
    }
    return box;
  }

  render() {
    const postButtonStyle = this.getPostButtonStyle();
    const cancelButtonStyle = this.getCancelButtonStyle();

    return (
      <div className={css.container}>
        {this.renderBox()}
        <button
          id='postButton'
          className={postButtonStyle}
          onClick={_.bind(this.postComment, this)}
        >
            Post
        </button>
        <button
          id='cancelButton'
          className={cancelButtonStyle}
          onClick={_.bind(this.onCancel, this)}
        >
            Cancel
        </button>

      </div>
    );
  }
}
