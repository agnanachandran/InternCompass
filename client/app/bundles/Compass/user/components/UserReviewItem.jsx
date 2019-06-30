import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import css from './UserReviewItem.scss';
import CompanyLogo from '../../components/CompanyLogo';
import FontAwesomeIcon from '../../components/FontAwesomeIcon';
import DropdownMenu from '../../components/DropdownMenu';

export default class UserReviewWidget extends React.Component {
  static propTypes = {
    companyLogoUrl: PropTypes.string,
    companyName: PropTypes.string,
    companySlug: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    jobName: PropTypes.string,
    description: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    deleteReview: PropTypes.func.isRequired,
    isViewingCurrentUser: PropTypes.bool.isRequired,
  };

  constructor() {
    super();
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.props.deleteReview(this.props.token);
  }

  renderTitleAndStars() {
    return (
      <div className={css.outerContainer}>
        <div className={css.titleContainer}>
          <div className={css.companyName}>{this.props.companyName}</div>
          <div>
            {this.renderDeleteMenu()}
          </div>
        </div>
        {this.props.jobName}
      </div>
    );
  }

  renderInfo() {
    return (
      <div>
        {this.renderTitleAndStars()}
        <div className={css.description}>{this.props.description}</div>
        <div className={css.date}>{moment(this.props.createdAt).format('MMMM YYYY')}</div>
      </div>
    );
  }

  renderMenuButton() {
    return (
      <div className={css.menuButton}>
        <FontAwesomeIcon icon='chevron-down'/>
      </div>
    );
  }

  renderDeleteMenu() {
    if (this.props.isViewingCurrentUser) {
      return (
        <div className={css.menu}>
          <DropdownMenu button={this.renderMenuButton()} menuItems={[{ primaryText: 'Delete Review', onClick: this.handleDelete }]}/>
        </div>
      );
    }
  }

  render() {
    return (
      <div className={css.card}>
        <div className={css.columnOne}>
          <CompanyLogo
            companySlug={this.props.companySlug}
            logoUrl={this.props.companyLogoUrl}
            companyName={this.props.companyName}
            size='small'
          />
        </div>
        <div className={css.columnTwo}>
          <Link to={`/user_reviews/${this.props.token}`}>
            {this.renderInfo()}
          </Link>
        </div>
      </div>
    );
  }
}
