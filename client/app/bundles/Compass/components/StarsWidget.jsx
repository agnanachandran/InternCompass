import PropTypes from 'prop-types';
import React from 'react';
import Star from './Star';
import css from './StarsWidget.scss';
import classnames from 'classnames';

// out of 5, can make a prop if we need later
export default class StarsWidget extends React.PureComponent {
  static propTypes = {
    rating: PropTypes.number.isRequired,
    className: PropTypes.string,
    size: PropTypes.oneOf(['xSmall', 'small', 'medium']),
  };

  renderStars() {
    let stars = [];
    let rating = this.props.rating;
    for (let i = 0; i < 5; i++) {
      let fill;
      if (rating > 0.5) {
        fill = 'filled';
        rating--;
      } else if (rating > 0) {
        fill = 'half';
        rating -= 0.5;
      } else {
        fill = 'empty';
      }
      stars.push(
        <Star
          key={i}
          fill={fill}
          readOnly={true}
        />
      );
    }
    return stars;
  }

  render() {
    const styles = classnames({
      [css.xSmall]: this.props.size === 'xSmall',
      [css.small]: this.props.size === 'small',
      [css.medium]: this.props.size === 'medium',
      [css.starsContainer]: true,
      [this.props.className]: this.props.className !== undefined,
    });

    return (
      <span className={`${styles}`}>
        {this.renderStars()}
      </span>
    );
  }
}
