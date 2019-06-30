import PropTypes from 'prop-types';
import React from 'react';
import css from './CritiqueCommentsContainer.scss';
import CritiqueComment from './CritiqueComment';
import CritiqueCommentCreationContainer from './CritiqueCommentCreationContainer';
import _ from 'lodash';
import $ from 'jquery';

export default class CritiqueCommentsContainer extends React.Component {
  static propTypes = {
    critiqueToken: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      commentText: '',
      currentlyEditingCommentId: null,
    };
    this.handlePostComment = this.handlePostComment.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
    this.handleEditComment = this.handleEditComment.bind(this);
    this.handleCancelEditComment = this.handleCancelEditComment.bind(this);
  }

  componentDidMount() {
    this.$commentsContainerElement = $(this._commentsContainerElement);
  }

  handlePostComment() {
    this.setState({
      commentText: '',
      currentlyEditingCommentId: null,
    });
    this.$commentsContainerElement.animate({ scrollTop: this.$commentsContainerElement[0].scrollHeight }, 1000);
  }

  handleChangeComment(commentText) {
    this.setState({
      commentText,
    });
  }

  handleEditComment(commentId, commentText) {
    this.setState({
      commentText,
      currentlyEditingCommentId: commentId,
    });
  }

  handleCancelEditComment(commentId) {
    this.setState({
      commentText: '',
      currentlyEditingCommentId: null,
    });
  }

  renderComments() {
    if (_.isEmpty(this.props.comments)) {
      return (
        <div className={css.commentsPlaceholder}>
          Be the first to comment on this resume!
        </div>
      );
    }
    const commentsSortedByTime = _.sortBy(this.props.comments, 'createdAt');
    return _.map(commentsSortedByTime, (comment) => {
      return (
        <CritiqueComment
          key={comment.id}
          isEditing={comment.id === this.state.currentlyEditingCommentId}
          onEdit={this.handleEditComment}
          name={comment.user.name}
          school={comment.user.school}
          program={comment.user.program}
          userToken={comment.user.token}
          imgUrl={comment.user.imgUrl}
          id={comment.id}
          text={comment.text}
          createdAt={comment.createdAt}
          updatedAt={comment.updatedAt}
          dispatch={this.props.dispatch}
        />
      );
    });
  }

  renderCommentCreationContainer() {
    return (
      <CritiqueCommentCreationContainer
        dispatch={this.props.dispatch}
        editingCommentId={this.state.currentlyEditingCommentId}
        critiqueToken={this.props.critiqueToken}
        isEditing={this.state.currentlyEditingCommentId !== null}
        commentText={this.state.commentText}
        onChangeComment={this.handleChangeComment}
        onCancelEditComment={this.handleCancelEditComment}
        onPostComment={this.handlePostComment}
      />
    );
  }

  render() {
    return (
      <div className={css.container}>
        <div className={css.header}>
          Comments ({this.props.comments.length})
        </div>
        <div ref={(e) => { this._commentsContainerElement = e; }} className={css.commentsContainer}>
          {this.renderComments()}
        </div>
        {this.renderCommentCreationContainer()}
      </div>
    );
  }
}
