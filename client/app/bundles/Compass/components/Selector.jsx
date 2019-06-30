import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import css from './Selector.scss';
import classnames from 'classnames';

export default class Selector extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onKeyDown: PropTypes.func,
    onSelected: PropTypes.func.isRequired,
    selected: PropTypes.string,
    valueToName: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onSelected(e.target.value);
  }

  renderOptions() {
    return _.map(this.props.valueToName, (name, value) => (
      <option key={value} value={value}>{name}</option>
    ));
  }

  render() {
    const { selected } = this.props;
    const classes = classnames(this.props.className, css.selector);
    return (
      <select
        className={classes}
        value={selected}
        onChange={this.handleChange}
        onKeyDown={this.props.onKeyDown}
      >
        {this.renderOptions()}
      </select>
    );
  }
}
