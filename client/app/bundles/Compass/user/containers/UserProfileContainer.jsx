import PropTypes from 'prop-types';
import React from 'react';
import UserProfile from '../components/UserProfile';
import { connect } from 'react-redux';
import * as userActions from '../actions/userActions';
import * as reviewActions from '../../review/actions/reviewActions';
import { bindActionCreators } from 'redux';

class UserProfileContainer extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object,
    token: PropTypes.string.isRequired,
    currentUser: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.actions = bindActionCreators({ ...userActions, ...reviewActions }, props.dispatch);
  }

  componentDidMount() {
    this.getUser();
  }

  componentDidUpdate() {
    this.getUser();
  }

  getUser() {
    const { user, token } = this.props;
    if(!user) {
      this.actions.fetchUser(token);
    }
  }

  render() {
    if (!this.props.user) {
      return null;
    }
    return (
      <UserProfile
        isViewingCurrentUser={Boolean(this.props.currentUser && this.props.user.token === this.props.currentUser.token)}
        deleteReview={this.actions.deleteReview}
        {...this.props.user}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const token = ownProps.params.token;
  let user = state.user.user;
  if (!user || user.token !== token || !user.firstName) {
    user = null;
  }
  const currentUser = state.compassStore.currentUser;
  return {
    user,
    token,
    currentUser,
  };
}

export default connect(mapStateToProps)(UserProfileContainer);
