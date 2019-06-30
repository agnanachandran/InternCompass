import PropTypes from 'prop-types';
import React, { Component } from 'react';
import css from './CritiqueItem.scss';
import { Link } from 'react-router';
import { formatDateWithTime } from '../../utils/formatUtils';
import UserHeadline from '../../user/components/UserHeadline';
import UserProfilePhoto from '../../components/UserProfilePhoto';
import pluralize from 'pluralize';
import _ from 'lodash';

const MAX_DESCRIPTION_LENGTH = 140;

export default class CritiqueItem extends Component {
  static propTypes = {
    critique: PropTypes.object.isRequired,
    critiqueCreator: PropTypes.object.isRequired,
  };

  renderHeadline() {
    if (this.props.critiqueCreator.school || this.props.critiqueCreator.program) {
      return (
        <span>
          <UserHeadline
            className={css.headline}
            school={this.props.critiqueCreator.school}
            program={this.props.critiqueCreator.program}
          />
        </span>
      );
    }
  }

  renderDate() {
    return (
      <div className={css.date}>
        {formatDateWithTime(this.props.critique.updatedAt)}
      </div>
    );
  }

  renderTruncatedDescription() {
    return _.truncate(this.props.critique.description, {
      length: MAX_DESCRIPTION_LENGTH,
      separator: ' ',
      omission: '…'
    });
  }

  renderDescriptionAndMetadata() {
    return (
      <div className={css.innerContainer}>
        <div className={css.description}>
          {this.renderTruncatedDescription()}
        </div>
        <div className={css.commentCountContainer}>
          {this.props.critique.commentCount}&nbsp;{pluralize('comment', this.props.critique.commentCount)}
        </div>
      </div>
    );
  }

  renderInfo() {
    return (
      <div className={css.info}>
        <span className={css.userName}>
          {this.props.critiqueCreator.name}
        </span>
        {this.renderHeadline()}
        {this.renderDate()}
        {this.renderDescriptionAndMetadata()}
      </div>
    );
  }

  render() {
    return (
      <div className={css.container}>
        <Link className={css.critiqueLink} to={`/critiques/${this.props.critique.token}`}>
          <div className={css.userAndCritiqueInfoContainer}>
            <UserProfilePhoto
              size='medium'
              shape='circle'
              imageUrl={this.props.critiqueCreator.imgUrl}
            />
            {this.renderInfo()}
          </div>
        </Link>
      </div>
    );
  }
}

