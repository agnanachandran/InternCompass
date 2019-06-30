import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

export default class UserHeadline extends React.Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    school: PropTypes.string,
    program: PropTypes.string,
  };

  render() {
    const schoolExists = !_.isEmpty(this.props.school);
    const programExists = !_.isEmpty(this.props.program);
    return (
      <div className={this.props.className}>
        {schoolExists && this.props.school}
        {programExists && (
          <span>
            {schoolExists && (
              <span>
                {' '}&middot;{' '}
              </span>
            )}
            {this.props.program}
          </span>
        )}
      </div>
    );
  }
}

