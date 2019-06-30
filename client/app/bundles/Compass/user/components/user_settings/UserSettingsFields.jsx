import PropTypes from 'prop-types';
import React from 'react';
import LabelledInputField from './LabelledInputField';
import FlatButton from 'material-ui/FlatButton';
import { colours } from '../../../constants/compassConstants';
import { USER_PROFILE_DATA_SHAPE } from '../../../constants/propTypesConstants';
import css from './UserSettingsFields.scss';
import LoadingContent from '../../../components/LoadingContent';
import _ from 'lodash';
import Snackbar from 'material-ui/Snackbar';

export default class UserSettingsFields extends React.Component {
  static propTypes = {
    userToken: PropTypes.string.isRequired,
    profileData: USER_PROFILE_DATA_SHAPE,
    updateProfile: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    const profileData = this.props.profileData;

    if (!profileData) {
      this.state = {};
    } else {
      this.state = {
        school: profileData.school,
        program: profileData.program,
        personalWebsite: profileData.personalWebsite,
        github: profileData.github,
        linkedin: profileData.linkedin,
        twitter: profileData.twitter,
        blog: profileData.blog,
        dribbble: profileData.dribbble,
        bio: profileData.bio,
      };
    }

    this.state.loading = false;
    this.state.showSnackbar = false;
    this.state.snackbarMessage = '';

    this.onFieldChanged = this.onFieldChanged.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleBioChange = this.handleBioChange.bind(this);
  }

  onFieldChanged(key, value) {
    this.setState({ [key]: value, showSnackbar: false });
  }

  handleBioChange(e) {
    this.onFieldChanged('bio', e.target.value);
  }

  handleBack() {
    this.context.router.replace(`/users/${this.props.userToken}`);
  }

  handleSubmit() {
    this.setState({ loading: true, showSnackbar: false });
    this.props.updateProfile({
      school: _.trim(this.state.school),
      program: _.trim(this.state.program),
      personalWebsite: _.trim(this.state.personalWebsite),
      github: _.trim(this.state.github),
      linkedin: _.trim(this.state.linkedin),
      twitter: _.trim(this.state.twitter),
      blog: _.trim(this.state.blog),
      dribbble: _.trim(this.state.dribbble),
      bio: _.trim(this.state.bio),
    },
      this.props.userToken,
      this.context.router
    ).fail(error => {
      this.setState({
        loading: false,
        showSnackbar: true,
        snackbarMessage: error.responseJSON.errors.validation[0],
      });
    });
  }

  render() {
    return (
      <div className={css.container}>
        <p className={css.info}>Update your profile to let other users know more about you. The information you add is publically available to anyone who views your profile.</p>
        <div className={css.row}>
          <div className={css.bioContainer}>
            <label className={css.bioLabel} htmlFor='bio'>Bio (max 140 characters)</label>
            <textarea
              id='bio'
              className={css.bio}
              value={this.state.bio}
              maxLength={140}
              onChange={this.handleBioChange}
            />
          </div>
        </div>
        <div className={css.row}>
          <LabelledInputField
            name='School'
            formKey='school'
            placeholder='University of Waterloo'
            value={this.state.school}
            onFieldChanged={this.onFieldChanged}
          />
          <LabelledInputField
            name='Program'
            formKey='program'
            placeholder="Computer Science '17"
            value={this.state.program}
            onFieldChanged={this.onFieldChanged}
          />
        </div>
        <div className={css.row}>
          <LabelledInputField
            name='Personal Website'
            formKey='personalWebsite'
            placeholder='http://mysite.com'
            value={this.state.personalWebsite}
            onFieldChanged={this.onFieldChanged}
          />
          <LabelledInputField
            name='Blog'
            formKey='blog'
            placeholder='http://myblog.com'
            value={this.state.blog}
            onFieldChanged={this.onFieldChanged}
          />
        </div>
        <div className={css.row}>
          <LabelledInputField
            name='LinkedIn'
            formKey='linkedin'
            placeholder='janesmith'
            value={this.state.linkedin}
            onFieldChanged={this.onFieldChanged}
          />
          <LabelledInputField
            name='Twitter'
            formKey='twitter'
            placeholder='janesmith'
            value={this.state.twitter}
            onFieldChanged={this.onFieldChanged}
          />
        </div>
        <div className={css.row}>
          <LabelledInputField
            name='Github'
            formKey='github'
            placeholder='janesmith'
            value={this.state.github}
            onFieldChanged={this.onFieldChanged}
          />
          <LabelledInputField
            name='Dribbble'
            formKey='dribbble'
            placeholder='janesmith'
            value={this.state.dribbble}
            onFieldChanged={this.onFieldChanged}
          />
        </div>
        <div className={css.buttonContainer}>
          <FlatButton
            backgroundColor={colours.MATERIAL_BLUE_GREY}
            hoverColor={colours.MATERIAL_BLUE_GREY_DARK}
            onClick={this.handleBack}
          >
            <span className={css.btn}>Back</span>
          </FlatButton>
          <FlatButton
            backgroundColor={colours.MATERIAL_BLUE}
            hoverColor={colours.MATERIAL_BLUE_DARK}
            onClick={this.handleSubmit}
          >
            <LoadingContent loading={this.state.loading}>
              <span className={css.btn}>Save</span>
            </LoadingContent>
          </FlatButton>
        </div>
        <Snackbar
          open={this.state.showSnackbar}
          message={this.state.snackbarMessage}
          autoHideDuration={4000}
        />
      </div>
    );
  }
}
