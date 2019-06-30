import PropTypes from 'prop-types';
import React from 'react';
import css from './ReviewWidget.scss';
import VoteWidget from './VoteWidget';
import StarsWidget from '../../components/StarsWidget';
import CompanyLogo from '../../components/CompanyLogo';
import { formatDate } from '../../utils/formatUtils';
import Card from 'material-ui/Card';
import { Link } from 'react-router';

class ReviewWidget extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    anonymous: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
    companyLogoUrl: PropTypes.string,
    companySlug: PropTypes.string.isRequired,
    jobTitle: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    isForCurrentUser: PropTypes.bool.isRequired,
    overallRating: PropTypes.number.isRequired,
    mentorshipRating: PropTypes.number.isRequired,
    workLifeBalanceRating: PropTypes.number.isRequired,
    meaningfulWorkRating: PropTypes.number.isRequired,
    upvote: PropTypes.number.isRequired,
    downvote: PropTypes.number.isRequired,
    currentUserId: PropTypes.number,
    onVoteCast: PropTypes.func.isRequired,
    userVote: PropTypes.bool,
  };

  renderReviewHeaders() {
    const { companyName, jobTitle, location } = this.props;

    return (
      <div className={css.infoHeaders}>
        <div className={css.headerContainer}>
          <h2 className={css.header}>{jobTitle}</h2>
          <Link to={`/companies/${this.props.companySlug}`}>
            <h3>{companyName}</h3>
          </Link>
          <div>{location}</div>
        </div>
        <div className={css.date}>
          <div>{formatDate(this.props.createdAt)}</div>
        </div>
        <div className={css.clear} />
      </div>
    );
  }

  renderRating(label, rating) {
    return (
      <div className={css.starContainer}>
        <span className={css.starLabel}>{label}</span>
        <span className={css.starWidget}>
          <StarsWidget rating={rating} size='small' />
        </span>
      </div>
    );
  }

  renderReviewInfo() {
    const {
      description,
      overallRating,
      mentorshipRating,
      workLifeBalanceRating,
      meaningfulWorkRating,
    } = this.props;

    return (
      <div>
        <div className={css.description}>{description}</div>
        {this.renderRating('Overall: ', overallRating)}
        {this.renderRating('Mentorship: ', mentorshipRating)}
        {this.renderRating('Work/Life Balance: ', workLifeBalanceRating)}
        {this.renderRating('Meaningful Work: ', meaningfulWorkRating)}
      </div>
    );
  }

  renderVoteWidget() {
    const { currentUserId, upvote, downvote, id, onVoteCast, userVote, isForCurrentUser } = this.props;
    return (
      <div className={css.votes}>
        <VoteWidget
          disabled={currentUserId === null || isForCurrentUser}
          currentUserId={currentUserId}
          upvote={upvote}
          downvote={downvote}
          parentId={id}
          parentType='userReview'
          onVoteCast={onVoteCast}
          userVote={userVote}
        />
      </div>
    );
  }

  render() {
    return (
      <Card className={css.container}>
        <div className={css.imgCol}>
          <div>
            <CompanyLogo
              companySlug={this.props.companySlug}
              companyName={this.props.companyName}
              logoUrl={this.props.companyLogoUrl}
              size='large'
            />
          </div>
        </div>
        <div className={css.contentCol}>
          {this.renderReviewHeaders()}
          {this.renderReviewInfo()}
          {this.renderVoteWidget()}
        </div>
      </Card>
    );
  }
}

export default ReviewWidget;
