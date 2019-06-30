import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

export default class CompaniesSearchComponent extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    queryString: PropTypes.string,
    page: PropTypes.number.isRequired,
    order: PropTypes.string,
    locationFilter: PropTypes.array.isRequired,
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.queryString !== prevProps.queryString
      || this.props.page !== prevProps.page
      || this.props.order !== prevProps.order
      || !_.isEqual(this.props.locationFilter, prevProps.locationFilter)
    ) {
      this.form.submit();
    }
  }

  renderLocationFilters() {
    return _.map(this.props.locationFilter, (filter, idx) => (
      <input key={idx} type='hidden' name='location_filter[]' value={filter}/>
    ));
  }

  render() {
    return (
      <form action='/search' ref={(e) => this.form = e}>
        {this.props.children}
        <input type='hidden' name='query' value={this.props.queryString}/>
        <input type='hidden' name='page' value={this.props.page}/>
        <input type='hidden' name='order' value={this.props.order}/>
        {this.renderLocationFilters()}
      </form>
    );
  }
}
