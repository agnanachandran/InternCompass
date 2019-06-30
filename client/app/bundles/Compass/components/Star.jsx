import PropTypes from 'prop-types';
import React from 'react';
import css from './Star.scss';
import classnames from 'classnames';

export default class Star extends React.Component {
  static propTypes = {
    fill: PropTypes.oneOf(['empty', 'half', 'filled']).isRequired,
    border: PropTypes.bool.isRequired,
    className: PropTypes.string,
    readOnly: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    border: true,
    readOnly: false,
  }

  render() {
    let starPortionToClassName = {};
    if (this.props.border) {
      starPortionToClassName = {
        empty: 'star-o',
        half: 'star-half-o',
        filled: 'star',
      };
    } else {
      starPortionToClassName = {
        half: 'star-half',
        filled: 'star',
      };
    }

    const starStyles = classnames({
      ['fa']: true,
      [`fa-${starPortionToClassName[this.props.fill]}`]: true,
    });

    const styles = classnames({
      [css.star]: !this.props.readOnly,
      [css.starReadOnly]: this.props.readOnly,
      [this.props.className]: this.props.className,
    });

    return (
      <span className={styles}>
        <i className={starStyles} aria-hidden={true} />
      </span>
    );
  }
}
