import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';
import css from './ValidationError.scss';

export default class ValidationError extends React.PureComponent {
  static propTypes = {
    error: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
  };

  renderError() {
    const { error, message } = this.props;
    if (error) {
      return (
        <span className={css.error}>
          <i data-tip={message} className='fa fa-exclamation-triangle' aria-hidden={true} />
          <ReactTooltip place='right' type='dark' effect='float'/>
        </span>
      );
    }
    return null;
  }

  render() {
    return this.renderError();
  }
}
