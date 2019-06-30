import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Card from 'material-ui/Card';

export default class AdminCard extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    const { children } = this.props;
    return (
      <Card zDepth={1}>
        {children}
      </Card>
    );
  }
}