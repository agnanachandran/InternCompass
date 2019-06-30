import PropTypes from 'prop-types';
import React, { Component } from 'react';
import UserFormBackground from '../components/UserFormBackground';
import UserSigninForm from '../components/UserSigninForm';
import { connect } from 'react-redux';
import * as userActions from '../actions/userActions';
import * as redirectActions from '../../actions/redirectActions';
import { bindActionCreators } from 'redux';

class UserSigninContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    signin: PropTypes.object.isRequired,
    redirectParams: PropTypes.string,
    redirect: PropTypes.string,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.actions = bindActionCreators({ ...redirectActions, ...userActions }, props.dispatch);
    this.handleSignin = this.handleSignin.bind(this);
  }

  handleSignin(email, password, rememberMe) {
    this.actions.signin(
      this.props.redirect,
      email,
      password,
      rememberMe,
      this.context.router,
    );
  }

  render() {
    const { errorMsg } = this.props.signin;
    return (
      <UserFormBackground>
        <UserSigninForm
          clearSigninErrorMsg={this.actions.clearSigninErrorMsg}
          signin={this.handleSignin}
          clearRedirect={this.actions.clearRedirect}
          errorMsg={errorMsg}
          redirectParams={this.props.redirectParams}
        />
      </UserFormBackground>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const redirectParams = ownProps.location.search;
  return {
    signin: state.user.signin,
    redirectParams,
    redirect: state.compassStore.redirect,
  };
}

export default connect(mapStateToProps)(UserSigninContainer);
