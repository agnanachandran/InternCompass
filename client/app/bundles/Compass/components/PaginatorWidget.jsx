import PropTypes from 'prop-types';
import React from 'react';
import css from './PaginatorWidget.scss';
import classnames from 'classnames';
import FontAwesomeIcon from './FontAwesomeIcon';
import _ from 'lodash';

export default class PaginatorWidget extends React.Component {
  static propTypes = {
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
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
        onClick={() => this.props.onChange(page)}
      >
        {innerButton}
      </span>
    );
  }

  render() {
    const { page, totalPages } = this.props;
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
}


