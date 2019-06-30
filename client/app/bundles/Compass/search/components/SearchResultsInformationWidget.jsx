import PropTypes from 'prop-types';
import React from 'react';
import css from './SearchResultsInformationWidget.scss';

class SearchResultsInformationWidget extends React.Component {
  static propTypes = {
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
  };

  render() {
    const { page, totalPages } = this.props;

    if (totalPages === 0 || page > totalPages) {
      return (
        <div className={css.container}>
          <span>
            Your search didn't match any results :(
          </span>
        </div>
      );
    }

    return null;
  }
}

export default SearchResultsInformationWidget;
