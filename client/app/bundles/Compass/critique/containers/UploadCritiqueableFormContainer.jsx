import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import css from './UploadCritiqueableFormContainer.scss';
import UploadCritiqueableForm from '../components/UploadCritiqueableForm';
import * as globalActions from '../../outer/actions/globalActions';
import { uploadCritiqueable } from '../actions/critiqueActions';
import _ from 'lodash';

class UploadCritiqueableFormContainer extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    isUploading: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      description: '',
    };
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleDropFiles = this.handleDropFiles.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
  }

  handleDescriptionChange(e) {
    this.setState({
      description: e.target.value,
    });
  }

  handleDropFiles(acceptedFiles, rejectedFiles) {
    if (!_.isEmpty(rejectedFiles) || acceptedFiles.length > 1) {
      this.props.dispatch(globalActions.setSnackbarMessage(
        'Invalid file was selected. Make sure you chose a PDF with file size < 5 MB.'
      ));
      return;
    }
    this.setState({
      files: acceptedFiles,
    });
  }

  handleSubmitForm() {
    if (_.isEmpty(this.state.files)) {
      this.props.dispatch(globalActions.setSnackbarMessage(
        'You need to select a PDF to upload.'
      ));
      return;
    }
    const file = this.state.files[0];
    const description = this.state.description.trim();
    this.props.dispatch(uploadCritiqueable(this.context.router, file, description));
  }

  render() {
    return (
      <div className={css.container}>
        <UploadCritiqueableForm
          description={this.state.description}
          files={this.state.files}
          isUploading={this.props.isUploading}
          onDescriptionChange={this.handleDescriptionChange}
          onDropFiles={this.handleDropFiles}
          onSubmitForm={this.handleSubmitForm}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.compassStore.currentUser,
    isUploading: state.critique.isUploading,
  };
}

export default connect(mapStateToProps)(UploadCritiqueableFormContainer);

