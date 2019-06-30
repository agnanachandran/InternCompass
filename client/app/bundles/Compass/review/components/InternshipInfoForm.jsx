import PropTypes from 'prop-types';
import React from 'react';
import { payPeriods } from '../constants/PayPeriods';
import CityDropdown from '../../components/CityDropdown';
import FontAwesomeIcon from '../../components/FontAwesomeIcon';
import Selector from '../../components/Selector';
import ValidationError from './ValidationError';
import SuggestionTextBox from '../../components/SuggestionTextBox';
import PerksWidget from './perks/PerksWidget';
import { dataSources } from '../../constants/compassConstants';
import _ from 'lodash';
import css from './InternshipInfoForm.scss';

export default class InternshipInfoForm extends React.PureComponent {
  static propTypes = {
    companyName: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    fetchCurrency: PropTypes.func.isRequired,
    jobTitle: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    payPeriod: PropTypes.string.isRequired,
    salary: PropTypes.string.isRequired,
    suggestedPerks: PropTypes.array,
  };

  constructor() {
    super();
    this.state = {
      companyNameError: false,
      jobTitleError: false,
      locationError: false,
      salaryError: false,
    };
    this.handleCityPicked = this.handleCityPicked.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handlePerksChange = this.handlePerksChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleCompanyNameChange = this.handleCompanyNameChange.bind(this);
    this.handleJobTitleChange = this.handleJobTitleChange.bind(this);
    this.handleSalaryChange = this.handleSalaryChange.bind(this);
    this.handlePayPeriodChange = this.handlePayPeriodChange.bind(this);
  }

  validate() {
    const { companyName, jobTitle, location, salary } = this.props;
    const errors = {
      companyNameError: _.isEmpty(companyName),
      jobTitleError: _.isEmpty(jobTitle),
      locationError: _.isEmpty(location),
      salaryError: _.isEmpty(salary) || isNaN(salary) || parseFloat(salary) < 0,
    };
    this.setState(errors);
    return !_.some(errors);
  }

  handleCityPicked(city, country) {
    this.props.fetchCurrency(country);
    this.handleLocationChange(city);
    this.salary.focus();
  }

  handleLocationChange(value) {
    this.handleFormChange('location', value);
  }

  handleTextFieldChange(field, e) {
    const value = (e.target) ? e.target.value : e;
    this.handleFormChange(field, value);
  }

  handlePerksChange(perks) {
    this.handleFormChange('perks', perks);
  }

  handleFormChange(key, value) {
    const error = `${key}Error`;
    this.setState({ [error]: false });
    this.props.onFieldChange({ [key]: value });
  }

  handleCompanyNameChange(value) {
    this.handleTextFieldChange('companyName', value);
  }

  handleJobTitleChange(value) {
    this.handleTextFieldChange('jobTitle', value);
  }

  handleSalaryChange(value) {
    this.handleTextFieldChange('salary', value);
  }

  handlePayPeriodChange(value) {
    this.handleFormChange('payPeriod', value);
  }

  renderCompanyName() {
    return (
      <div className={css.companyContainer}>
        <label className={css.label} htmlFor='company'>Company</label>
        <ValidationError
          error={this.state.companyNameError}
          message='Company name cannot be empty'
        />
        <div className={css.fieldContainer}>
          <SuggestionTextBox
            id='company'
            value={this.props.companyName}
            dataSource={dataSources.COMPANY}
            onValueChanged={this.handleCompanyNameChange}
            autoFocus={true}
          />
        </div>
      </div>
    );
  }

  renderJobTitle() {
    return (
      <div className={css.jobTitleContainer}>
        <label className={css.label} htmlFor='jobTitle'>Job Title</label>
        <ValidationError
          error={this.state.jobTitleError}
          message='Job title cannot be empty'
        />
        <div className={css.fieldContainer}>
          <SuggestionTextBox
            id='jobTitle'
            value={this.props.jobTitle}
            dataSource={dataSources.JOB}
            onValueChanged={this.handleJobTitleChange}
            queryParams={{ company_name: this.props.companyName }}
          />
        </div>
      </div>
    );
  }

  renderLocation() {
    const { location } = this.props;
    return (
      <div className={css.locationContainer}>
        <label className={css.label} htmlFor='location'>City</label>
        <ValidationError
          error={this.state.locationError}
          message='Location cannot be empty'
        />
        <div className={css.fieldContainer}>
          <CityDropdown
            selectedCity={location}
            onCitySelected={this.handleCityPicked}
            onInputChange={this.handleLocationChange}
          />
        </div>
      </div>
    );
  }

  renderSalary() {
    const { currency, payPeriod, salary } = this.props;
    return (
      <div className={css.salaryContainer}>
        <label className={css.label} htmlFor='salary'>
          Salary
          <FontAwesomeIcon
            icon='info-circle'
            className={css.infoIcon}
            tooltipOptions={{ text: 'Currency is automatically determined by the city entered', place: 'right' }}
          />
        </label>
        <ValidationError
          error={this.state.salaryError}
          message='Salary must be a positive number'
        />
        <div className={css.fieldContainer}>
          <div className={css.salaryFieldContainer}>
            <input
              value={salary}
              ref={(e) => this.salary = e}
              onChange={this.handleSalaryChange}
              className={css.salaryField}
            />
            <span className={css.currency}>
              {currency}
            </span>
            <Selector
              className={css.salaryFieldSelector}
              onSelected={this.handlePayPeriodChange}
              selected={payPeriod}
              valueToName={payPeriods}
            />
          </div>
        </div>
      </div>
    );
  }

  renderPerks() {
    return (
      <PerksWidget
        suggestedPerks={this.props.suggestedPerks}
        onChange={this.handlePerksChange}
      />
    );
  }

  render() {
    return (
      <div className={css.container}>
        <div className={css.companyAndJobContainer}>
          {this.renderCompanyName()}
          {this.renderJobTitle()}
        </div>
        <div className={css.locationAndSalaryContainer}>
          {this.renderLocation()}
          {this.renderSalary()}
        </div>
        {this.renderPerks()}
      </div>
    );
  }
}
