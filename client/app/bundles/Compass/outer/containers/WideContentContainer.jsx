import PropTypes from 'prop-types';
import React, { Component } from 'react';
import css from './WideContentContainer.scss';

export default class WideContentContainer extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className={css.wideContentContainer}>
        {this.props.children}
      </div>
    );
  }
}
