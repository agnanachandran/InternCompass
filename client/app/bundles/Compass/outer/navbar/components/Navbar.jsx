import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import $ from 'jquery';
import { Link } from 'react-router';
import css from './Navbar.scss';
import classnames from 'classnames';
import UserDropdownMenu from './UserDropdownMenu';
import NotificationsMenu from './NotificationsMenu';
import Logo from '../../../components/Logo';
import NavbarSearchBarContainer from '../../../search/containers/NavbarSearchBarContainer';

function getNavbarStyle(isDarkNavbar) {
  return classnames({
    [css.container]: true,
    [css.darkNavbar]: isDarkNavbar,
    [css.transparentNavbar]: !isDarkNavbar,
  });
}

function getNavItemStyle(navItemName, selectedNavItemName, isDarkNavbar) {
  let classes = [css.itemText];

  if (!isDarkNavbar) {
    classes.push(css.transparentNavbarItem);
  } else if (navItemName === selectedNavItemName) {
    classes.push(css.selectedItem);
  } else {
    classes.push(css.unselectedItem);
  }

  const classNameForNavItem = `${_.camelCase(navItemName)}NavItem`;
  classes.push(css[classNameForNavItem]);

  return classnames(...classes);
}

export default class Navbar extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    navItems: PropTypes.array.isRequired,
    notifications: PropTypes.array,
    selectedNavItemName: PropTypes.string,
    isDarkNavbar: PropTypes.bool.isRequired,
    isMobileLayout: PropTypes.bool.isRequired,
    isNavbarMenuOpen: PropTypes.bool.isRequired,
    onNavbarHeightChanged: PropTypes.func.isRequired,
    onNavbarMenuClick: PropTypes.func.isRequired,
    searchQueryString: PropTypes.string.isRequired,
    onSearchQueryStringChanged: PropTypes.func.isRequired,
    signout: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleNavbarMenuClick = this.handleNavbarMenuClick.bind(this);
  }

  getMobileClasses() {
    const isNavbarMenuOpen = this.props.isNavbarMenuOpen;
    const isMobileLayout = this.props.isMobileLayout;

    const navItemsContainerMobileClass = isNavbarMenuOpen ?
        css.navItemsContainerMobileOpen :
        css.navItemsContainerMobileClosed;

    const classes = {
      navItemsContainer: isMobileLayout ? navItemsContainerMobileClass : css.navItemsContainer,
      itemListLeft: isMobileLayout ? css.itemListLeftMobile : css.itemListLeft,
      itemListRight: isMobileLayout ? css.itemListRightMobile : css.itemListRight,
    };

    return classes;
  }

  getHeight() {
    return this.$navbar.height();
  }

  handleNavbarMenuClick() {
    this.props.onNavbarMenuClick();
  }

  renderNavbarSearchBarContainer() {
    return (
      <NavbarSearchBarContainer
        onChange={this.props.onSearchQueryStringChanged}
        queryString={this.props.searchQueryString}
      />
    );
  }

  renderNotificationsMenu() {
    if (this.props.currentUser) {
      const classNames = classnames(css.itemText, css.notificationsIcon, {
        [css.pushRight]: this.props.isMobileLayout,
      });
      return (
        <li className={classNames}>
          <NotificationsMenu
            notifications={this.props.notifications}
            dispatch={this.props.dispatch}
          />
        </li>
      );
    }
  }

  renderAddReview() {
    return (
      <Link to={'/write-review'}>
        <li className={css.itemText}>
          <i className={`fa fa-pencil ${css.writeReviewIcon}`} aria-hidden={true} /> Write Review
        </li>
      </Link>
    );
  }

  renderUserProfile() {
    const { currentUser, signout } = this.props;
    if (!currentUser) {
      const items = [
        { name: 'Log In', url: '/login' },
        { name: 'Sign Up', url: '/signup' },
      ];
      return _.map(items, navItem => this.renderNavItem(navItem));
    }

    return (
      <li className={css.itemPicture}>
        <UserDropdownMenu
          currentUser={currentUser}
          signout={signout}
        />
      </li>
    );
  }

  renderNavMenu() {
    if (this.props.isMobileLayout) {
      return (
        <div className={`${css.itemPicture} ${css.navHamburgerMenu}`} onClick={this.handleNavbarMenuClick}>
          <i className='fa fa-bars' aria-hidden={true} />
        </div>
      );
    }
    return null;
  }

  renderNavItem(navItem, isDarkNavbar) {
    const { selectedNavItemName } = this.props;
    const navItemStyle = getNavItemStyle(navItem.name, selectedNavItemName, isDarkNavbar);
    const mobileSuffix = this.props.isMobileLayout ? 'Mobile' : '';
    return (
      <Link key={navItem.name} to={navItem.url}>
        <li className={navItemStyle}>
          <span className={css[`${_.camelCase(navItem.name)}NavItemSpan${mobileSuffix}`]}>
            {navItem.name}
          </span>
          {navItem.isNew && (
            <span className={css.newNavItem}>
              NEW
            </span>
          )}
        </li>
      </Link>
    );
  }

  renderNavItems(isDarkNavbar) {
    return _.map(this.props.navItems, navItem => this.renderNavItem(navItem, isDarkNavbar));
  }

  render() {
    const isDarkNavbar = this.props.isDarkNavbar;
    const navbarStyle = getNavbarStyle(isDarkNavbar);

    const classes = this.getMobileClasses();

    return (
      <div id='navbar' ref={(e) => this.$navbar = $(e)} className={navbarStyle}>
        <div className={css.innerContainer}>
          <Link to={'/'}>
            <div className={css.title}>
              <Logo className={css.logo} />
            </div>
          </Link>
          {this.renderNavMenu()}
          {this.props.isMobileLayout && this.renderNotificationsMenu()}
          {this.props.isMobileLayout && this.renderNavbarSearchBarContainer()}
          <div className={classes.navItemsContainer}>
            <ul className={classes.itemListLeft}>
              {this.renderNavItems(isDarkNavbar)}
            </ul>
            <ul className={classes.itemListRight}>
              {!this.props.isMobileLayout && this.renderNavbarSearchBarContainer()}
              {this.renderAddReview()}
              {!this.props.isMobileLayout && this.renderNotificationsMenu()}
              {this.renderUserProfile()}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

