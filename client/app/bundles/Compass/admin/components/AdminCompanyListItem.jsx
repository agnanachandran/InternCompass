import PropTypes from 'prop-types';
import React, { Component } from 'react';
import css from './AdminCompanyListItem.scss';
import commonCss from '../AdminListItem.scss';
import { Link } from 'react-router';

export default class AdminCompanyListItem extends Component {
  static propTypes = {
    company: PropTypes.object.isRequired,
    approved: PropTypes.bool.isRequired,
    handleApproveCompany: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      showDetails: false
    };
    this.handleCompanyListItemClick = this.handleCompanyListItemClick.bind(this);
  }

  handleCompanyListItemClick() {
    this.setState({ showDetails: !this.state.showDetails });
  }

  render() {
    const {
      company,
      approved,
      handleApproveCompany
    } = this.props;
    return (
      <div className={commonCss.listItemParent} onClick={this.handleCompanyListItemClick}>
        <div className={commonCss.listItemRow}>
          <div className={css.colId}><span className={commonCss.bold}>{company.id}</span></div>
          <div className={css.colName}>{company.name}</div>
          {
            !approved &&
            <div>
              <button className={commonCss.button} onClick={handleApproveCompany}>
                Approve
              </button>
            </div>
          }
          <div>
            <Link to={`/admin/companies/edit/${company.slug}`}>
              <button className={commonCss.button}>
                Edit
              </button>
            </Link>
          </div>
        </div>
        {
          this.state.showDetails &&
          <div className={css.companyFullDetail}>
            <div><img src={company.logoUrl} height={'50px'}/></div>
            <div><span className={commonCss.bold}>ID:</span> {company.id}</div>
            <div><span className={commonCss.bold}>Name:</span> {company.name}</div>
            <div><span className={commonCss.bold}>Desciption:</span> {company.description}</div>
            <div><span className={commonCss.bold}>Website:</span> {company.websiteUrl}</div>
            <div><span className={commonCss.bold}>Careers Page:</span> {company.careersUrl}</div>
            <div><span className={commonCss.bold}>Size:</span> {company.size}</div>
            <div><span className={commonCss.bold}>HQ city:</span> {company.hqCity}</div>
            <div><span className={commonCss.bold}>HQ region:</span> {company.hqRegion}</div>
            <div><span className={commonCss.bold}>HQ country:</span> {company.hqCountry}</div>
          </div>
        }
      </div>
    );
  }
}
