import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import css from './PasswordResetForm.scss';
import UserFormWidget from './UserFormWidget';

export default class PasswordResetForm extends React.Component {
  static propTypes = {
    resetPassword: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      email: '',
      showConfirmMessage: false,
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handleReset(e) {
    e.preventDefault();
    if (this.state.email) {
      this.props.resetPassword(this.state.email);
      this.setState({ showConfirmMessage: true });
    }
  }

  renderForm() {
    if (this.state.showConfirmMessage) {
      return (
        <div className={css.msgContainer}>
          <p className={css.msg}>
            {`An email has been sent to ${this.state.email} to reset your password.`}
          </p>
          <Link to='/login'>
          <button className={css.doneBtn}>
            Done
          </button>
          </Link>
        </div>
      );
    }

    return (
      <form className={css.form} onSubmit={this.handleReset}>
        <input
          onChange={this.handleEmailChange}
          value={this.state.email}
          className={css.input}
          placeholder='Email'
        />
        <div className={css.buttonContainers}>
          <Link to='/login'>
            <button className={css.cancelBtn} type='cancel'>
              Cancel
            </button>
          </Link>
          <input
            className={css.resetBtn}
            type='submit'
            value='Reset Password'
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
