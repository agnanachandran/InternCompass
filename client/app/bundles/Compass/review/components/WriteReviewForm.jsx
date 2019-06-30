import PropTypes from 'prop-types';
import React from 'react';
import InternshipInfoForm from './InternshipInfoForm';
import SubmitReview from './SubmitReview';
import ExperienceInfoForm from './ExperienceInfoForm';
import Stepper from './Stepper';
import Snackbar from 'material-ui/Snackbar';
import _ from 'lodash';

export default class WriteReviewForm extends React.Component {
  static propTypes = {
    prefilledCompanyName: PropTypes.string,
    currency: PropTypes.string.isRequired,
    suggestedPerks: PropTypes.array,
    fetchCurrency: PropTypes.func.isRequired,
    submitReview: PropTypes.func.isRequired,
    serverError: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      companyName: _.isEmpty(this.props.prefilledCompanyName) ? '' : this.props.prefilledCompanyName,
      jobTitle: '',
      location: '',
      payPeriod: 'monthly',
      description: '',
      salary: '',
      perks: [],
      mentorshipRating: 0,
      workLifeBalanceRating: 0,
      meaningfulWorkRating: 0,
      overallRating: 0,
      anonymous: true,
      error: false,
      errorMessage: this.props.serverError
        ? 'Sorry, something went wrong. Please try submitting again.'
        : "We couldn't submit your review. Please make sure you've filled in all required fields."
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFieldChange(kvp) {
    this.setState({
      error: false,
      ...kvp,
    });
  }

  handleSubmit() {
    const {
      companyName,
      jobTitle,
      location,
      salary,
      perks,
      payPeriod,
      mentorshipRating,
      workLifeBalanceRating,
      meaningfulWorkRating,
      description,
      overallRating,
      anonymous,
    } = this.state;

    const {
      currency,
    } = this.props;

    const step1Valid = this.step1.validate();
    const step2Valid = this.step2.validate();
    if (!step1Valid || !step2Valid) {
      this.setState({ error: true });
      return;
    }

    this.props.submitReview({
      userReview: {
        salary,
        payPeriod,
        mentorshipRating,
        workLifeBalanceRating,
        meaningfulWorkRating,
        description,
        overallRating,
        anonymous,
        currency,
      },
      location: location,
      jobTitle: jobTitle,
      companyName: companyName,
      perks: perks,
    });
  }

  render() {
    const titles = [
      'Internship Information',
      'Your Review',
    ];

    return (
      <div>
        <Stepper titles={titles}>
          <InternshipInfoForm
            ref={(e) => this.step1 = e}
            companyName={this.state.companyName}
            currency={this.props.currency}
            payPeriod={this.state.payPeriod}
            fetchCurrency={this.props.fetchCurrency}
            jobTitle={this.state.jobTitle}
            location={this.state.location}
            onFieldChange={this.handleFieldChange}
            salary={this.state.salary}
            suggestedPerks={this.props.suggestedPerks}
          />
          <ExperienceInfoForm
            ref={(e) => this.step2 = e}
            description={this.state.description}
            meaningfulWorkRating={this.state.meaningfulWorkRating}
            mentorshipRating={this.state.mentorshipRating}
            onFieldChange={this.handleFieldChange}
            overallRating={this.state.overallRating}
            workLifeBalanceRating={this.state.workLifeBalanceRating}
          />
        </Stepper>
        <SubmitReview
          anonymous={this.state.anonymous}
          onFieldChange={this.handleFieldChange}
          onSubmit={this.handleSubmit}
          loading={this.props.loading}
        />
        <Snackbar
          open={this.props.serverError || this.state.error}
          message={this.state.errorMessage}
          autoHideDuration={4000}
        />
      </div>
    );
  }
}
