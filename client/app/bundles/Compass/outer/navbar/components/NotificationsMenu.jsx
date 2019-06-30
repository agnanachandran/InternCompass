import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import classnames from 'classnames';
import css from './NotificationsMenu.scss';
import FontAwesomeIcon from '../../../components/FontAwesomeIcon';
import Popover from 'material-ui/Popover';
import { NotificationCategories } from '../../../constants/compassConstants';
import UserProfilePhoto from '../../../components/UserProfilePhoto';
import { formatDateWithTime } from '../../../utils/formatUtils';
import * as notificationActions from '../../actions/notificationActions';
import { bindActionCreators } from 'redux';

export default class NotificationsMenu extends React.Component {
  static propTypes = {
    notifications: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.actions = bindActionCreators(notificationActions, props.dispatch);
  }

  getUnseenNotifications() {
    const notifications = this.props.notifications ? this.props.notifications : [];
    return _.groupBy(notifications, 'seen')['false'] || [];
  }

  markNotificationsAsSeen() {
    const unseenNotifications = this.getUnseenNotifications();
    if (!_.isEmpty(unseenNotifications)) {
      this.actions.markNotificationsAsSeen(unseenNotifications[0].id);
      this.actions.setNotifications(_.map(this.props.notifications, (notification) => {
        return {
          ...notification,
          seen: true,
        };
      }));
    }
  }

  handleButtonClick(event) {
    if (this.state.menuOpen) {
      this.markNotificationsAsSeen();
    } else {
      // Load notifications when we're about to open them
      this.actions.fetchNotifications();

    }
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  }

  handleClose() {
    this.setState({
      menuOpen: false,
    });
    this.markNotificationsAsSeen();
  }

  renderNotification(notification) {
    if (notification.category === NotificationCategories.critique_comment) {
      return (
        <Link to={`/critiques/${notification.critiqueToken}`}>
          <div className={css.userNotificationContainer}>
            <UserProfilePhoto
              imageUrl={notification.notifier.imgUrl}
              size='small'
              shape='circle'
            />
            <div className={css.userNotificationInfo}>
              <span className={css.userNotificationName}>
                {notification.notifier.name}
              </span> commented on your resume.
              <div className={css.userNotificationDate}>
                {formatDateWithTime(notification.createdAt)}
              </div>
            </div>
          </div>
        </Link>
      );
    } else if (notification.category === NotificationCategories.report_critique) {
      return (
        <Link to={`/critiques/${notification.critiqueToken}`}>
          Critique token: {notification.critiqueToken}
          <br />
          {formatDateWithTime(notification.createdAt)}
        </Link>
      );
    } else if (notification.category === NotificationCategories.report_critique_comment) {
      return (
        <Link to={`/critiques/${notification.critiqueToken}`}>
          Critique token: {notification.critiqueToken}
          <br />
          Critique comment ID: {notification.critiqueCommentId}
          <br />
          {formatDateWithTime(notification.createdAt)}
        </Link>
      );
    }
    // Ignore notification types we don't know about (if we ever get here, we haven't handled one of our notification types)
  }

  renderNotifications(notifications) {
    return _.map(notifications, (notification, idx) => {
      const classNames = classnames(css.notification, {
        [css.seenNotification]: notification.seen,
        [css.unseenNotification]: !notification.seen,
      });

      return (
        <div className={classNames} key={idx} onClick={this.handleClose}>
          {this.renderNotification(notification)}
        </div>
      );
    });
  }

  render() {
    const notifications = this.props.notifications ? this.props.notifications : [];
    let icon = 'bell';
    const unseenNotifications = this.getUnseenNotifications();
    if (_.isEmpty(unseenNotifications)) {
      icon = 'bell-o';
    }
    const iconClassName = classnames({ [css.unseenNotificationsIcon]: unseenNotifications.length > 0 });

    return (
      <div
        onClick={this.handleButtonClick}
        className={css.notificationsIconContainer}
        ref={(e) => this._notificationsIconContainer = e}
      >
        <FontAwesomeIcon
          className={iconClassName}
          icon={icon}
        />
        <Popover
          open={this.state.menuOpen}
          anchorEl={this._notificationsIconContainer}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.handleClose}
          useLayerForClickAway={false}
        >
          <div className={css.header}>
            Notifications ({unseenNotifications.length})
          </div>
          <div className={css.notificationsContainer}>
            {this.renderNotifications(notifications)}
          </div>
        </Popover>
      </div>
    );
  }
}
