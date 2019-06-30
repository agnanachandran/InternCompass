import PropTypes from 'prop-types';
import React from 'react';
import StepperComponent from './StepperComponent';
import _ from 'lodash';

export default class Stepper extends React.Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    titles: PropTypes.arrayOf(PropTypes.string),
  };

  renderChildren() {
    const { children, titles } = this.props;

    return _.map(children, (child, index) => (
      <StepperComponent
        key={index}
        title={titles[index]}
      >
        {child}
      </StepperComponent>
    ));
  }

  render() {
    return (
      <div>
        {this.renderChildren()}
      </div>
    );
  }
}
