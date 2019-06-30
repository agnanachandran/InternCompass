import PropTypes from 'prop-types';
import React from 'react';
import UserFormWidget from './UserFormWidget';
import { Link } from 'react-router';
import ContinueWithFacebook from '../../components/ContinueWithFacebook';
import Separator from '../../components/Separator';
import CircularProgress from 'material-ui/CircularProgress';
import css from './UserForm.scss';
import Error from './Error';
import _ from 'lodash';

export default class UserSignupForm extends React.Component {
  static propTypes = {
    signup: PropTypes.func.isRequired,
    confirmationSent: PropTypes.bool.isRequired,
    errors: PropTypes.object,
    clearConfirmation: PropTypes.func.isRequired,
    redirectParams: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      loading: false,
      showConfirmationMsg: false,
      nameError: false,
      emailError: false,
      passwordError: false,
      emailErrorMsg: 'An email must be entered',
    };
    this.fieldToError = {
      firstName: 'nameError',
      lastName: 'nameError',
      password: 'passwordError',
      email: 'emailError',
    };
    this.handleFacebookSignup = this.handleFacebookSignup.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const errors = newProps.errors;

    if (errors && errors['email']) {
      this.setState({
        emailError: true,
        emailErrorMsg: `This email ${errors['email'][0]}`,
        loading: false,
      });
    } else if (newProps.confirmationSent) {
      this.setState({ loading: false, showConfirmationMsg: true });
      newProps.clearConfirmation();
    }
  }

  handleFacebookSignup() {
    this.setState({ loading: true });
  }

  handleFieldChange(field, e) {
    this.setState({ [field]: e.target.value });
    this.setState({ [this.fieldToError[field]]: false });
  }

  validate() {
    const { firstName, lastName, email, password } = this.state;
    const errors = {
      nameError: _.isEmpty(firstName.trim()) || _.isEmpty(lastName.trim()),
      emailError: _.isEmpty(email.trim()),
      passwordError: password.length < 6,
    };
    this.setState(errors);
    return !_.some(errors);
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.validate()) {
      return;
    }

    this.setState({ loading: true });
    const { firstName, lastName, email, password } = this.state;
    this.props.signup(firstName, lastName, email, password);
  }

  renderSignupByEmail() {
    const { firstName, lastName, email, password } = this.state;
    return (
      <form className={css.form} onSubmit={this.handleSubmit}>
        <div className={css.validatedInput}>
          <div className={css.nameContainers}>
            <input
              className={css.smallInput}
              onChange={this.handleFieldChange.bind(this, 'firstName')}
              value={firstName}
              placeholder='First Name'
            />
            <input
              className={css.smallInput}
              onChange={this.handleFieldChange.bind(this, 'lastName')}
              value={lastName}
              placeholder='Last Name'
            />
          </div>
          <Error
            error={this.state.nameError}
            message='First and last names cannot be empty'
          />
        </div>
        <div className={css.validatedInput}>
          <input
            className={css.input}
            onChange={this.handleFieldChange.bind(this, 'email')}
            value={email}
            placeholder='Email'
          />
          <Error
            error={this.state.emailError}
            message={this.state.emailErrorMsg}
          />
        </div>
        <div className={css.validatedInput}>
          <input
            className={css.input}
            autoComplete='off'
            value={password}
            onChange={this.handleFieldChange.bind(this, 'password')}
            placeholder='Password'
            type='password'
          />
          <Error
            error={this.state.passwordError}
            message='The password must be at least 6 characters long'
          />
        </div>
        <div>
          <input
            className={css.btn}
            type='submit'
            value='Sign up'
          />
        </div>
      </form>
    );
  }

  renderForm() {
    if (this.state.loading) {
      return (
        <div className={css.spinnerContainer}>
          <CircularProgress />
        </div>
      );
    }

    if (this.state.showConfirmationMsg) {
      return (
        <div className={css.spinnerContainer}>
          <span>Success! Please check your email to confirm your account.</span>
        </div>
      );
    }

    return (
      <div className={css.formContainer}>
        <ContinueWithFacebook
          redirectParams={this.props.redirectParams}
          callback={this.handleFacebookSignup}
        />
        <Separator text='OR'/>
        {this.renderSignupByEmail()}
        <span className={css.termsMsg}>
          By signing up you agree to our
          {' '}
          <Link to='/terms-of-use' className={css.termsLink}>Terms of Use</Link>
          {' and '}
          <Link to='/terms-of-use' className={css.termsLink}>Privacy Policy</Link>
          {'.'}
        </span>
        <div className={css.link}>
          <Link to={`/login${this.props.redirectParams}`}>
            Already have an account?
            {' '}
            Sign in.
          </Link>
        </div>
      </div>
    );
  }

  render() {
    return (
      <UserFormWidget form={this.renderForm()}/>
    );
  }
}
