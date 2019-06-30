import PropTypes from 'prop-types';
import React from 'react';
import css from './Footer.scss';
import FeedbackModal from '../../../components/FeedbackModal';
import { Link } from 'react-router';

export default class Footer extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
  };

  constructor() {
    super();
    this.state = {
      feedbackModalVisible: false,
    };
    this.handleFeedbackClick = this.handleFeedbackClick.bind(this);
    this.handleFeedbackClose = this.handleFeedbackClose.bind(this);
  }

  handleFeedbackClick() {
    this.setState({
      feedbackModalVisible: true,
    });
  }

  handleFeedbackClose() {
    this.setState({
      feedbackModalVisible: false,
    });
  }

  render() {
    return (
      <div className={css.container}>
        <FeedbackModal
          visible={this.state.feedbackModalVisible}
          dispatch={this.props.dispatch}
          onClose={this.handleFeedbackClose}
          currentUser={this.props.currentUser}
        />
        <div className={css.innerContainer}>
          <div className={css.sideContainer}>
            <img className={css.logoImage} src='/images/black_compass_transparent.png'/>
            <div className={`${css.link} ${css.social}`}>
              <a className={css.alignCenter} href='mailto:support@interncompass.io'>
                Contact Us
              </a>
            </div>
            <div className={css.link}>
              <a onClick={this.handleFeedbackClick}>
                Feedback
              </a>
            </div>
            <div className={css.link}>
              <Link to={'/terms-of-use'}>Terms</Link>
            </div>
          </div>
          <div className={css.sideContainer}>
            <div className={`${css.link} ${css.social}`}>
              <a className={css.alignCenter} href='https://facebook.com/InternCompassIO'>
                <i className='fa fa-facebook-square' aria-hidden='true'></i>
                <span className={css.facebookLink}>Facebook</span>
              </a>
            </div>
            <div className={css.fbLikeShareContainer}>
              <div
                className='fb-like'
                data-href='https://facebook.com/InternCompassIO'
                data-layout='button_count'
                data-action='like'
                data-size='small'
                data-show-faces='true'
                data-share='true'
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
