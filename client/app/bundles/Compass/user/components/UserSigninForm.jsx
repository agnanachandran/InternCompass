import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import ContinueWithFacebook from '../../components/ContinueWithFacebook';
import Separator from '../../components/Separator';
import UserFormWidget from './UserFormWidget';
import css from './UserForm.scss';
import CenteredSpinner from '../../components/CenteredSpinner';
import Checkbox from 'material-ui/Checkbox';

export default class UserSigninForm extends React.Component {
  static propTypes = {
    clearSigninErrorMsg: PropTypes.func.isRequired,
    signin: PropTypes.func.isRequired,
    clearRedirect: PropTypes.func.isRequired,
    errorMsg: PropTypes.string,
    redirectParams: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      rememberMe: false,
      loading: false,
      errorMsg: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRememberMeChange = this.handleRememberMeChange.bind(this);
    this.handleFacebookSignin = this.handleFacebookSignin.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errorMsg) {
      this.setState({ loading: false, errorMsg: newProps.errorMsg });
      newProps.clearSigninErrorMsg();
    }
  }

  componentWillUnmount() {
    this.props.clearRedirect();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const { email, password, rememberMe } = this.state;
    this.props.signin(email, password, rememberMe);
  }

  handleFacebookSignin() {
    this.setState({ loading: true });
  }

  handleFieldChange(field, e) {
    this.setState({ [field]: e.target.value });
  }

  handleRememberMeChange(e) {
    this.setState({ rememberMe: !this.state.rememberMe });
  }

  renderErrorMessage() {
    if (this.state.errorMsg) {
      return (
        <div className={css.errorMsg}>
          {this.state.errorMsg}
        </div>
      );
    }
  }

  renderForm() {
    if (this.state.loading) {
      return (
        <div className={css.spinnerContainer}>
          <CenteredSpinner size={1} marginTop={'0px'} />
        </div>
      );
    }

    const { email, password, rememberMe } = this.state;

    return (
      <div className={css.formContainer}>
        <ContinueWithFacebook
          callback={this.handleFacebookSignin}
          redirectParams={this.props.redirectParams}
        />
        <Separator text='OR'/>
        {this.renderErrorMessage()}
        <form className={css.form} onSubmit={this.handleSubmit}>
          <div>
            <input
              className={css.input}
              onChange={this.handleFieldChange.bind(this, 'email')}
              value={email}
              placeholder='Email'
            />
          </div>
          <div>
            <input
              className={css.input}
              onChange={this.handleFieldChange.bind(this, 'password')}
              value={password}
              autoComplete='off'
              placeholder='Password'
              type='password'
            />
          </div>
          <div className={css.rememberMeAndForgotPasswordContainer}>
            <div className={css.rememberMeCheckboxContainer}>
              <Checkbox
                label='Remember me'
                onCheck={this.handleRememberMeChange}
                checked={rememberMe}
                className={css.rememberMeCheckbox}
              />
            </div>
            <Link to='/forgot_password'>
              Forgot password?
            </Link>
          </div>
          <div>
            <input
              className={css.btn}
              type='submit'
              name='commit'
              value='Login'
            />
          </div>
        </form>
          <div className={css.link}>
            <Link to={`/signup${this.props.redirectParams}`}>
              Don't have an account?
              {' '}
              Sign up.
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
