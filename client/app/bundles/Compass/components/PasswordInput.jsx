import PropTypes from 'prop-types';
import React from 'react';

export default class PasswordInput extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    placeholder: 'Password',
  };

  render() {
    const { name, placeholder } = this.props;
    return (
      <input
        type='password'
        autoComplete='off'
        name={name}
        placeholder={placeholder}
      />
    );
  }
}