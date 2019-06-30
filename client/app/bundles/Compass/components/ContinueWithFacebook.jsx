import PropTypes from 'prop-types';
import React from 'react';
import LoginButton from './LoginButton';

export default class ContinueWithFacebook extends React.Component {
  static propTypes = {
    callback: PropTypes.func,
    redirectParams: PropTypes.string,
  }

  render() {
    const link = `/users/auth/facebook${this.props.redirectParams}`;
    return (
      <a href={link}>
        <LoginButton
          icon='fa-facebook-official'
          label='Continue with Facebook'
          callback={this.props.callback}
        />
      </a>
    );
  }
}
