import PropTypes from 'prop-types';
import React from 'react';
import CenteredSpinner from './CenteredSpinner';

export default class LoadingContent extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    children: PropTypes.node.isRequired,
  };

  render() {
    if (this.props.loading) {
      return (<CenteredSpinner size={0.5} color='white' marginTop='2px' />);
    }
    return this.props.children;
  }
}
