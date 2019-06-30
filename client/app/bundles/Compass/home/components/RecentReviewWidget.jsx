import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import css from './RecentReviewWidget.scss';
import StarsWidget from '../../components/StarsWidget';
import CompanyLogo from '../../components/CompanyLogo';

const MAX_DESCRIPTION_LENGTH = 140;

export default class RecentReviewsWidget extends React.Component {
  static propTypes = {
    review: PropTypes.object.isRequired,
  };

  getQuotePrefix() {
    if (this.props.review.userFirstName) {
      return `${this.props.review.userFirstName} said: `;
    }
    return '';
  }

  renderTruncatedDescription() {
    return _.truncate(this.props.review.description, {
      length: MAX_DESCRIPTION_LENGTH,
      separator: ' ',
      omission: '…'
    });
  }

  render() {
    const {
      companyName,
      companySlug,
      overallRating,
      jobTitle,
      companyLogoUrl,
    } = this.props.review;
    return (
      <div className={css.container}>
        <div className={css.innerContainer}>
          <div className={css.companyLogo}>
            <CompanyLogo
              companySlug={companySlug}
              companyName={companyName}
              logoUrl={companyLogoUrl}
              size='large'
            />
          </div>
          <h3>
            <Link to={`/companies/${companySlug}`} className={css.companyName}>
              {companyName}
            </Link>
          </h3>
          <h4 className={css.jobTitle}>
            {jobTitle}
          </h4>
          <div className={css.reviewText}>
            {this.getQuotePrefix()}"{this.renderTruncatedDescription()}" &nbsp;
            <Link to={`/companies/${companySlug}`} className={css.link}>
              Show&nbsp;More
            </Link>
          </div>

          <div>
            <StarsWidget rating={overallRating} size='medium'/>
          </div>
        </div>
      </div>
    );
  }
}

