import PropTypes from 'prop-types';
import React from 'react';
import Card from 'material-ui/Card';
import css from './CompanySidebar.scss';
import RecommendedCompanyCard from './RecommendedCompanyCard';
import _ from 'lodash';

export default class CompanySidebar extends React.Component {
  static propTypes = {
    recommendedCompanies: PropTypes.array.isRequired,
  };

  renderRecommendedCompanies() {
    return _.map(this.props.recommendedCompanies, (company, idx) => {
      return (
        <RecommendedCompanyCard
          key={idx}
          name={company.name}
          slug={company.slug}
          logoUrl={company.logoUrl}
          avgRating={company.avgRating}
          userReviewsCount={company.userReviewsCount}
        />
      );
    });
  }

  render() {
    return (
      <Card>
        <div className={css.container}>
          <h3 className={css.header}>
            Recommended Companies
          </h3>
          {this.renderRecommendedCompanies()}
        </div>
      </Card>
    );
  }
}
