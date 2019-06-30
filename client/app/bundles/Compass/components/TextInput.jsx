import PropTypes from 'prop-types';
import React from 'react';
import { isMobileDevice } from '../utils/utils';


export default class TextInput extends React.Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
  };

  componentDidMount() {
    if (this.props.autoFocus && !isMobileDevice()) {
      this.input.focus();
    }
  }

  render() {
    const { name, placeholder } = this.props;
    return (
      <input
        type='text'
        name={name}
        placeholder={placeholder}
        ref={(e) => this.input = e}
      />
    );
  }
}
