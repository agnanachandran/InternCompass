import PropTypes from 'prop-types';
import React from 'react';
import CompaniesLocationFilter from './CompaniesLocationFilter';

export default class SearchFilters extends React.Component {
  static propTypes = {
    queryString: PropTypes.string,
    page: PropTypes.number.isRequired,
    order: PropTypes.string.isRequired,
    locationFilter: PropTypes.array.isRequired,
    onUpdateQuery: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div>
        <CompaniesLocationFilter
          queryString={this.props.queryString}
          page={this.props.page}
          order={this.props.order}
          locationFilter={this.props.locationFilter}
          onUpdateQuery={this.props.onUpdateQuery}
        />
      </div>
    );
  }
}

