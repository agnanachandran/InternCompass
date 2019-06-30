import PropTypes from 'prop-types';
import React from 'react';
import css from './LabelledInputField.scss';

export default class LabelledInputField extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    formKey: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onFieldChanged: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onFieldChanged(this.props.formKey, e.target.value);
  }

  render() {
    return (
      <div className={css.container}>
        <label className={css.label} htmlFor={this.props.formKey}>{this.props.name}</label>
        <div className={css.inputContainer}>
          <input
            id={this.props.formKey}
            className={css.input}
            value={this.props.value || ''}
            placeholder={this.props.placeholder}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}