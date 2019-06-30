import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router';
import css from './AdminContainer.scss';
import classnames from 'classnames';
import FontAwesomeIcon from '../components/FontAwesomeIcon';

// Function returned from this.context.router.listen
// Call this function to make the router remove the listener
let routerUnlisten;

const PAGES = {
  dashboard: {
    name: 'Dashboards',
    url: '/admin',
    iconName: 'home',
  },
  companies: {
    name: 'Companies',
    url: '/admin/companies',
    iconName: 'briefcase',
  },
  users: {
    name: 'Users',
    url: '/admin/users',
    iconName: 'user',
  },
  user_reviews: {
    name: 'User Reviews',
    url: '/admin/user_reviews',
    iconName: 'pencil-square',
  },
  feedback: {
    name: 'Feedback',
    url: '/admin/feedback',
    iconName: 'envelope',
  },
};

export default class AdminContainer extends Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object.isRequired,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    if (props.location.pathname === PAGES.dashboard.url) {
      this.state = {
        selectedTab: PAGES.dashboard.name
      };
    } else if (props.location.pathname.includes(PAGES.companies.url)) {
      this.state = {
        selectedTab: PAGES.companies.name
      };
    } else if (props.location.pathname.includes(PAGES.users.url)) {
      this.state = {
        selectedTab: PAGES.users.name
      };
    } else if (props.location.pathname.includes(PAGES.user_reviews.url)) {
      this.state = {
        selectedTab: PAGES.user_reviews.name
      };
    } else if (props.location.pathname.includes(PAGES.feedback.url)) {
      this.state = {
        selectedTab: PAGES.feedback.name
      };
    }
  }

  componentDidMount() {
    routerUnlisten = this.context.router.listen(() => {
      if (this.context.router.isActive({ pathname: PAGES.dashboard.url }, true)) {
        this.setState({
          selectedTab: PAGES.dashboard.name
        });
      } else if (this.context.router.isActive({ pathname: PAGES.companies.url }, true)) {
        this.setState({
          selectedTab: PAGES.companies.name
        });
      } else if (this.context.router.isActive({ pathname: PAGES.users.url }, true)) {
        this.setState({
          selectedTab: PAGES.users.name
        });
      } else if (this.context.router.isActive({ pathname: PAGES.user_reviews.url }, true)) {
        this.setState({
          selectedTab: PAGES.user_reviews.name
        });
      } else if (this.context.router.isActive({ pathname: PAGES.feedback.url }, true)) {
        this.setState({
          selectedTab: PAGES.feedback.name
        });
      }
    });
  }

  componentWillUnmount() {
    if (routerUnlisten) {
      routerUnlisten();
    }
  }

  renderListItem(data) {
    const className = classnames(css.menuListItem, {
      [css.menuListItemSelected]: this.state.selectedTab === data.name
    });
    if (this.state.selectedTab === data.name) {
      return (
        <span className={className}>
          <div>
            <FontAwesomeIcon icon={data.iconName} className={css.menuListItemIcon}/>
            {data.name}
          </div>
        </span>
      );
    }
    return (
      <Link to={data.url} className={className}>
        <div>
          <FontAwesomeIcon icon={data.iconName} className={css.menuListItemIcon} />
          {data.name}
        </div>
      </Link>
    );
  }

  render() {
    const { children } = this.props;
    return (
      <div>
        <div className={css.colMenu}>
          <div className={css.menuParent}>
            <div className={css.colMenuTitle}>
              Super Secret Admin Panel
            </div>
            <div>
              {this.renderListItem(PAGES.dashboard)}
              {this.renderListItem(PAGES.companies)}
              {this.renderListItem(PAGES.users)}
              {this.renderListItem(PAGES.user_reviews)}
              {this.renderListItem(PAGES.feedback)}
            </div>
          </div>
        </div>
        <div className={css.colContent}>
          <div className={css.colContentInner}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}