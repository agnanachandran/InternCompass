import PropTypes from 'prop-types';
import React from 'react';
import css from './CritiqueCommentCreationContainer.scss';
import classnames from 'classnames';
import FlatButton from 'material-ui/FlatButton';
import LoadingContent from '../../components/LoadingContent';
import * as critiqueActions from '../actions/critiqueActions';
import { colours } from '../../constants/compassConstants';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

class CritiqueCommentCreationContainer extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
    isPostingComment: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    editingCommentId: PropTypes.number,
    critiqueToken: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired,
    commentText: PropTypes.string.isRequired,
    onChangeComment: PropTypes.func.isRequired,
    onCancelEditComment: PropTypes.func.isRequired,
    onPostComment: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.actions = bindActionCreators(critiqueActions, props.dispatch);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isPostingComment) {
      this.props.onPostComment();
    }
    if (this.props.isEditing) {
      // Hack to make focus work (may be because of the change in text upon editing)
      setTimeout(() => this.commentBoxElement.focus(), 1);
    }
  }

  handleCommentChange(event) {
    this.props.onChangeComment(event.target.value);
  }

  handleSubmit() {
    if (this.props.isEditing) {
      this.actions.submitCommentEdit(this.props.commentText, this.props.editingCommentId);
    } else {
      this.actions.submitComment(this.props.commentText, this.props.critiqueToken);
    }
  }

  renderCommentBox() {
    if (this.props.currentUser === null) {
      return (
        <div className={css.signInPrompt}>
          You must be <Link to='/login' className={css.signInLink}> signed in </Link> to
          post a comment.
        </div>
      );
    }
    return (
      <div>
        <textarea
          placeholder='Write a comment...'
          className={css.commentBox}
          onChange={this.handleCommentChange}
          value={this.props.commentText}
          ref={(e) => this.commentBoxElement = e}
        />
        <div
          className={css.buttonContainer}
        >
          <FlatButton
            backgroundColor={colours.MATERIAL_BLUE_GREY}
            hoverColor={colours.MATERIAL_BLUE_GREY_DARK}
            className={classnames({
              [css.invisible]: !this.props.isEditing,
            }, css.button)}
            onClick={this.props.onCancelEditComment}
            disabled={this.props.isPostingComment}
          >
            <span className={css.button}>Cancel</span>
          </FlatButton>

          <FlatButton
            backgroundColor={colours.MATERIAL_BLUE}
            hoverColor={colours.MATERIAL_BLUE_DARK}
            className={css.button}
            onClick={this.handleSubmit}
            disabled={this.props.isPostingComment}
          >
            <LoadingContent loading={this.props.isPostingComment}>
              <span className={css.button}>Submit</span>
            </LoadingContent>
          </FlatButton>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={css.container}>
        {this.renderCommentBox()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.compassStore.currentUser,
    isPostingComment: state.critique.isPostingComment,
  };
}

export default connect(mapStateToProps)(CritiqueCommentCreationContainer);
