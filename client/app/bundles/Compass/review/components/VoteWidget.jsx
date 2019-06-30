import PropTypes from 'prop-types';
import React from 'react';
import css from './VoteWidget.scss';
import { post } from '../../utils/ajaxCamelCase';
import classnames from 'classnames';

const UPVOTE = true;
const DOWNVOTE = false;

class VoteWidget extends React.Component {
  static propTypes = {
    disabled: PropTypes.bool.isRequired,
    downvote: PropTypes.number.isRequired,
    onVoteCast: PropTypes.func.isRequired,
    parentId: PropTypes.number.isRequired,
    parentType: PropTypes.string.isRequired,
    upvote: PropTypes.number.isRequired,
    currentUserId: PropTypes.number,
    userVote: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.handleVoteSuccess = this.handleVoteSuccess.bind(this);
    this.handleVoteRemovedSuccess = this.handleVoteRemovedSuccess.bind(this);
    this.handleVoteDownClick = this.handleVoteDownClick.bind(this);
    this.handleVoteUpClick = this.handleVoteUpClick.bind(this);
  }

  canVote() {
    return !this.props.disabled;
  }

  canVoteUp() {
    return (this.canVote() && (this.props.userVote === null || this.props.userVote === DOWNVOTE));
  }

  canVoteDown() {
    return (this.canVote() && (this.props.userVote === null || this.props.userVote === UPVOTE));
  }

  handleVoteSuccess(voteData) {
    voteData.reCast = (this.props.userVote) !== null;
    this.props.onVoteCast(voteData);
  }

  handleVoteRemovedSuccess(voteData) {
    voteData.removed = true;
    this.props.onVoteCast(voteData);
  }

  castVote(vote) {
    const voteData = {
      userReviewId: this.props.parentId,
      vote: vote,
    };

    post('/user_to_review_votes', voteData, this.handleVoteSuccess);
  }

  unVote() {
    const voteData = {
      userReviewId: this.props.parentId
    };
    post('/user_to_review_votes/delete', voteData, this.handleVoteRemovedSuccess);
  }

  handleVoteUpClick() {
    if (this.canVoteUp()) {
      this.castVote(UPVOTE);
    } else if (this.props.userVote === true) {
      this.unVote();
    }
  }

  handleVoteDownClick() {
    if (this.canVoteDown()) {
      this.castVote(DOWNVOTE);
    } else if (this.props.userVote === false) {
      this.unVote();
    }
  }

  getVoterStyle(type) {
    if (type === 'UP') {
      return classnames(css.upvote, {
        [css.disabled]: this.props.disabled,
        [css.clickable]: !this.props.disabled,
        [css.selectedUpvote]: this.props.userVote === true,
      });
    } else if (type === 'DOWN') {
      return classnames(css.downvote, {
        [css.disabled]: this.props.disabled,
        [css.clickable]: !this.props.disabled,
        [css.selectedDownvote]: this.props.userVote === false,
      });
    }
  }

  render() {
    const { upvote, downvote } = this.props;

    const upvoterStyle = this.getVoterStyle('UP');
    const downvoterStyle = this.getVoterStyle('DOWN');

    return (
      <div className={css.container}>
        <span className={css.description}>
          Was this review helpful?&nbsp;
        </span>
        <div className={css.voteContainer}>
          <span className={upvoterStyle} onClick={this.handleVoteUpClick}>
            Yes ({upvote})
          </span>
          <span className={downvoterStyle} onClick={this.handleVoteDownClick}>
            No ({downvote})
          </span>
        </div>
      </div>
    );
  }
}

export default VoteWidget;
