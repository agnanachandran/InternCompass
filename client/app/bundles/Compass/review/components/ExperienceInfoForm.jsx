import PropTypes from 'prop-types';
import React from 'react';
import StarsInput from '../../components/StarsInput';
import ValidationError from './ValidationError.jsx';
import _ from 'lodash';
import css from './ExperienceInfoForm.scss';

export default class ExperienceInfoForm extends React.PureComponent {
  static propTypes = {
    description: PropTypes.string,
    mentorshipRating: PropTypes.number.isRequired,
    workLifeBalanceRating: PropTypes.number.isRequired,
    meaningfulWorkRating: PropTypes.number.isRequired,
    overallRating: PropTypes.number.isRequired,
    onFieldChange: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      descriptionError: false,
      meaningfulWorkRatingError: false,
      mentorshipRatingError: false,
      workLifeBalanceRatingError: false,
      overallRatingError: false
    };
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleOverallRatingChange = this.handleOverallRatingChange.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  validate() {
    const {
      description,
      meaningfulWorkRating,
      mentorshipRating,
      workLifeBalanceRating,
      overallRating,
    } = this.props;
    const errors =  {
      descriptionError: _.isEmpty(description),
      meaningfulWorkRatingError: meaningfulWorkRating < 0.5,
      mentorshipRatingError: mentorshipRating < 0.5,
      workLifeBalanceRatingError: workLifeBalanceRating < 0.5,
      overallRatingError: overallRating < 0.5,
    };

    this.setState(errors);
    return !_.some(errors);
  }

  handleDescriptionChange(e) {
    this.handleFieldChange('description', e.target.value);
  }

  handleFieldChange(key, value) {
    const error = `${key}Error`;
    this.setState({ [error]: false });
    this.props.onFieldChange({ [key]: value });
  }

  handleOverallRatingChange() {
    this.description.focus();
  }

  handleRatingChange(type, callback, rating) {
    this.handleFieldChange(type, rating);
    if (callback) {
      callback();
    }
  }

  renderStarRating(type, text, callback) {
    return (
      <div className={css.starContainer}>
        <span>
          <label htmlFor={type}>{text}</label>
          <ValidationError error={this.state[`${type}Error`]} message='A rating must be entered'/>
        </span>
        <StarsInput
          initialRating={this.props[type]}
          onChange={this.handleRatingChange.bind(this, type, callback)}
          readOnly={false}
        />
      </div>
    );
  }

  render() {
    const { description } = this.props;
    const { descriptionError } = this.state;
    return (
      <div className={css.container}>
        {this.renderStarRating('mentorshipRating', 'Mentorship')}
        {this.renderStarRating('workLifeBalanceRating', 'Work/life Balance')}
        {this.renderStarRating('meaningfulWorkRating', 'Meaningful Work')}
        {this.renderStarRating('overallRating', 'Overall Rating', this.handleOverallRatingChange)}

        <div className={css.descriptionContainer}>
          <span className={css.label}>Tell us about your internship experience</span>
          <ValidationError error={descriptionError} message='Description must not be empty'/>
          <textarea
            ref={(e) => this.description = e}
            value={description}
            onChange={this.handleDescriptionChange}
            placeholder='e.g. When did you work there? What was the company culture like?'
            className={css.description}
          />
        </div>
      </div>
    );
  }
}
