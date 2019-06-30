import PropTypes from 'prop-types';
import React from 'react';
import css from './SearchResultsPaginatorWidget.scss';
import classnames from 'classnames';
import FontAwesomeIcon from '../../components/FontAwesomeIcon';
import CompaniesSearchComponent from './CompaniesSearchComponent';
import PaginatorWidget from '../../components/PaginatorWidget';
import _ from 'lodash';

export default class SearchResultsPaginatorWidget extends React.Component {
  static propTypes = {
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    queryString: PropTypes.string,
    order: PropTypes.string.isRequired,
    locationFilter: PropTypes.array.isRequired,
    onUpdateQuery: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(page) {
    this.props.onUpdateQuery('page', page);
  }

  renderButton(page, totalPages, direction) {
    let innerButton;
    let buttonClass;
    switch (direction) {
      case 'Previous':
        innerButton = (
          <span>
            <FontAwesomeIcon icon='angle-left' /> {direction}
          </span>
        );
        buttonClass = classnames(css.previousButton, {
          [css.invisibleButton]: page < 1,
        });
        break;
      case 'Next':
        innerButton = (
          <span>
            {direction} <FontAwesomeIcon icon='angle-right' />
          </span>
        );
        buttonClass = classnames(css.nextButton, {
          [css.invisibleButton]: page > totalPages,
        });
        break;
    }

    return (
      <span
        className={classnames(css.button, buttonClass)}
        onClick={() => this.handleButtonClick(page)}
      >
        {innerButton}
      </span>
    );
  }

  renderButtons(page, totalPages) {
    if (totalPages === 1 || page > totalPages || _.isNaN(page) || _.isNaN(totalPages)) {
      return null;
    }

    return (
      <div className={css.buttonContainer}>
        {this.renderButton(page - 1, totalPages, 'Previous')}
        <span className={css.pageCount}>
          Page {page} of {totalPages}
        </span>
        {this.renderButton(page + 1, totalPages, 'Next')}
      </div>
    );
  }

  render() {
    return (
      <div className={css.container}>
        <CompaniesSearchComponent
          queryString={this.props.queryString}
          page={this.props.page}
          order={this.props.order}
          locationFilter={this.props.locationFilter}
          ref={(e) => this.form = e}
        >
          <PaginatorWidget
            page={this.props.page}
            totalPages={this.props.totalPages}
            onChange={this.handleChange}
          />
        </CompaniesSearchComponent>
      </div>
    );
  }
}
