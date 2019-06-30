import PropTypes from 'prop-types';
import React from 'react';
import css from './UserSettings.scss';
import Paper from 'material-ui/Paper';
import UserSettingsFields from './UserSettingsFields';
import { USER_PROFILE_DATA_SHAPE } from '../../../constants/propTypesConstants';

export default class UserSettings extends React.Component {
  static propTypes = {
    userToken: PropTypes.string.isRequired,
    profileData: USER_PROFILE_DATA_SHAPE,
    updateProfile: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className={css.outerContainer}>
        <Paper zDepth={3} className={css.container}>
          <h2 className={css.header}>Update Your Profile</h2>
          <UserSettingsFields
            userToken={this.props.userToken}
            profileData={this.props.profileData}
            updateProfile={this.props.updateProfile}
          />
        </Paper>
      </div>
    );
  }
}
