import PropTypes from 'prop-types';
import React from 'react';
import ChangePasswordForm from '../components/ChangePasswordForm';
import UserFormBackground from '../components/UserFormBackground';
import * as userActions from '../actions/userActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ChangePasswordContainer extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    token: PropTypes.string.isRequired,
    error: PropTypes.bool,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.actions = bindActionCreators(userActions, props.dispatch);
    this.handleUpdatePassword = this.handleUpdatePassword.bind(this);
  }

  handleUpdatePassword(password) {
    this.actions.updatePassword(password, this.props.token, this.context.router);
  }

  render() {
    return (
      <UserFormBackground>
        <ChangePasswordForm
          error={this.props.error}
          updatePassword={this.handleUpdatePassword}
        />
      </UserFormBackground>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const token = ownProps.location.query.reset_password_token;
  const error = state.user.changePassword.error;
  return { token, error };
}

export default connect(mapStateToProps)(ChangePasswordContainer);
