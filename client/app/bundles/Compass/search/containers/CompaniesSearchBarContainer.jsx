import PropTypes from 'prop-types';
import React from 'react';
import css from './CompaniesSearchBarContainer.scss';
import SearchAutoCompleteInput from '../components/SearchAutoCompleteInput';
import FontAwesomeIcon from '../../components/FontAwesomeIcon';
import { searchResultOrders } from '../../constants/SearchResultOrderConstants';

export default class CompaniesSearchBarContainer extends React.Component {
  static propTypes = {
    autoFocus: PropTypes.bool.isRequired,
    queryString: PropTypes.string,
    order: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    locationFilter: PropTypes.array.isRequired,
    onUpdateQuery: PropTypes.func,
  };

  static defaultProps = {
    autoFocus: false,
    width: '92%',
    order: searchResultOrders.MOST_REVIEWS,
    locationFilter: [],
  };

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.onUpdateQuery) {
      this.props.onUpdateQuery();
    }
  }

  render() {
    return (
      <form action='/search' className={css.form}>
        <SearchAutoCompleteInput
          autoFocus={this.props.autoFocus}
          queryString={this.props.queryString}
          order={this.props.order}
          locationFilter={this.props.locationFilter}
          searchBoxCSS={{ input: css.input }}
          width={this.props.width}
        />
        <button className={css.submitButton} type='submit' onClick={this.handleClick}>
          <FontAwesomeIcon icon='search'/>
        </button>
      </form>
    );
  }
}
