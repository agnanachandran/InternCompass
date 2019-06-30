import PropTypes from 'prop-types';
import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import css from './CenteredSpinner.scss';
import classnames from 'classnames';
import { colours } from '../constants/compassConstants';

export default class CenteredSpinner extends React.Component {
  static propTypes = {
    marginTop: PropTypes.string,
    size: PropTypes.number.isRequired,
    className: PropTypes.string,
    color: PropTypes.string,
  };

  render() {
    const {
      className,
      size,
      marginTop
    } = this.props;

    const color = this.props.color ? this.props.color : colours.SPINNER_DEFAULT;
    return (
      <div className={classnames(css.container, className)} style={{ marginTop: marginTop }}>
        <CircularProgress size={60 * size} thickness={4 * size} color={color}/>
      </div>
    );
  }
}
