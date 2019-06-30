import PropTypes from 'prop-types';
import React, { Component } from 'react';

class JobWidget extends Component {
  static propTypes = {
    company: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  };


  render() {
    const { company, title } = this.props;
    return (
      <div>
        <p>{`Job Title: ${title}`}</p>
        <p>{`Company: ${company}`}</p>
      </div>
    );
  }
}

export default JobWidget;
