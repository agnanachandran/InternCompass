import PropTypes from 'prop-types';
import React from 'react';
import css from './Separator.scss';

export default class Separator extends React.Component {
  static propTypes = {
    text: PropTypes.string,
  };

  render() {
    return (
      <div>
        <div className={css.separator}>
          {this.props.text}
        </div>
      </div>
    );
  }
}
