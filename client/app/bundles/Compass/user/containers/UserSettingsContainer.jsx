import PropTypes from 'prop-types';
import React from 'react';
import UserSettings from '../components/user_settings/UserSettings';
import { connect } from 'react-redux';
import * as userActions from '../actions/userActions';
import { bindActionCreators } from 'redux';

class UserSettingsContainer extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.actions = bindActionCreators({ ...userActions }, props.dispatch);
  }

  render() {
    return (
      <UserSettings
        userToken={this.props.user.token}
        profileData={this.props.user.profileData}
        updateProfile={this.actions.updateProfile}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return { user: state.user.user };
}

export default connect(mapStateToProps)(UserSettingsContainer);
