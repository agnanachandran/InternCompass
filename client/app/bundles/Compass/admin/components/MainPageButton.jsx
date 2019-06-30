import React, { Component } from 'react';
import css from './MainPageButton.scss';
import { Link } from 'react-router';

export default class MainPageButton extends Component {
  render() {
    return (
      <div className={css.mainPageButtonParent}>
        <Link to={'/admin'} className={css.link}>
          <i className={'fa fa-chevron-left'} aria-hidden={true} />
          Admin Panel
        </Link>
      </div>
    );
  }
}