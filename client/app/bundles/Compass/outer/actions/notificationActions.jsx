import { actionTypes } from '../../constants/compassConstants';
import { get, put } from '../../utils/ajaxCamelCase';
import _ from 'lodash';

export function fetchNotifications() {
  return dispatch => {
    return get('/notifications.json').done(data => {
      dispatch(setNotifications(data.notifications));
    });
  };
}

export function setNotifications(notifications) {
  return {
    type: actionTypes.SET_NOTIFICATIONS,
    notifications,
  };
}

export function markNotificationsAsSeen(markAsSeenBeforeId) {
  return dispatch => {
    return put('/notifications/mark-seen', {
      markAsSeenBeforeId,
    }).done(_.noop);
  };
}
