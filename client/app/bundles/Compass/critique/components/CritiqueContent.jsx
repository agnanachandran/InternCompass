import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import css from './CritiqueContent.scss';
// https://github.com/mikecousins/react-pdf-js/blob/master/src/Pdf.jsx
import PDF from 'react-pdf-js';
import CritiqueCommentsContainer from './CritiqueCommentsContainer';
import CenteredSpinner from '../../components/CenteredSpinner';
import PaginatorWidget from '../../components/PaginatorWidget';

const S3_URL_PREFIX = 'https://s3.amazonaws.com/';

class CritiqueContent extends React.Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    resumeKey: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    isDevelopment: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      totalPages: 1,
    };

    this.handleDocumentComplete = this.handleDocumentComplete.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handleDocumentComplete(totalPages) {
    this.setState({
      totalPages,
    });
  }

  handlePageChange(page) {
    this.setState({
      page,
    });
  }

  render() {
    const S3_BUCKET = this.props.isDevelopment ?
                      'resumes.development.interncompass.io/' :
                      'resumes.interncompass.io/';
    return (
      <div className={css.container}>
        <div className={css.innerContainer}>
          <div className={css.resumeContainer}>
            <PDF
              file={`${S3_URL_PREFIX + S3_BUCKET + this.props.resumeKey}`}
              onDocumentComplete={this.handleDocumentComplete}
              page={this.state.page}
              className={css.canvas}
              scale={1.4}
              loading={<CenteredSpinner size={1} />}
            />
            <PaginatorWidget
              page={this.state.page}
              totalPages={this.state.totalPages}
              onChange={this.handlePageChange}
            />
          </div>
          <div className={css.commentsContainer}>
            <CritiqueCommentsContainer
              critiqueToken={this.props.token}
              comments={this.props.comments}
              dispatch={this.props.dispatch}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isDevelopment: state.compassStore.isDevelopment,
  };
}

export default connect(mapStateToProps)(CritiqueContent);
