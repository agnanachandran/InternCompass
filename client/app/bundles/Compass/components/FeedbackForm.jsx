import PropTypes from 'prop-types';
import React from 'react';
import * as feedbackActions from '../actions/feedbackActions';
import { bindActionCreators } from 'redux';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import css from './FeedbackForm.scss';
import _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';
import FontAwesomeIcon from './FontAwesomeIcon';
import * as globalActions from '../outer/actions/globalActions';

export default class FeedbackForm extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const currentUser = props.currentUser;
    this.state = {
      name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : '',
      email: currentUser ? currentUser.email : '',
      comment: '',
      loading: false,
      error: false,
      commentError: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);

    this.actions = bindActionCreators({ ...feedbackActions, ...globalActions }, props.dispatch);
  }

  handleSubmit() {
    if (_.isEmpty(this.state.comment)) {
      this.setState({ commentError: true });
      return;
    }
    this.setState({ loading: true });
    const { name, email, comment } = this.state;
    this.actions.submitFeedback({
      name,
      email,
      comment,
    }).always(() => {
      this.setState({ loading: false });
    }).done(() => {
      this.props.dispatch(this.actions.setSnackbarMessage('Thanks for submitting your feedback!'));
      this.props.onClose();
    }).fail(() => {
      this.setState({ error: true });
    });
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handleCommentChange(e) {
    this.setState({ comment: e.target.value, commentError: false });
  }

  render() {
    const { name, email, comment, loading } = this.state;
    const { onClose } = this.props;
    if (loading) {
      return (
        <div className={css.centerContainer}>
          <CircularProgress />
        </div>
      );
    }

    const style = this.state.commentError ? css.visible : css.gone;
    return (
      <div className={css.formContainer}>
        <span onClick={onClose}>
          <FontAwesomeIcon className={css.close} icon='times'/>
        </span>
        <div className={css.container}>
          <p className={css.title}>Share your feedback!</p>
          <p className={css.description}>We're always looking for ways to make InternCompass better. Let us know what you think.</p>
          <div className={css.outerContainer}>
            <div>
              <div className={css.label}>Name (optional)</div>
              <input className={css.field} onChange={this.handleNameChange} value={name}/>
            </div>
            <div>
              <div className={css.label}>Email (optional)</div>
              <input className={css.field} onChange={this.handleEmailChange} value={email}/>
            </div>
          </div>
          <div>
            <div className={css.label}>
              <span>Comments</span>
              <FontAwesomeIcon
                icon='exclamation-triangle'
                className={style}
                tooltipOptions={{ text: 'Comments cannot be empty', place: 'right' }}
              />
            </div>
            <textarea className={css.textarea} onChange={this.handleCommentChange} value={comment}/>
          </div>
          <br/>
          <div className={css.buttonsContainer}>
            <RaisedButton onClick={onClose} label='Cancel'/>
            <RaisedButton
              onClick={this.handleSubmit}
              label='Submit'
              primary={true}
              style={{ marginLeft: '10px' }}
            />
          </div>
          <Snackbar
            open={this.state.error}
            message='There was an issue with submitting your feedback, please try again.'
            autoHideDuration={4000}
          />
        </div>
      </div>
    );
  }
}
