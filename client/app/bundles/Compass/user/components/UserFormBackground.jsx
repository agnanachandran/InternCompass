import PropTypes from 'prop-types';
import React, { Component } from 'react';
import css from './UserFormBackground.scss';

export default class UserFormBackground extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
  };

  render() {
    return(
      <div className={css.centered}>
        <div className={css.full}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
