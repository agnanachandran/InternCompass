import PropTypes from 'prop-types';
import React from 'react';
import Card from 'material-ui/Card';
import Popover from 'material-ui/Popover/Popover';
import _ from 'lodash';
import PerkTag from '../../../review/components/perks/PerkTag';
import StarsWidget from '../../../components/StarsWidget';
import Selector from '../../../components/Selector';
import CompanyJobReview from './CompanyJobReview';
import css from './CompanyJobContainer.scss';
import { roundRating } from '../../../utils/utils';
import CompanyMenuBar from './CompanyMenuBar';

const sortOptions = {
  newest: 'Newest',
  most_helpful: 'Most Helpful',
};

export default class CompanyJobContainer extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    reviews: PropTypes.array.isRequired,
    currentUserId: PropTypes.number,
    onVoteCast: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedSortOption: 'newest',
      perksPopoverOpen: false,
    };
    this.handleSelectSort = this.handleSelectSort.bind(this);
    this.handlePerksButtonMouseEnter = this.handlePerksButtonMouseEnter.bind(this);
    this.handlePerksButtonMouseLeave = this.handlePerksButtonMouseLeave.bind(this);
  }

  handleSelectSort(selectedSort) {
    this.setState({
      selectedSortOption: selectedSort,
    });
  }

  handlePerksButtonMouseEnter(event) {
    this.setState({
      perksPopoverOpen: true,
    });
  }

  handlePerksButtonMouseLeave() {
    this.setState({
      perksPopoverOpen: false,
    });
  }

  renderAverageRating(averageRating) {
    return (
      <div className={css.averageRatingContainer}>
        <StarsWidget className={css.averageRatingWidget} rating={averageRating} size='medium' />
        <div className={css.averageRatingDescription}>
          Average Rating ({roundRating(averageRating)})
        </div>
      </div>
    );
  }

  renderSalary(salary, currency, perks) {
    return (
      <div className={css.salaryContainer}>
        <div className={css.salaryValue}>
          {salary}
        </div>
        <div className={css.salaryDescription}>
          Monthly Salary ({currency})
        </div>
      </div>
    );
  }

  renderJobPerks(perks) {
    const perkTags = _.map(perks, (perk, idx) =>
      <PerkTag key={perk.id} text={perk.name} />
    );

    return (
      <div className={css.perksContainer}>
        {perkTags}
      </div>
    );
  }

  renderPerksButton(perks) {
    if (!_.isEmpty(perks)) {
      return (
        <div>
          <div
            className={css.perksButtonContainer}
            ref={(e) => this._perksButton = e}
            onMouseEnter={this.handlePerksButtonMouseEnter}
            onMouseLeave={this.handlePerksButtonMouseLeave}
          >
            <div className={css.perksButton}>
              <i className='fa fa-tags' />
            </div>
            <div className={css.perksButtonDescription}>
              Perks ({perks.length})
            </div>
          </div>
          <Popover
            animated={false}
            open={this.state.perksPopoverOpen}
            anchorEl={this._perksButton}
            anchorOrigin={{ horizontal: 'middle', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'middle', vertical: 'top' }}
            useLayerForClickAway={false}
          >
            {this.renderJobPerks(perks)}
          </Popover>
        </div>
      );
    }
  }

  renderJobInfo(title, location, averageSalary, currency, averageRating, perks) {
    return (
      <div className={css.jobInfoContainer}>
        <div className={css.jobInfoInnerContainer}>
          <div className={css.jobInfoLeftContainer}>
            <h2 className={css.jobTitle}>{title}</h2>
            <h3 className={css.jobLocation}>{location}</h3>
          </div>
          <div className={css.jobInfoRightContainer}>
            <div className={css.jobInfoInnerRightContainer}>
              {this.renderSalary(averageSalary, currency)}
              {this.renderPerksButton(perks)}
              {this.renderAverageRating(averageRating)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderReviews(reviews) {
    let sortedReviews;

    switch(this.state.selectedSortOption) {
      case 'most_helpful':
        sortedReviews = _.chain(reviews)
                          .sortBy((review) => review.createdAt)
                          .sortBy((review) => review.helpfulness)
                          .reverse()
                          .value(); // Sort by helpfulness, newest comes first for ties
        break;
      case 'newest':
        sortedReviews = _.chain(reviews)
                          .sortBy((review) => review.createdAt)
                          .reverse()
                          .value();
        break;
    }

    return _.map(sortedReviews, (review) => (
      <CompanyJobReview
        key={review.id}
        review={review}
        currentUserId={this.props.currentUserId}
        onVoteCast={this.props.onVoteCast}
      />
    ));
  }

  render() {
    const { title, location, reviews } = this.props;

    // TODO bad way to do it; get job data from store and populate store from server appropriately
    const averageSalary = reviews[0].jobAverageSalary;
    const currency = reviews[0].jobCurrency;
    const averageRating = reviews[0].jobAverageRating;
    const perks = reviews[0].jobPerks;

    return (
      <Card zDepth={1} className={css.container}>
        <Card>
          <div id={CompanyMenuBar.getAnchorForJob({ title, location }, false)} className={css.jobHeaderContainer}>
            {this.renderJobInfo(title, location, averageSalary, currency, averageRating, perks)}
          </div>
          <div className={css.reviewsHeader}>
            <div className={css.reviewsHeaderTitle}>
              Reviews
            </div>
            <div className={css.sortContainer}>
              Sort by: <Selector
                        className={css.sortSelector}
                        selected={this.state.selectedSortOption}
                        valueToName={sortOptions}
                        onSelected={this.handleSelectSort}
                       />
            </div>
          </div>
        </Card>
        <div className={css.reviewsContainer}>
          {this.renderReviews(reviews)}
        </div>
      </Card>
    );
  }
}
