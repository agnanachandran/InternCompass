import PropTypes from 'prop-types';
import React from 'react';
import css from './StepperSeparator.scss';

// TODO somehow combine with Michelle's separator?
export default class StepperSeparator extends React.Component {
  static propTypes = {
    text: PropTypes.string,
  };

  render() {
    return (
      <div>
        <div className={css.separator}>
          {this.props.text}
        </div>
      </div>
    );
  }
}

