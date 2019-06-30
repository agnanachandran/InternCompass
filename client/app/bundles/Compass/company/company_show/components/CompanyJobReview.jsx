import PropTypes from 'prop-types';
import React from 'react';
import Card from 'material-ui/Card';
import _ from 'lodash';
import StarsWidget from '../../../components/StarsWidget';
import css from './CompanyJobReview.scss';
import { formatDate } from '../../../utils/formatUtils';
import { Link } from 'react-router';
import VoteWidget from '../../../review/components/VoteWidget';
import UserProfilePhoto from '../../../components/UserProfilePhoto';

const MAX_DESCRIPTION_LENGTH = 750;
const TRUNCATED_DESCRIPTION_OMISSION = '… ';


export default class CompanyJobReview extends React.Component {
  static propTypes = {
    review: PropTypes.object.isRequired,
    currentUserId: PropTypes.number,
    onVoteCast: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      shouldShowFullDescription: false,
    };
    this.handleShowMoreClick = this.handleShowMoreClick.bind(this);
  }

  componentDidMount() {
    // Dates should be shown according to client's timezone, not server's,
    // so we only format the time on the client
    this.reviewDateElement.appendChild(document.createTextNode(formatDate(this.props.review.createdAt)));
  }

  handleShowMoreClick() {
    this.setState({
      shouldShowFullDescription: true,
    });
  }

  renderUserProfilePhoto() {
    const userProfilePhotoElement = (
      <UserProfilePhoto
        className={css.userProfilePhoto}
        size='medium'
        shape='circle'
        imageUrl={this.props.review.userProfilePhoto}
      />
    );
    if (this.props.review.userToken) {
      return (
        <Link to={`/users/${this.props.review.userToken}`}>
          {userProfilePhotoElement}
        </Link>
      );
    }
    return userProfilePhotoElement;
  }

  renderUserName() {
    if (this.props.review.anonymous) {
      if (this.props.review.isForCurrentUser) {
        return (
          <span>You (anonymous)</span>
        );
      }
      return (
        <span>Anonymous</span>
      );
    }

    let userName = this.props.review.name;
    if (this.props.review.isForCurrentUser) {
      userName = 'You';
    }
    return (
      <Link to={`/users/${this.props.review.userToken}`}>
        {userName}
      </Link>
    );
  }

  renderReviewHeader() {
    return (
      <div className={css.reviewHeaderContainer}>
        <div className={css.userInfoContainer}>
          {this.renderUserProfilePhoto()}
          <div className={css.userInfo}>
            <div className={css.userName}>
              {this.renderUserName()}
            </div>
            <div className={css.reviewDate}>
              <Link to={`/user_reviews/${this.props.review.token}`}>
                <span ref={(e) => this.reviewDateElement = e}>
                </span>
              </Link>
            </div>
          </div>
        </div>
        {this.renderRatings()}
      </div>
    );
  }

  renderDescription() {
    const truncatedDescription = _.truncate(this.props.review.description, {
      length: MAX_DESCRIPTION_LENGTH,
      separator: ' ',
      omission: TRUNCATED_DESCRIPTION_OMISSION,
    });

    if (!this.state.shouldShowFullDescription &&
      truncatedDescription.endsWith(TRUNCATED_DESCRIPTION_OMISSION)) { // If it actually was truncated
      return (
        <div>
          {truncatedDescription}
          <span onClick={this.handleShowMoreClick} className={css.showMore}>Show&nbsp;More</span>
        </div>
      );
    }

    return this.props.review.description;
  }

  renderVoter() {
    const { onVoteCast, currentUserId, review } = this.props;

    return (
      <div className={css.voterContainer}>
        <VoteWidget
          disabled={currentUserId === null || review.isForCurrentUser}
          currentUserId={currentUserId}
          upvote={review.upvote}
          downvote={review.downvote}
          parentId={review.id}
          parentType='userReview'
          onVoteCast={onVoteCast}
          userVote={review.userVote}
        />
      </div>
    );
  }

  renderReviewInfo() {
    return (
      <div className={css.reviewInfoContainer}>
        <div className={css.reviewText}>
          {this.renderDescription()}
        </div>
        {this.renderVoter()}
      </div>
    );
  }

  renderRating(ratingName, ratingValue) {
    return (
      <div className={css.ratingOuterContainer}>
        <div className={css.ratingName}>
          {ratingName}
        </div>
        <div className={css.ratingValueContainer}>
          <StarsWidget rating={ratingValue} size='small' />
        </div>
      </div>
    );
  }

  renderRatings() {
    const {
      mentorshipRating,
      workLifeBalanceRating,
      meaningfulWorkRating,
      overallRating
    } = this.props.review;

    return (
      <div className={css.ratingsContainer}>
        {this.renderRating('Mentorship', mentorshipRating)}
        {this.renderRating('Work/life Balance', workLifeBalanceRating)}
        {this.renderRating('Meaningful Work', meaningfulWorkRating)}
        {this.renderRating('Overall', overallRating)}
      </div>
    );
  }

  render() {
    return (
      <Card>
        <div className={css.container}>
          {this.renderReviewHeader()}
          {this.renderReviewInfo()}
        </div>
      </Card>
    );
  }
}
