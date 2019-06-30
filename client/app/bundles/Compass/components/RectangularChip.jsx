import PropTypes from 'prop-types';
import React from 'react';
import Chip from 'material-ui/Chip';
import css from './RectangularChip.scss';
import classnames from 'classnames';

// Wrapper around Material UI Chip component (www.material-ui.com/#/components/chip)
export default class RectangularChip extends React.Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    chipProps: PropTypes.object, // Props for the Material UI Chip
  };

  render() {
    const { content, chipProps } = this.props;

    let classes = [css.chip];
    if (chipProps && chipProps.className) {
      classes.push(chipProps.className);
    }

    return (
      <Chip {...chipProps} className={classnames(classes)}>
        {content}
      </Chip>
    );
  }
}

