import PropTypes from 'prop-types';
import React from 'react';
import PasswordResetForm from '../components/PasswordResetForm';
import UserFormBackground from '../components/UserFormBackground';
import * as userActions from '../actions/userActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class PasswordResetContainer extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.actions = bindActionCreators(userActions, props.dispatch);
  }

  render() {
    return (
      <UserFormBackground>
        <PasswordResetForm
          resetPassword={this.actions.resetPassword}
        />
      </UserFormBackground>
    );
  }
}

export default connect()(PasswordResetContainer);
