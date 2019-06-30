import PropTypes from 'prop-types';
import React, { Component } from 'react';
import css from './ContentContainer.scss';

export default class ContentContainer extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className={css.contentContainer}>
        {this.props.children}
      </div>
    );
  }

}
