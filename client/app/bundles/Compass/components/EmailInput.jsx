import PropTypes from 'prop-types';
import React from 'react';

export default class EmailInput extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    placeholder: 'Email',
  };

  render() {
    const { name, placeholder } = this.props;
    return (
      <input type='email' name={name} placeholder={placeholder} />
    );
  }
}