import PropTypes from 'prop-types';
import React from 'react';
import css from './ChangePasswordForm.scss';
import UserFormWidget from './UserFormWidget';
import Error from './Error';
import _ from 'lodash';

export default class ChangePasswordForm extends React.Component {
  static propTypes = {
    updatePassword: PropTypes.func.isRequired,
    error: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      password: '',
      confirmPassword: '',
      passwordError: false,
      confirmPasswordError: false,
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validate() {
    const { password, confirmPassword } = this.state;
    const errors = {
      passwordError: password.length < 6,
      confirmPasswordError: password !== confirmPassword,
    };
    this.setState(errors);
    return !_.some(errors);
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value, passwordError: false });
  }

  handleConfirmPasswordChange(e) {
    this.setState({ confirmPassword: e.target.value, confirmPasswordError: false });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.validate()) {
      this.props.updatePassword(this.state.password);
    }
  }

  renderForm() {
    if (this.props.error) {
      return (
        <div className={css.errorContainer}>
          <p>There was an issue with resetting your password. Please try again.</p>
        </div>
      );
    }
    const { password, confirmPassword, passwordError, confirmPasswordError } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className={css.container}>
          <div>
            <Error
              error={passwordError}
              message='Password must be at least 6 characters long'
            />
            <input
              onChange={this.handlePasswordChange}
              value={password}
              className={css.input}
              autoComplete='off'
              placeholder='Password'
              type='password'
            />
          </div>
          <div>
            <Error
              error={confirmPasswordError}
              message='Passwords do not match'
            />
            <input
              onChange={this.handleConfirmPasswordChange}
              value={confirmPassword}
              className={css.input}
              autoComplete='off'
              placeholder='Confirm Password'
              type='password'
            />
          </div>
          <input
            className={css.confirmBtn}
            type='submit'
            value='Set new password'
          />
        </div>
      </form>
    );
  }

  render() {
    return (
      <UserFormWidget form={this.renderForm()}/>
    );
  }
}
