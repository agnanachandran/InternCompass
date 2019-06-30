import PropTypes from 'prop-types';
import React, { Component } from 'react';
import NavbarContainer from '../navbar/containers/NavbarContainer';
import Footer from '../footer/components/Footer';
import $ from 'jquery';
import _ from 'lodash';
import css from './OuterWidget.scss';
import Snackbar from 'material-ui/Snackbar';
import { bindActionCreators } from 'redux';
import * as globalActions from '../actions/globalActions';

export default class OuterWidget extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    snackbarMessage: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.actions = bindActionCreators(globalActions, props.dispatch);
    this.handleNavbarHeightChanged = this.handleNavbarHeightChanged.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  handleNavbarHeightChanged(height) {
    if (!_.isUndefined(this.$children)) {
      this.$children.css('padding-top', `${height}px`);
    }
  }

  handleSnackbarClose() {
    this.props.dispatch(this.actions.clearSnackbarMessage());
  }

  render() {
    const { dispatch, currentUser, snackbarMessage } = this.props;
    return (
      <div className={css.wrapper}>
        <NavbarContainer onNavbarHeightChanged={this.handleNavbarHeightChanged}/>
        <div ref={(e) => this.$children = $(e)} className={css.inner}>
          {this.props.children}
          <Snackbar
            open={!_.isEmpty(snackbarMessage)}
            message={snackbarMessage}
            autoHideDuration={4000}
            onRequestClose={this.handleSnackbarClose}
          />
        </div>
        <Footer dispatch={dispatch} currentUser={currentUser} />
      </div>
    );
  }
}

