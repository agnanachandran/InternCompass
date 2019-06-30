import PropTypes from 'prop-types';
import React from 'react';
import css from './UploadCritiqueableBanner.scss';
import UploadCritiqueableButton from './UploadCritiqueableButton';

export default class UploadCritiqueableBanner extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
  };

  render() {
    return (
      <div className={css.container}>
        <img className={css.image} src='/images/upload_critiqueable.png' />
        <div className={css.contentContainer}>
          <div>
            <div className={css.header}>
              <h2>Upload Your Resume</h2>
            </div>
            <p className={css.descriptionText}>
              Get your resume reviewed by other students and interns. Just upload a PDF copy of your resume and share what kind of internship you're looking for. Try it out by clicking the Upload button below!
            </p>
          </div>
          <div>
            <UploadCritiqueableButton />
          </div>
        </div>
      </div>
    );
  }
}

