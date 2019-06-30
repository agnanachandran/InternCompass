import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import $ from 'jquery';
import Navbar from '../components/Navbar';
import * as userActions from '../../../user/actions/userActions';
import * as searchActions from '../../../search/actions/searchActionCreators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routingUrls } from '../../../constants/compassConstants';

const MOBILE_WIDTH_THRESHOLD_PX = 1000;

// Function return from this.context.router.listen
// Call this function to make the router remove the listener
let routerUnlisten;

function widthBelowMobileThreshold(width) {
  return width < MOBILE_WIDTH_THRESHOLD_PX;
}

class NavbarContainer extends React.Component {
  static propTypes =  {
    currentUser: PropTypes.object,
    notifications: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    onNavbarHeightChanged: PropTypes.func.isRequired,
    searchQueryString: PropTypes.string.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.actions = bindActionCreators({ ...userActions, ...searchActions }, props.dispatch);
    this.handleSignout = this.handleSignout.bind(this);
    this.handleSearchQueryStringChanged = this.handleSearchQueryStringChanged.bind(this);
    this.handleNavbarMenuClick = this.handleNavbarMenuClick.bind(this);
    this.state = {
      isDarkNavbar: false,
      isMobileLayout: false,
      isNavbarMenuOpen: false,
    };
  }

  componentDidMount() {
    const $window = $(window);

    routerUnlisten = this.context.router.listen(() => {
      const isHomePage = this.getIsHomePage(this.context.router);

      this.setState({
        isDarkNavbar: !isHomePage,
        isNavbarMenuOpen: false,
      }, () => this.props.onNavbarHeightChanged(this._navbar.getHeight()));

      if (isHomePage) {
        // Set up transition to dark navbar
        // A better threshold would be the search bar's top offset
        const darkNavbarThresholdHeight = 150;

        const updateNavbarStylingIfPastHero = () => {
          const scrollTop = $window.scrollTop();
          this.setState({
            isDarkNavbar: scrollTop > darkNavbarThresholdHeight,
          });
        };

        updateNavbarStylingIfPastHero();
        $window.scroll(_.throttle(updateNavbarStylingIfPastHero, 50));
      } else {
        $window.off('scroll');
      }
    });

    const updateMobileLayoutState = () => {
      const isMobileLayout = widthBelowMobileThreshold($window.width());
      this.setState({
        isMobileLayout: isMobileLayout,
      });
      this.props.onNavbarHeightChanged(this._navbar.getHeight());
    };

    updateMobileLayoutState();
    $window.resize(_.throttle(updateMobileLayoutState, 50));
  }

  componentWillUnmount() {
    const $window = $(window);
    $window.off('scroll');
    $window.off('resize');
    if (routerUnlisten) {
      routerUnlisten();
    }
  }

  getSelectedNavItemName(navItems) {
    const navItem = _.find(navItems, (navItem) => this.context.router.isActive({ pathname: navItem.path }, false));
    return navItem ? navItem.name : null;
  }

  getIsHomePage(router) {
    return router.isActive({ pathname: '/' }, true);
  }

  handleSignout() {
    this.actions.signout(this.context.router);
  }

  handleSearchQueryStringChanged(newQueryString) {
    this.actions.setNavbarSearchQueryString(newQueryString);
  }

  handleNavbarMenuClick() {
    this.setState({
      isNavbarMenuOpen: !this.state.isNavbarMenuOpen,
    }, () => this.props.onNavbarHeightChanged(this._navbar.getHeight()));
  }

  render() {
    const navItems = [
      {
        name: 'Search',
        url: routingUrls.SEARCH,
        path: '/search',
      },
      {
        name: 'Critiques',
        url: '/critiques',
        path: '/critiques',
        isNew: true,
      },
    ];

    const selectedNavItemName = this.getSelectedNavItemName(navItems);
    return (
      <Navbar
        ref={(e) => this._navbar = e}
        currentUser={this.props.currentUser}
        dispatch={this.props.dispatch}
        notifications={this.props.notifications}
        navItems={navItems}
        selectedNavItemName={selectedNavItemName}
        isDarkNavbar={this.state.isDarkNavbar || this.state.isMobileLayout}
        isMobileLayout={this.state.isMobileLayout}
        isNavbarMenuOpen={this.state.isNavbarMenuOpen}
        onNavbarHeightChanged={this.props.onNavbarHeightChanged}
        onNavbarMenuClick={this.handleNavbarMenuClick}
        searchQueryString={this.props.searchQueryString}
        onSearchQueryStringChanged={this.handleSearchQueryStringChanged}
        signout={this.handleSignout}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.compassStore.currentUser,
    notifications: state.compassStore.notifications,
    searchQueryString: state.search.navbarSearchQueryString,
    path: state.routing,
  };
}

export default connect(mapStateToProps)(NavbarContainer);

