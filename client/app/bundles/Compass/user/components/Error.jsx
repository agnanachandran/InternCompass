import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import css from './Error.scss';
import FontAwesomeIcon from '../../components/FontAwesomeIcon';

export default class Error extends React.Component {
  static propTypes = {
    error: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
  };

  renderError() {
    const { error, message } = this.props;
    const names = classnames(css.error, { [css.hidden]: !error });
    return (
      <span className={names}>
        <FontAwesomeIcon
          icon='exclamation-triangle'
          className={css.errorIcon}
          tooltipOptions={{ text: message, place: 'left' }}
        />
      </span>
    );
  }

  render() {
    return this.renderError();
  }
}
