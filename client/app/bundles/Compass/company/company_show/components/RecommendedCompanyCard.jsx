import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import CompanyLogo from '../../../components/CompanyLogo';
import StarsWidget from '../../../components/StarsWidget';
import css from './RecommendedCompanyCard.scss';
import pluralize from 'pluralize';

const MAX_NAME_LENGTH = 14;

export default class RecommendedCompanyCard extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    logoUrl: PropTypes.string,
    slug: PropTypes.string.isRequired,
    avgRating: PropTypes.number,
    userReviewsCount: PropTypes.number,
  };

  renderTruncatedName() {
    return _.truncate(this.props.name, {
      length: MAX_NAME_LENGTH,
      separator: ' ',
      omission: '…'
    });
  }

  renderReviewCount() {
    const { userReviewsCount } = this.props;
    if (!userReviewsCount || userReviewsCount === 0) {
      return (<span>No reviews yet</span>);
    }

    return (
      <span>
        {userReviewsCount} {pluralize('review', userReviewsCount)}
      </span>
    );
  }

  render() {
    return (
      <Link to={`/companies/${this.props.slug}`}>
        <div className={css.container}>
          <div className={css.logoContainer}>
            <CompanyLogo
              logoUrl={this.props.logoUrl}
              companyName={this.props.name}
              size='xLarge'
            />
          </div>
          <div className={css.infoContainer}>
            <div>
              <div className={css.name} title={this.props.name}>
                {this.renderTruncatedName()}
              </div>
              <div className={css.subtitle}>
                {this.renderReviewCount()}
              </div>
            </div>

            {this.props.avgRating && (
              <div>
                <StarsWidget className={css.rating} rating={this.props.avgRating} size='xSmall' />
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }
}
