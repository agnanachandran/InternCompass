import PropTypes from 'prop-types';
import React from 'react';
import { USER_PROFILE_DATA_SHAPE } from '../../constants/propTypesConstants';
import UserInfo from './UserInfo';
import UserReviews from './UserReviews';
import css from './UserProfile.scss';
import CompaniesCategory from '../../companies/components/CompaniesCategory';
import NegativeConfirmModal from '../../components/NegativeConfirmModal';
import Snackbar from 'material-ui/Snackbar';

export default class UserProfile extends React.Component {
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    lastName: PropTypes.string.isRequired,
    reviews: PropTypes.array.isRequired,
    following: PropTypes.arrayOf(PropTypes.object).isRequired,
    profileData: USER_PROFILE_DATA_SHAPE,
    isViewingCurrentUser: PropTypes.bool.isRequired,
    deleteReview: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      modalOpen: false,
      loading: false,
      error: false,
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
    this.handleErrorMsgClose = this.handleErrorMsgClose.bind(this);
  }

  handleErrorMsgClose() {
    this.setState({ error: false });
  }

  handleCloseModal() {
    this.setState({ modalOpen: false });
  }

  handleDelete(userReviewToken) {
    this.setState({ modalOpen: true, userReviewTokenToDelete: userReviewToken });
  }

  handleDeleteConfirm() {
    this.setState({ loading: true, modalOpen: false });
    this.props.deleteReview(this.state.userReviewTokenToDelete)
      .done(() => this.setState({ loading: false }))
      .fail(() => this.setState({ loading: false, error: true }));
  }

  renderFollowing() {
    if (!this.props.isViewingCurrentUser) {
      return null;
    }
    return (
      <CompaniesCategory
        title={`Following (${this.props.following.length})`}
        titleClassName={css.followingCompaniesTitle}
        companies={this.props.following}
        initialNum={7}
      />
    );
  }

  render() {
    const { firstName, imgUrl, lastName, reviews, profileData } = this.props;
    return (
      <div>
        <div className={css.outerContainer}>
          <div className={css.userInfoOuterContainer}>
            <div className={css.userInfoInnerContainer}>
              <UserInfo
                firstName={firstName}
                imgUrl={imgUrl}
                lastName={lastName}
                profileData={profileData}
                isViewingCurrentUser={this.props.isViewingCurrentUser}
              />
            </div>
          </div>
          <div className={css.userContentContainer}>
            <div className={css.userReviewsContainer}>
              {this.renderFollowing()}
              <UserReviews
                reviews={reviews}
                deleteReview={this.handleDelete}
                loading={this.state.loading}
                isViewingCurrentUser={this.props.isViewingCurrentUser}
              />
            </div>
          </div>
        </div>
        <NegativeConfirmModal
          visible={this.state.modalOpen}
          text={'Are you sure you want to delete this review?'}
          onClose={this.handleCloseModal}
          onConfirm={this.handleDeleteConfirm}
        />
        <Snackbar
          open={this.state.error}
          message="Sorry, we couldn't complete this action right now. Please try again."
          onRequestClose={this.handleErrorMsgClose}
          autoHideDuration={4000}
        />
      </div>
    );
  }
}
