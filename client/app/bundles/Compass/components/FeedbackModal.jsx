import PropTypes from 'prop-types';
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FeedbackForm from './FeedbackForm';

export default class FeedbackModal extends React.Component {
  static propTypes =  {
    dispatch: PropTypes.func.isRequired,
    visible: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
  };

  render() {
    const { dispatch, visible, onClose, currentUser } = this.props;
    return (
      <Dialog
        autoScrollBodyContent={true}
        open={visible}
        onRequestClose={onClose}
      >
        <FeedbackForm
          currentUser={currentUser}
          dispatch={dispatch}
          onClose={onClose}
        />
      </Dialog>
    );
  }
}