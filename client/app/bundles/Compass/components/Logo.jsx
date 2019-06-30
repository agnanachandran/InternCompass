import PropTypes from 'prop-types';
import React from 'react';
import css from './Logo.scss';
import classnames from 'classnames';

export default class Logo extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  }

  render() {
    const classes = classnames(css.logo, {
      [this.props.className]: this.props.className !== undefined,
    });

    return (
      <h1 className={classes}>
        InternCompass
      </h1>
    );
  }
}
