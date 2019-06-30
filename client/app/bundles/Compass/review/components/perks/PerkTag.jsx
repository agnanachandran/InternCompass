import PropTypes from 'prop-types';
import React from 'react';
import RectangularChip from '../../../components/RectangularChip';
import classnames from 'classnames';
import css from './PerkTag.scss';

export default class PerkTag extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    onDelete: PropTypes.func,
  };

  render() {
    const classes = classnames(css.chip, {
      [css.clickable]: this.props.onClick
    });

    return (
      <RectangularChip content={this.props.text}
        chipProps={{
          className: classes,
          onRequestDelete: this.props.onDelete,
          onTouchTap: this.props.onClick,
          labelColor: 'black',
        }}
      />
    );
  }
}


