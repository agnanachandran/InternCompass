import PropTypes from 'prop-types';
import React from 'react';
import StepperSeparator from './StepperSeparator';
import css from './StepperComponent.scss';

export default class StepperComponent extends React.Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
  };

  render() {
    const { children, title } = this.props;
    return (
      <div className={css.container}>
        <div className={css.header}>
          <span className={css.title}>
            <StepperSeparator text={title}/>
          </span>
        </div>
        <div>
          {children}
        </div>
      </div>
    );
  }
}
