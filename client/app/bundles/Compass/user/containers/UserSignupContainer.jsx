import PropTypes from 'prop-types';
import React from 'react';
import UserFormBackground from '../components/UserFormBackground';
import UserSignupForm from '../components/UserSignupForm';
import { connect } from 'react-redux';
import * as userActions from '../actions/userActions';
import { bindActionCreators } from 'redux';

class UserSignupContainer extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    signup: PropTypes.object.isRequired,
    redirectParams: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.actions = bindActionCreators(userActions, props.dispatch);
  }

  render() {
    const { confirmationSent, errors } = this.props.signup;
    return (
      <UserFormBackground>
        <UserSignupForm
          redirectParams={this.props.redirectParams}
          signup={this.actions.signup}
          confirmationSent={confirmationSent}
          errors={errors}
          clearConfirmation={this.actions.clearConfirmation}
        />
      </UserFormBackground>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const redirectParams = ownProps.location.search;
  return { signup: state.user.signup, redirectParams };
}

export default connect(mapStateToProps)(UserSignupContainer);
