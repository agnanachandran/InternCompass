import React, { Component } from 'react';
import CenteredSpinner from '../../components/CenteredSpinner';
import * as adminActions from '../actions/adminActions';
import AdminCompanyListItem from '../components/AdminCompanyListItem';
import Paginator from '../components/Paginator';
import _ from 'lodash';
import AdminCard from '../components/AdminCard';
import CardTitle from 'material-ui/Card/CardTitle';
import CardText from 'material-ui/Card/CardText';
import css from './AdminCompaniesPanelContainer.scss';

export default class AdminCompaniesPanelContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.handleApprovedCompaniesPageClick = this.handleApprovedCompaniesPageClick.bind(this);
    this.handleNotApprovedCompaniesPageClick = this.handleNotApprovedCompaniesPageClick.bind(this);
    this.receiveFullPageData = this.receiveFullPageData.bind(this);
  }

  componentDidMount() {
    adminActions.fetchFullCompanyPageData(this.receiveFullPageData);
  }

  receiveFullPageData(data) {
    this.setState({
      loading: false,
      ...data
    });
  }

  handleApprovedCompaniesPageClick(data) {
    if (this.state.approvedCompaniesPagination.currentPage === data.selected + 1) {
      return;
    }
    this.setState({ loading: true }, () => {
      adminActions.fetchApprovedCompanyPageData(data.selected + 1, this.receiveFullPageData);
    });
  }

  handleNotApprovedCompaniesPageClick(data) {
    if (this.state.notApprovedCompaniesPagination.currentPage === data.selected + 1) {
      return;
    }
    this.setState({ loading: true }, () => {
      adminActions.fetchNotApprovedCompanyPageData(data.selected + 1, this.receiveFullPageData);
    });
  }

  handleApproveCompany(company) {
    return () => {
      this.setState({ loading: true }, () => {
        adminActions.approveCompany(company.id, this.state.approvedCompaniesPagination.currentPage, this.state.notApprovedCompaniesPagination.currentPage, (data) => {
          this.receiveFullPageData(data);
        });
      });
    };
  }

  renderApprovedCompanies(companies) {
    return _.map(companies, company =>
      (
        <AdminCompanyListItem
          company={company}
          approved={true}
          key={company.id}
          handleApproveCompany={this.handleApproveCompany(company)}
        />
      )
    );
  }

  renderNotApprovedCompanies(companies) {
    return _.map(companies, company =>
      (
        <AdminCompanyListItem
          company={company}
          approved={false}
          key={company.id}
          handleApproveCompany={this.handleApproveCompany(company)}
        />
      )
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <CenteredSpinner size={1.5} marginTop={'56px'} />
      );
    }
    return (
      <div>
        <div className={css.parent}>
          <AdminCard>
            <CardTitle title={'Approved Companies'} className={css.cardHeader} />
            <CardText>
              <div>
                <div>
                  {this.renderApprovedCompanies(this.state.approvedCompanies)}
                </div>
                <Paginator
                  pageNum={this.state.approvedCompaniesPagination.totalPages}
                  initialSelected={this.state.approvedCompaniesPagination.currentPage - 1}
                  handlePageClick={this.handleApprovedCompaniesPageClick}
                />
              </div>
            </CardText>
          </AdminCard>
        </div>
        <div>
          <AdminCard>
            <CardTitle title={'Pending Approval'} className={css.cardHeader} />
            <CardText>
              <div>
                <div>
                  {this.renderNotApprovedCompanies(this.state.notApprovedCompanies)}
                </div>
              </div>
                <Paginator
                  pageNum={this.state.notApprovedCompaniesPagination.totalPages}
                  initialSelected={this.state.notApprovedCompaniesPagination.currentPage - 1}
                  handlePageClick={this.handleNotApprovedCompaniesPageClick}
                />
            </CardText>
          </AdminCard>
        </div>
      </div>
    );
  }
}