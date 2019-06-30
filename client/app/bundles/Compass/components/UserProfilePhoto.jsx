import PropTypes from 'prop-types';
import React from 'react';
import css from './UserProfilePhoto.scss';
import classnames from 'classnames';

const SIZES = {
  xSmall: 25,
  small: 35,
  medium: 60,
  large: 100,
  xLarge: 150,
};

const BORDER_RADIUS = {
  square: '3px',
  circle: '50%',
};

export default class UserProfilePhoto extends React.Component {
  static propTypes = {
    imageUrl: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.oneOf(['xSmall', 'small', 'medium', 'large', 'xLarge']).isRequired,
    shape: PropTypes.oneOf(['square', 'circle']).isRequired,
  };

  render() {
    const borderRadius = BORDER_RADIUS[this.props.shape];
    const imageSize = `${SIZES[this.props.size]}px`;
    const imageUrl = this.props.imageUrl ? this.props.imageUrl : '/images/user_placeholder.png';

    const imageStyle = {
      backgroundImage: `url('${imageUrl}')`,
      borderRadius,
      minWidth: imageSize,
      minHeight: imageSize,
      width: imageSize,
      height: imageSize,
    };
    return (
      <div style={imageStyle} className={classnames(css.image, this.props.className)} />
    );
  }
}
