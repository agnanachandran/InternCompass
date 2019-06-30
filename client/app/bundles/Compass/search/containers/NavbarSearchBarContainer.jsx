import PropTypes from 'prop-types';
import React from 'react';
import css from './NavbarSearchBarContainer.scss';
import SearchAutoCompleteInput from '../components/SearchAutoCompleteInput';
import FontAwesomeIcon from '../../components/FontAwesomeIcon';
import { searchResultOrders } from '../../constants/SearchResultOrderConstants';

export default class NavbarSearchBarContainer extends React.Component {
  static propTypes = {
    queryString: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor() {
    super();
  }

  render() {
    return (
      <form action='/search' className={css.form}>
        <span className={css.searchIcon}>
          <FontAwesomeIcon icon='search' />
        </span>
        <SearchAutoCompleteInput
          id='navbar'
          autoFocus={false}
          queryString={this.props.queryString}
          order={searchResultOrders.MOST_REVIEWS}
          locationFilter={[]}
          onChange={this.props.onChange}
          searchBoxCSS={{ input: css.input, suggestion: css.suggestion }}
          width='190px'
        />
      </form>
    );
  }
}
