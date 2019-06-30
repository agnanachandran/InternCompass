import PropTypes from 'prop-types';
import React from 'react';
import SearchAutoCompleteInput from './SearchAutoCompleteInput';
import css from './ResultsSearchBarWidget.scss';

export default class ResultsSearchBarWidget extends React.Component {

  static propTypes = {
    queryString: PropTypes.string,
  }

  render() {
    return (
      <div className={css.outerContainer}>
        <SearchAutoCompleteInput searchBoxCSS={css} queryString={this.props.queryString} width={'420px'} />
      </div>
    );
  }
}
