import PropTypes from 'prop-types';
import React from 'react';
import css from './CompanyOverview.scss';
import FontAwesomeIcon from '../../../components/FontAwesomeIcon';
import StarsWidget from '../../../components/StarsWidget';
import CompanyLogo from '../../../components/CompanyLogo';
import { roundRating } from '../../../utils/utils';
import { formatWebsiteUrl } from '../../../utils/formatUtils';
import ReactTooltip from 'react-tooltip';
import pluralize from 'pluralize';

export default class CompanyOverview extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    logoUrl: PropTypes.string,
    websiteUrl: PropTypes.string,
    hqCity: PropTypes.string,
    hqRegion: PropTypes.string,
    avgRating: PropTypes.number,
    numReviews: PropTypes.number,
  };

  renderAverageRating() {
    if (this.props.avgRating) {
      const message = `Based on ${this.props.numReviews} ${pluralize('review', this.props.numReviews)}`;
      return (
        <div>
          <div data-tip={message} className={css.avgRatingParent}>
            <div className={css.avgRatingParentNumber}>{roundRating(this.props.avgRating)}</div>
            <StarsWidget rating={this.props.avgRating} className={css.avgRatingParentStars}/>
          </div>
          <ReactTooltip place='bottom' type='dark' effect='solid'/>
        </div>
      );
    }
  }

  render() {
    const {
      name,
      description,
      websiteUrl,
      hqCity,
      hqRegion,
    } = this.props;

    return (
      <div className={css.container}>
        <div className={css.topOverview}>
          <CompanyLogo
            logoUrl={this.props.logoUrl}
            companyName={name}
            size='xxLarge'
          />
          <div className={css.overviewContent}>
            <div className={css.name}>
              {name}
            </div>
            {(websiteUrl || (hqCity && hqRegion)) && (
              <div>
                {websiteUrl && (
                  <div className={css.companyMetaDataChild}>
                    <FontAwesomeIcon className={css.companyMetaDataIcon} icon='globe' />
                    <a className={css.companyLink} href={websiteUrl} target='_blank' rel='noopener noreferrer'>
                      {formatWebsiteUrl(websiteUrl)}
                    </a>
                  </div>
                )}
                {hqCity && hqRegion && (
                  <div className={css.companyMetaDataChild}>
                    <FontAwesomeIcon className={css.companyMetaDataIcon} icon='map-marker' />
                    {hqCity}, {hqRegion}
                  </div>
                )}
              </div>
            )}
            <div className={css.description}>
              {description}
            </div>
          </div>
          {this.renderAverageRating()}
        </div>
      </div>
    );
  }
}
