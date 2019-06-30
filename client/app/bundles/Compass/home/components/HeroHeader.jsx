import React from 'react';
import CompaniesSearchBarContainer from '../../search/containers/CompaniesSearchBarContainer';
import css from './HeroHeader.scss';

export default class HeroHeader extends React.Component {
  render() {
    return (
      <div className={css.header}>
        <div className={css.headerText}>
          Find Your Dream Internship
        </div>
        <CompaniesSearchBarContainer autoFocus={true} width={'420px'} />
      </div>
    );
  }
}

