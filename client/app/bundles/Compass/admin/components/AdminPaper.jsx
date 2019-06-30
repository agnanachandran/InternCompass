import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import CenteredSpinner from '../../components/CenteredSpinner';
import classnames from 'classnames';
import css from './AdminPaper.scss';

export default class AdminPaper extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    loading: PropTypes.bool,
  }

  render() {
    const {
      children,
      className,
      loading
    } = this.props;
    return (
      <Paper zDepth={1} className={classnames(css.paper, className)}>
        {
          loading &&
          <div className={css.loadingDiv}>
            <CenteredSpinner size={1.5} className={css.spinnerParent} />
          </div>
        }
        {children}
      </Paper>
    );
  }
}