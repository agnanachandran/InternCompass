import PropTypes from 'prop-types';
import React from 'react';
import css from './CompanyMenuBar.scss';
import { colours } from '../../../constants/compassConstants';
import DropdownMenu from '../../../components/DropdownMenu';
import FontAwesomeIcon from '../../../components/FontAwesomeIcon';
import * as reviewActions from '../../../review/actions/reviewActions';
import * as companyActionCreators from '../../../company/actions/companyActionCreators';
import * as redirectActions from '../../../actions/redirectActions';
import { bindActionCreators } from 'redux';
import CompanyMenuBarButton from './CompanyMenuBarButton';
import { Link } from 'react-router';
import _ from 'lodash';
import $ from 'jquery';

export default class CompanyMenuBar extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    jobs: PropTypes.array.isRequired,
    slug: PropTypes.string.isRequired,
    logoUrl: PropTypes.string,
    careersUrl: PropTypes.string,
    avgRating: PropTypes.number,
    userReviewsCount: PropTypes.number,
    isFollowing: PropTypes.bool.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    isFixed: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static getAnchorForJob(job, isHref) {
    const id = `${_.kebabCase(job.title)}_${_.kebabCase(job.location)}`;
    if (isHref) {
      return `#${id}`;
    }
    return id;
  }

  constructor(props) {
    super(props);
    this.actions = bindActionCreators({ ...companyActionCreators, ...reviewActions, ...redirectActions }, props.dispatch);
    this.state = {
      mouseInFollowButton: false,
      showUnfollow: false,
      loading: false,
    };
    this.handleWriteReview = this.handleWriteReview.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
    this.handleUnfollow = this.handleUnfollow.bind(this);
    this.handleSelectJob = this.handleSelectJob.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  componentDidMount() {
    this.menuBarHeight = $(this._menuBarElement).height();
    const updateNavbarHeight = () => {
      this.navbarHeight = $('#navbar').height();
    };
    updateNavbarHeight();
    $(window).scroll(_.throttle(updateNavbarHeight, 50));
  }

  componentWillUnmount() {
    $(window).off('scroll');
  }

  onMouseMove() {
    if (this.state.mouseInFollowButton && this.props.isFollowing) {
      this.setState({ showUnfollow: true });
    }
  }

  onMouseEnter() {
    this.setState({ mouseInFollowButton: true });
  }

  onMouseLeave() {
    this.setState({ showUnfollow: false, mouseInFollowButton: false });
  }

  getCompanyProps() {
    return {
      name: this.props.name,
      logoUrl: this.props.logoUrl,
      slug: this.props.slug,
      avgRating: this.props.avgRating,
      userReviewsCount: this.props.userReviewsCount,
    };
  }

  handleWriteReview() {
    this.actions.setWriteReviewCompany(this.props.name);
  }

  handleFollow() {
    if (!this.props.isSignedIn) {
      this.actions.setRedirect(`/companies/${this.props.slug}`);
      return;
    }
    if (this.props.isFollowing) {
      return;
    }
    this.actions.followCompany(this.getCompanyProps())
      .done(() => {
        this.setState({ loading: false });
      });
    this.setState({ loading: true });
  }

  handleUnfollow() {
    this.actions.unfollowCompany(this.getCompanyProps())
      .done(() => {
        this.setState({ loading: false });
      });
    this.setState({ loading: true, showUnfollow: false });
  }

  handleSelectJob(job) {
    const jobAnchorId = CompanyMenuBar.getAnchorForJob(job, true);
    $('html, body').animate({
      // Account for height of navbar, menuBar, and subtract some bias to scroll slightly above the container (looks nicer)
      scrollTop: $(jobAnchorId).offset().top - this.navbarHeight - this.menuBarHeight - 16,
    }, 500);
  }

  renderJobSelectorText() {
    const numJobs = this.props.jobs.length;
    return (
      <div className={css.jobSelectorText}>
        {`Jobs (${numJobs})`}
        <FontAwesomeIcon className={css.jobSelectorCaret} icon='caret-down'/>
      </div>
    );
  }

  renderJobSelector() {
    if (_.isEmpty(this.props.jobs)) {
      return;
    }

    const menuItems = _.map(this.props.jobs, (job) => {
      return {
        primaryText: `${job.title} (${job.location})`,
        onClick: () => this.handleSelectJob(job),
      };
    });

    return (
      <DropdownMenu
        button={this.renderJobSelectorText()}
        menuItems={menuItems}
      />
    );
  }


  renderFollowButton(text, backgroundColor, hoverColor, onClick, checked = false) {
    const style = {
      width: '150px',
    };
    const icon = checked ? 'check' : null;
    return (
      <span
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
      >
        <CompanyMenuBarButton
          onClick={onClick}
          backgroundColor={backgroundColor}
          hoverColor={hoverColor}
          text={text}
          style={style}
          icon={icon}
          loading={this.state.loading}
        />
      </span>
    );
  }

  renderFollow() {
    if (this.state.showUnfollow) {
      return this.renderFollowButton(
        'Unfollow',
        colours.MATERIAL_RED,
        colours.MATERIAL_RED_DARK,
        this.handleUnfollow,
        false
      );
    }
    const isFollowing = this.props.isFollowing;
    const button = this.renderFollowButton(
      isFollowing ? 'Following' : 'Follow',
      colours.MATERIAL_GREEN,
      colours.MATERIAL_GREEN_DARK,
      this.handleFollow,
      isFollowing
    );

    if (!this.props.isSignedIn) {
      return (
        <Link to={`/login?from=companies&slug=${this.props.slug}`}>{button}</Link>
      );
    }
    return button;
  }

  renderApplyButton() {
    if (!_.isEmpty(this.props.careersUrl)) {
      const applyButtonStyle = {
        width: '150px',
      };
      return (
        <a className={css.applyButton} href={this.props.careersUrl} target='_blank' rel='noopener noreferrer'>
          <CompanyMenuBarButton
            backgroundColor={colours.MATERIAL_BLUE}
            hoverColor={colours.MATERIAL_BLUE_DARK}
            text='Apply'
            style={applyButtonStyle}
          />
        </a>
      );
    }
  }

  renderWriteReviewButton() {
    const writeReviewButtonStyle = {
      width: '170px',
    };
    return (
      <span
        className={css.writeReviewButton}
      >
        <Link to={{ pathname: '/write-review', query: { company: this.props.name } }}>
          <CompanyMenuBarButton
            onClick={this.handleWriteReview}
            backgroundColor={colours.MATERIAL_BLUE_GREY}
            hoverColor={colours.MATERIAL_BLUE_GREY_DARK}
            text='Write a Review'
            style={writeReviewButtonStyle}
          />
        </Link>
      </span>
    );
  }

  render() {
    const menuBarStyle = {};
    if (this.props.isFixed) {
      menuBarStyle.position = 'fixed';
      menuBarStyle.width = '100%';
      menuBarStyle.top = this.navbarHeight;
    }
    return (
      <div
        ref={(e) => {this._menuBarElement = e;}}
        style={menuBarStyle}
        className={css.container}
      >
        <div className={css.innerContainer}>
          <div className={css.jobSelectorContainer}>
            {this.renderJobSelector()}
          </div>
          <div>
            {this.renderFollow()}
            {this.renderApplyButton()}
            {this.renderWriteReviewButton()}
          </div>
        </div>
      </div>
    );
  }
}

