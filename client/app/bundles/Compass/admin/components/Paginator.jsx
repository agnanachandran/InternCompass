import PropTypes from 'prop-types';
import React, { Component } from 'react';
import css from './Paginator.scss';
import ReactPaginate from 'react-paginate';

export default class Paginator extends Component {
  static propTypes = {
    handlePageClick: PropTypes.func.isRequired,
    pageNum: PropTypes.number.isRequired,
    initialSelected: PropTypes.number.isRequired
  };

  render() {
    const {
      handlePageClick,
      pageNum,
      initialSelected
    } = this.props;
    return (
      <div className={css.paginationParent}>
        <ReactPaginate pageNum={pageNum}
          initialSelected={initialSelected}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          containerClassName={css.pagination}
          activeClassName={css.active}
          disabledClassName={css.disabled}
          breakClassName={css.break}
          clickCallback={handlePageClick}
        />
      </div>
    );
  }
}