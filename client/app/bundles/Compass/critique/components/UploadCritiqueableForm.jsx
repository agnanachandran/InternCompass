import PropTypes from 'prop-types';
import React, { Component } from 'react';
import css from './UploadCritiqueableForm.scss';
import { colours } from '../../constants/compassConstants';
import FlatButton from 'material-ui/FlatButton';
import FontAwesomeIcon from '../../components/FontAwesomeIcon';
import LoadingContent from '../../components/LoadingContent';
import Dropzone from 'react-dropzone';
import _ from 'lodash';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default class UploadCritiqueableForm extends Component {
  static propTypes = {
    description: PropTypes.string.isRequired,
    files: PropTypes.array.isRequired,
    isUploading: PropTypes.bool.isRequired,
    onDescriptionChange: PropTypes.func.isRequired,
    onDropFiles: PropTypes.func.isRequired,
    onSubmitForm: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // https://react-dropzone.netlify.com/#proptypes
  handleDrop(acceptedFiles, rejectedFiles) {
    this.props.onDropFiles(acceptedFiles, rejectedFiles);
  }

  handleBack() {
    this.context.router.replace('/critiques');
  }

  handleSubmit() {
    this.props.onSubmitForm();
  }

  renderUploadDropContent() {
    if (_.isEmpty(this.props.files)) {
      return (
        <div className={css.uploadDrop}>
          <FontAwesomeIcon className={css.uploadDropIcon} icon='upload' />
          <div className={css.uploadDropText}>
            Drop your PDF resume here, or click to open your file browser (file size &lt; 5 MB).
          </div>
        </div>
      );
    }
    // There should only be one file in this.props.files
    const file = this.props.files[0];
    return (
      <div className={css.uploadDrop}>
        <FontAwesomeIcon className={css.uploadDropSuccessIcon} icon='check-circle' />
        <div className={css.uploadDropFileNameText}>
          {file.name}
        </div>
        <div className={css.uploadDropText}>
          Success! You can drop a different PDF here, or click to open your file browser
          (file size &lt; 5 MB) to replace the existing one.
        </div>
      </div>
    );
  }

  render() {
    const buttonLabelStyle = {
      verticalAlign: 'top',
      color: 'white',
      fontWeight: 'bold',
    };

    return (
      <div className={css.container}>
        <h2 className={css.header}>Upload Your Resume</h2>
        <div>
          <Dropzone
            className={css.uploadDropContainer}
            accept='application/pdf'
            multiple={false}
            maxSize={MAX_FILE_SIZE}
            disablePreview={true}
            onDrop={this.handleDrop}
          >
            {this.renderUploadDropContent()}
          </Dropzone>
          <div className={css.critiqueInfoContainer}>
            <div className={css.critiqueInfo}>
              <label className={css.label} htmlFor='description'>Description:</label>
              <textarea
                id='description'
                className={css.description}
                value={this.props.description}
                onChange={this.props.onDescriptionChange}
                placeholder={'Let reviewers know what kind of feedback you want ' +
                             "or what you're looking for in your next internship."}
              />
            </div>
          </div>
        </div>
        <div className={css.disclaimer}>
          <span>NOTE:</span> You can only have one resume uploaded at a time, so you'll
          have to delete your resume if you want to upload a new one.
        </div>
        <div className={css.bottomButtonBar}>
          <FlatButton
            backgroundColor={colours.MATERIAL_BLUE_GREY}
            hoverColor={colours.MATERIAL_BLUE_GREY_DARK}
            onClick={this.handleBack}
            labelStyle={buttonLabelStyle}
            label='Back'
          />
          <FlatButton
            backgroundColor={colours.MATERIAL_GREEN}
            hoverColor={colours.MATERIAL_GREEN_DARK}
            onClick={this.handleSubmit}
            disabled={this.props.isUploading}
          >
            <LoadingContent loading={this.props.isUploading}>
              <span className={css.submitLabel}>Submit</span>
            </LoadingContent>
          </FlatButton>
        </div>
      </div>
    );
  }
}
