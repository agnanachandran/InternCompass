import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as searchActionCreators from '../actions/searchActionCreators';
import * as companyActionCreators from '../../company/actions/companyActionCreators';
import SearchResultWidget from '../components/SearchResultWidget';
import SearchResultsPaginatorWidget from '../components/SearchResultsPaginatorWidget';
import CompaniesSearchBarContainer from './CompaniesSearchBarContainer';
import SearchResultsInformationWidget from '../components/SearchResultsInformationWidget';
import CompaniesSearchOrderSelector from '../components/CompaniesSearchOrderSelector';
import css from './SearchResultsContainer.scss';
import { searchResultOrders } from '../../constants/SearchResultOrderConstants';
import _ from 'lodash';
import CenteredSpinner from '../../components/CenteredSpinner';
import SearchFilters from '../components/SearchFilters';

class SearchResultsContainer extends React.Component {
  static propTypes = {
    results: PropTypes.array,
    query: PropTypes.string,
    order: PropTypes.oneOf(Object.values(searchResultOrders)).isRequired,
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object,
    locationFilter: PropTypes.array.isRequired,
  };

  static defaultProps = {
    order: searchResultOrders.MOST_REVIEWS,
  };

  constructor(props, context) {
    super(props, context);
    this.actions = bindActionCreators({ ...searchActionCreators, ...companyActionCreators }, this.props.dispatch);
    this.state = {
      loading: false,
    };
    this.handleUpdateQuery = this.handleUpdateQuery.bind(this);
  }

  componentDidMount() {
    if (!this.props.results
      || (this.props.results.length === 0 && !this.props.query)) {
      this.setState({ loading: true });
      this.actions.fetchSearchResults(this.props.query, this.props.page, this.props.order, this.props.locationFilter);
    } else {
      this.setState({ loading: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.query !== nextProps.location.query) {
      window.location.reload();
    } else if (this.props.results !== nextProps.results) {
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    this.actions.clearSearchParams();
  }

  handleUpdateQuery(key, value) {
    this.setState({ loading: true });
    const updatedParams = {
      [key]: value,
    };
    if (key !== 'page') {
      updatedParams['page'] = 1;
    }
    this.actions.setSearchParams(updatedParams);
  }

  renderResults(results) {
    return _.map(results, result =>
      (
        <SearchResultWidget key={result.slug} {...result } onChange={this.actions.setCompany} />
      )
    );
  }

  renderResultsInfo() {
    if (this.state.loading) {
      return (
        <div className={css.spinnerContainer}>
          <CenteredSpinner size={1} marginTop={'0px'} />
        </div>
      );
    }
    return (
      <div>
        <SearchResultsInformationWidget
          page={this.props.page}
          totalPages={this.props.totalPages}
        />
        {this.renderResults(this.props.results)}
        <SearchResultsPaginatorWidget
          page={this.props.page}
          totalPages={this.props.totalPages}
          queryString={this.props.query}
          order={this.props.order}
          locationFilter={this.props.locationFilter}
          onUpdateQuery={this.handleUpdateQuery}
        />
      </div>
    );
  }

  render() {
    const { query, page, order, locationFilter } = this.props;
    return (
      <div>
        <div className={css.searchBarContainer}>
          <div className={css.searchBarInnerContainer}>
            <div className={css.searchBar}>
              <CompaniesSearchBarContainer
                queryString={query}
                order={order}
                locationFilter={locationFilter}
                onUpdateQuery={this.handleUpdateQuery}
              />
            </div>
            <div className={css.controls}>
              <CompaniesSearchOrderSelector
                queryString={query}
                page={page}
                order={order}
                locationFilter={locationFilter}
                onUpdateQuery={this.handleUpdateQuery}
              />
            </div>
          </div>
        </div>
        <div className={css.filtersAndResultsContainer}>
          <div className={css.filtersContainer}>
            <SearchFilters
              queryString={query}
              page={page}
              order={order}
              locationFilter={locationFilter}
              onUpdateQuery={this.handleUpdateQuery}
            />
          </div>
          <div className={css.resultsInfoContainer}>
            {this.renderResultsInfo()}
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    results: state.search.results,
    query: state.search.query,
    order: state.search.order,
    locationFilter: state.search.locationFilter,
    page: parseInt(state.search.page),
    totalPages: parseInt(state.search.totalPages),
  };
}

export default connect(mapStateToProps)(SearchResultsContainer);

