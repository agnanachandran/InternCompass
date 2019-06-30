import PropTypes from 'prop-types';
import React from 'react';
import css from './UserDropdownMenu.scss';
import FontAwesomeIcon from '../../../components/FontAwesomeIcon';
import DropdownMenu from '../../../components/DropdownMenu';
import UserProfilePhoto from '../../../components/UserProfilePhoto';

export default class UserDropdownMenu extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    signout: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  renderProfilePic() {
    if (this.props.currentUser.imageUrl) {
      return (
        <UserProfilePhoto
          className={css.userPic}
          imageUrl={this.props.currentUser.imageUrl}
          size='xSmall'
          shape='square'
        />
      );
    }
  }

  renderButton() {
    return (
      <div className={css.btn}>
        {this.renderProfilePic()}
        <span className={css.firstName}>{this.props.currentUser.firstName}</span>
        <FontAwesomeIcon className={css.indicator} icon='caret-down'/>
      </div>
    );
  }

  renderMenuItems() {
    return [
      {
        primaryText: 'Profile',
        link: `/users/${this.props.currentUser.token}`,
      },
      {
        primaryText: 'Signout',
        onClick: this.props.signout,
      },
    ];
  }

  render() {
    return (
      <DropdownMenu button={this.renderButton()} menuItems={this.renderMenuItems()}/>
    );
  }
}
