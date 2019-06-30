import PropTypes from 'prop-types';
import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import css from './NegativeConfirmModal.scss';
import { colours } from '../constants/compassConstants';

export default class NegativeConfirmModal extends React.Component {
  static propTypes =  {
    confirmButtonText: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
  };

  static defaultProps = {
    confirmButtonText: 'Delete',
  };

  render() {
    return (
      <Dialog
        onRequestClose={this.props.onClose}
        open={this.props.visible}
      >
        <div>
          <div className={css.text}>
            {this.props.text}
          </div>
          <div className={css.btnRow}>
            <RaisedButton onClick={this.props.onClose} label='Cancel'/>
            <RaisedButton
              onClick={this.props.onConfirm}
              label={this.props.confirmButtonText}
              labelColor='white'
              backgroundColor={colours.MATERIAL_RED}
              style={{ marginLeft: '10px' }}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}
