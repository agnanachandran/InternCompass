import PropTypes from 'prop-types';
import React from 'react';
import css from './UserInfo.scss';
import { USER_PROFILE_DATA_SHAPE } from '../../constants/propTypesConstants';
import FontAwesomeIcon from '../../components/FontAwesomeIcon';
import _ from 'lodash';
import UserProfilePhoto from '../../components/UserProfilePhoto';
import UserHeadline from './UserHeadline';
import { formatWebsiteUrl } from '../../utils/formatUtils';
import { Link } from 'react-router';

export default class UserInfo extends React.Component {
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    isViewingCurrentUser: PropTypes.bool.isRequired,
    lastName: PropTypes.string.isRequired,
    profileData: USER_PROFILE_DATA_SHAPE,
  };

  renderHeadline() {
    if (this.props.profileData) {
      return (
        <UserHeadline
          className={css.headline}
          school={this.props.profileData.school}
          program={this.props.profileData.program}
        />
      );
    }
  }

  renderBio() {
    if (this.props.profileData) {
      return (
        <div className={css.bio}>
          {this.props.profileData.bio}
        </div>
      );
    }
  }

  renderIconLinks() {
    const links = [
      {
        key: 'github',
        href: `https://github.com/${this.props.profileData.github}`,
        icon: 'github',
      },
      {
        key: 'dribbble',
        href: `https://dribbble.com/${this.props.profileData.dribbble}`,
        icon: 'dribbble',
      },
      {
        key: 'linkedin',
        href: `https://linkedin.com/in/${this.props.profileData.linkedin}`,
        icon: 'linkedin',
      },
      {
        key: 'twitter',
        href: `https://twitter.com/${this.props.profileData.twitter}`,
        icon: 'twitter',
      },
      {
        key: 'blog',
        href: this.props.profileData.blog,
        icon: 'rss',
      },
    ];

    return _.map(links, (link) => {
      if (this.props.profileData[link.key]) {
        return (
          <a
            key={link.key}
            className={css.url}
            href={link.href}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FontAwesomeIcon icon={link.icon} />
          </a>
        );
      }
    });
  }

  renderPersonalWebsite() {
    if (this.props.profileData.personalWebsite) {
      return (
        <a
          className={css.url}
          href={this.props.profileData.personalWebsite}
          target='_blank'
          rel='noopener noreferrer'
        >
          {formatWebsiteUrl(this.props.profileData.personalWebsite)}
        </a>
      );
    }
  }

  renderBottomInfo() {
    if (this.props.profileData) {
      return (
        <span>
          {this.renderIconLinks()}
          {this.renderPersonalWebsite()}
        </span>
      );
    }
    return null;
  }

  renderUpdateLink() {
    if (!this.props.isViewingCurrentUser) {
      return null;
    }
    return (
      <Link to='/users/update-profile'>
        <FontAwesomeIcon className={css.updateIcon} icon='pencil-square-o' />
        <span className={css.updateLabel}>Update Profile</span>
      </Link>
    );
  }

  renderInfo() {
    const { firstName, lastName } = this.props;
    return (
      <div className={css.info}>
        <div>
          <span className={css.userName}>{`${firstName} ${lastName}`}</span>
          {this.renderUpdateLink()}
          {this.renderHeadline()}
          {this.renderBio()}
        </div>
        <div className={css.bottomInfo}>
          {this.renderBottomInfo()}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={css.container}>
        <UserProfilePhoto
          size='xLarge'
          shape='square'
          imageUrl={this.props.imgUrl}
        />
        {this.renderInfo()}
      </div>
    );
  }
}
