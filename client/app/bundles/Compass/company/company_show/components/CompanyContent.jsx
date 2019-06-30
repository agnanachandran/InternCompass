import PropTypes from 'prop-types';
import React from 'react';
import CompanyOverview from './CompanyOverview';
import CompanyMenuBar from './CompanyMenuBar';
import CompanyReviewsContainer from './CompanyReviewsContainer';
import _ from 'lodash';
import $ from 'jquery';

export default class CompanyContent extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    logoUrl: PropTypes.string,
    websiteUrl: PropTypes.string,
    careersUrl: PropTypes.string,
    hqCity: PropTypes.string,
    hqRegion: PropTypes.string,
    avgRating: PropTypes.number,
    reviews: PropTypes.array,
    currentUserId: PropTypes.number,
    onVoteCast: PropTypes.func.isRequired,
    slug: PropTypes.string.isRequired,
    isFollowing: PropTypes.bool.isRequired,
    recommendedCompanies: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      menuBarIsFixed: false,
    };
  }

  componentDidMount() {
    this.initializeScrollHandlers();
    const $menuBarElement = $(this._menuBarElement);
    this.menuBarHeight = $menuBarElement.height();
  }

  componentWillReceiveProps(nextProps) {
    $(window).off('scroll');
    this.initializeScrollHandlers();
  }

  componentWillUnmount() {
    $(window).off('scroll');
  }

  initializeScrollHandlers() {
    const $window = $(window);
    const $navbar = $('#navbar');
    const $menuBarElement = $(this._menuBarElement);
    const $reviewsContainerElement = $(this._reviewsContainerElement);

    const updateMenuBarFixedState = () => {
      const windowScrollTop = $window.scrollTop();
      const menuBarElementOffsetTop = $menuBarElement.offset().top;
      const reviewsContainerElementOffsetTop = $reviewsContainerElement.offset().top;
      // For some reason, this can change occasionally, so we need to update it every time
      const navbarHeight = $navbar.height();

      let menuBarIsFixed;
      if (this.state.menuBarIsFixed) {
        menuBarIsFixed = windowScrollTop - reviewsContainerElementOffsetTop + navbarHeight + this.menuBarHeight > 0;
      } else {
        menuBarIsFixed = windowScrollTop - menuBarElementOffsetTop + navbarHeight > 0;
      }
      this.setState({
        menuBarIsFixed,
      });
    };

    updateMenuBarFixedState();
    $window.scroll(_.throttle(updateMenuBarFixedState, 50));
  }

  getJobsFromReviews() {
    const reviews = this.props.reviews;
    // `jobs` is an array of {title, location, reviews} objects
    const jobs = [];
    _.each(reviews, (review) => {
      const title = review.jobTitle;
      const location = review.jobLocation;

      const index = _.findIndex(jobs, { title, location });
      if (index > -1) {
        jobs[index].reviews.push(review);
      } else {
        jobs.push({
          title,
          location,
          reviews: [review],
        });
      }
    });
    return _.sortBy(jobs, ['title', 'location']);
  }


  render() {
    const {
      reviews,
      currentUserId,
      onVoteCast,
    } = this.props;

    const overviewProps = {
      name: this.props.name,
      description: this.props.description,
      logoUrl: this.props.logoUrl,
      websiteUrl: this.props.websiteUrl,
      hqCity: this.props.hqCity,
      hqRegion: this.props.hqRegion,
      avgRating: this.props.avgRating,
    };

    const numReviews = reviews && reviews.length;
    const jobs = this.getJobsFromReviews();
    const reviewsContainerStyle = {};
    if (this.state.menuBarIsFixed) {
      reviewsContainerStyle.marginTop = this.menuBarHeight;
    }

    return (
      <div>
        <CompanyOverview {...overviewProps} numReviews={numReviews} />
        <div
          ref={(e) => {this._menuBarElement = e;}}
        >
          <CompanyMenuBar
            name={this.props.name}
            jobs={jobs}
            slug={this.props.slug}
            logoUrl={this.props.logoUrl}
            careersUrl={this.props.careersUrl}
            avgRating={this.props.avgRating}
            userReviewsCount={numReviews}
            isFollowing={this.props.isFollowing}
            isSignedIn={Boolean(currentUserId)}
            isFixed={this.state.menuBarIsFixed}
            dispatch={this.props.dispatch}
          />
        </div>
        <div
          ref={(e) => {this._reviewsContainerElement = e;}}
          style={reviewsContainerStyle}
        >
          <CompanyReviewsContainer
            companyName={this.props.name}
            dispatch={this.props.dispatch}
            reviews={reviews}
            jobs={jobs}
            currentUserId={currentUserId}
            onVoteCast={onVoteCast}
            recommendedCompanies={this.props.recommendedCompanies}
          />
        </div>
      </div>
    );
  }
}

