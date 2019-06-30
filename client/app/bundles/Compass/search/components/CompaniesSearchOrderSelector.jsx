import PropTypes from 'prop-types';
import React from 'react';
import { COMPANIES_FILTER_TYPES } from '../constants/CompaniesFilterTypes';
import Selector from '../../components/Selector';
import CompaniesSearchComponent from './CompaniesSearchComponent';
import css from './CompaniesSearchOrderSelector.scss';
import { searchResultOrders } from '../../constants/SearchResultOrderConstants';

export default class CompaniesSearchOrderSelector extends React.Component {
  static propTypes = {
    queryString: PropTypes.string,
    page: PropTypes.number.isRequired,
    order: PropTypes.string,
    locationFilter: PropTypes.array.isRequired,
    onUpdateQuery: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      order: props.order || searchResultOrders.MOST_REVIEWS,
    };
    this.handleOrderChange = this.handleOrderChange.bind(this);
  }

  handleOrderChange(value) {
    this.props.onUpdateQuery('order', value);
    this.setState({ order: value });
  }

  render() {
    return (
      <CompaniesSearchComponent
        queryString={this.props.queryString}
        page={this.props.page}
        order={this.state.order}
        locationFilter={this.props.locationFilter}
      >
        <span>
          <span className={css.sortLabel}>Sort by:</span>
          <Selector
            className={css.sortSelector}
            onSelected={this.handleOrderChange}
            valueToName={COMPANIES_FILTER_TYPES}
            selected={this.state.order}
          />
        </span>
      </CompaniesSearchComponent>
    );
  }
}
