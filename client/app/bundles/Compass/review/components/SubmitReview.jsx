import PropTypes from 'prop-types';
import React from 'react';
import css from './SubmitReview.scss';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import LoadingContent from '../../components/LoadingContent';
import { colours } from '../../constants/compassConstants';

export default class SubmitReview extends React.PureComponent {
  static propTypes = {
    anonymous: PropTypes.bool.isRequired,
    onFieldChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
  }

  handleCheckChange(e, isChecked) {
    const anonymous = isChecked;
    this.props.onFieldChange({ anonymous });
  }

  handleSubmit() {
    this.props.onSubmit();
  }

  render() {
    const { anonymous } = this.props;
    return (
      <div className={css.container}>
        <div className={css.thanksContainer}>
          Thanks for taking the time to review your internship!
        </div>
        <div className={css.anonymousAndSubmitContainer}>
          <div className={css.anonymousContainer}>
            <Checkbox
              label='Post anonymously'
              onCheck={this.handleCheckChange}
              checked={anonymous}
              className={css.anonymousCheckbox}
            />
          </div>
          <FlatButton
            backgroundColor={colours.MATERIAL_BLUE}
            hoverColor={colours.MATERIAL_BLUE_DARK}
            className={css.submitButton}
            onClick={this.handleSubmit}
            disabled={this.props.loading}
          >
            <LoadingContent loading={this.props.loading}>
              <span className={css.submit}>Submit</span>
            </LoadingContent>
          </FlatButton>
        </div>
      </div>
    );
  }
}
