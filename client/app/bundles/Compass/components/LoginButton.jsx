import PropTypes from 'prop-types';
import React from 'react';
import css from './LoginButton.scss';

export default class LoginButton extends React.Component {
  static propTypes = {
    callback: PropTypes.func,
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  };

  render() {
    // Render Facebook Login Button
    return (
      <button onClick={this.props.callback} className={css.fbBtn}>
        <div className={css.fbIcon}>
          <i className={`fa ${this.props.icon} ${css.icon}`} aria-hidden={true} />
        </div>
          <div className={css.text}>
            <p>{this.props.label}</p>
          </div>
      </button>
    );
  }
}
