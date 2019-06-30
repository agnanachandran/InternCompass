import PropTypes from 'prop-types';
import React from 'react';
import { bindActionCreators } from 'redux';
import * as reviewActions from '../actions/reviewActions';
import ReviewWidget from '../components/ReviewWidget';
import ReviewCommentWidget from '../components/ReviewCommentWidget';
import { connect } from 'react-redux';
import _ from 'lodash';

class ReviewContainer extends React.Component {
  static propTypes = {
    comments: PropTypes.object,
    currentUser: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    review: PropTypes.object,
    token: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.renderComments = this.renderComments.bind(this);
    this.actions = bindActionCreators(reviewActions, this.props.dispatch);
  }

  componentDidMount() {
    const { review, token } = this.props;
    if (!review) {
      this.actions.fetchReview(token);
    }
  }

  renderComments(comments) {
    return _.map(comments, comment =>
      <ReviewCommentWidget key={comment.id} {...comment } />
    );
  }

  render() {
    const { review, currentUser } = this.props;

    let currentUserId = null;
    if (currentUser !== null) {
      currentUserId = currentUser.id;
    }
    return this.props.review && (
      <div>
        <ReviewWidget
          currentUserId={currentUserId}
          onVoteCast={this.actions.setReviewVote}
          {...review }
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const token = ownProps.params.token;
  let review = state.review.review;
  if (!review || review.token !== token) {
    review = null;
  }
  return {
    review,
    token,
    comments: state.review.comments,
    currentUser: state.compassStore.currentUser,
  };
}

export default connect(mapStateToProps)(ReviewContainer);
