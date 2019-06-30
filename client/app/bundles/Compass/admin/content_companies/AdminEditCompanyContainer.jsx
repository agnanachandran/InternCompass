import PropTypes from 'prop-types';
import React, { Component } from 'react';
import * as adminActions from '../actions/adminActions';
import css from './AdminEditCompanyContainer.scss';
import AdminPaper from '../components/AdminPaper';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';
import _ from 'lodash';

export default class AdminEditCompanyContainer extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.receiveCompanyData = this.receiveCompanyData.bind(this);
    this.updateCompany = this.updateCompany.bind(this);
  }

  componentDidMount() {
    adminActions.fetchCompanyToEdit(this.props.params.slug, this.receiveCompanyData);
  }

  receiveCompanyData(data) {
    this.setState({
      loading: false,
      ...data
    });
  }

  getFieldChangeListener(key) {
    return (e) => {
      const newCompany = _.merge(this.state.company, { [key]: e.target.value });
      this.setState({ company: newCompany });
    };
  }

  updateCompany() {
    this.setState({
      loading: true
    });
    adminActions.updateCompany(this.state.company, (data) => {
      this.setState({
        loading: false,
        company: data.company
      });
      if (data.success) {
        alert('Update successful');
      } else {
        alert('Update not successful');
      }
    });
  }

  render() {
    return (
      <AdminPaper loading={this.state.loading}>
        <div className={css.formParent}>
          <h1>EDIT COMPANY</h1>
          <div className={css.formGroup}>
            <span className={css.inputHeading}>Name</span>
            <input type='text' value={this.state.company && this.state.company.name || ''} onChange={this.getFieldChangeListener('name')} placeholder='Name'/>
          </div>
          <div className={css.formGroup}>
            <span className={css.inputHeading}>Logo URL</span>
            {
              this.state.company &&
              this.state.company.logoUrl &&
              <div>
                <img className={css.logo} src={this.state.company && this.state.company.logoUrl} />
              </div>
            }
            <input type='text' value={this.state.company && this.state.company.logoUrl || ''} onChange={this.getFieldChangeListener('logoUrl')} placeholder='Logo URL'/>
          </div>
          <div className={css.formGroup}>
            <span className={css.inputHeading}>Slug</span>
            <input type='text' value={this.state.company && this.state.company.slug || ''} onChange={this.getFieldChangeListener('slug')} placeholder='Slug'/>
          </div>
          <div className={css.formGroup}>
            <span className={css.inputHeading}>Description</span>
            <textarea value={this.state.company && this.state.company.description || ''} onChange={this.getFieldChangeListener('description')} placeholder='Description'/>
          </div>
          <div className={css.formGroup}>
            <span className={css.inputHeading}>Categories</span>
            <input type='text' value={this.state.company && this.state.company.categories || ''} onChange={this.getFieldChangeListener('categories')} placeholder='Comma-separated categories'/>
          </div>
          <div className={css.formGroup}>
            <span className={css.inputHeading}>Website URL</span>
            <input type='text' value={this.state.company && this.state.company.websiteUrl || ''} onChange={this.getFieldChangeListener('websiteUrl')} placeholder='Website URL'/>
          </div>
          <div className={css.formGroup}>
            <span className={css.inputHeading}>Careers URL</span>
            <input type='text' value={this.state.company && this.state.company.careersUrl || ''} onChange={this.getFieldChangeListener('careersUrl')} placeholder='Careers URL'/>
          </div>
          <div className={css.formGroupButtons}>
            {
              this.state.company &&
              <Link to={`/companies/${this.state.company.slug}`}>
                <RaisedButton
                  label='View Company'
                  primary={true}
                  className={css.formButton}
                />
              </Link>
            }
            <RaisedButton
              label='Update'
              primary={true}
              onClick={this.updateCompany}
              className={css.formButton}
            />
          </div>
        </div>
      </AdminPaper>
    );
  }
}
