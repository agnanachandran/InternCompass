import * as critiqueActions from '../actions/critiqueActions';
import classnames from 'classnames';
import css from './CritiqueHeader.scss';
import DropdownMenu from '../../components/DropdownMenu';
import FlatButton from 'material-ui/FlatButton';
import FontAwesomeIcon from '../../components/FontAwesomeIcon';
import NegativeConfirmModal from '../../components/NegativeConfirmModal';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import UserHeadline from '../../user/components/UserHeadline';
import UserProfilePhoto from '../../components/UserProfilePhoto';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { formatDate } from '../../utils/formatUtils';
import { colours } from '../../constants/compassConstants';
import LoadingContent from '../../components/LoadingContent';
import _ from 'lodash';

class CritiqueHeader extends Component {
  static propTypes = {
    imgUrl: PropTypes.string,
    name: PropTypes.string.isRequired,
    userToken: PropTypes.string.isRequired,
    school: PropTypes.string,
    program: PropTypes.string,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    isDeletingCritique: PropTypes.bool.isRequired,
    token: PropTypes.string.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      deleteModalOpen: false,
      reportModalOpen: false,
    };
    this.handleCloseDeleteModal = this.handleCloseDeleteModal.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
    this.handleCloseReportModal = this.handleCloseReportModal.bind(this);
    this.handleReport = this.handleReport.bind(this);
    this.handleReportConfirm = this.handleReportConfirm.bind(this);
    this.actions = bindActionCreators(critiqueActions, props.dispatch);
  }

  handleCloseDeleteModal() {
    this.setState({ deleteModalOpen: false });
  }

  handleDelete() {
    this.setState({ deleteModalOpen: true });
  }

  handleDeleteConfirm() {
    this.setState({ deleteModalOpen: false });
    this.actions.deleteCritique(this.props.token, this.context.router);
  }

  handleCloseReportModal() {
    this.setState({ reportModalOpen: false });
  }

  handleReport() {
    this.setState({ reportModalOpen: true });
  }

  handleReportConfirm() {
    this.actions.reportCritique(this.props.token);
    this.setState({ reportModalOpen: false });
  }

  renderHeadline() {
    if (this.props.school || this.props.program) {
      return (
        <UserHeadline
          className={css.headline}
          school={this.props.school}
          program={this.props.program}
        />
      );
    }
  }

  renderDate() {
    return (
      <div className={css.date}>
        Posted on {formatDate(this.props.date)}
      </div>
    );
  }

  renderDescription() {
    return (
      <div className={css.description}>
        {this.props.description}
      </div>
    );
  }

  renderMenuButton() {
    return (
      <div className={css.menuButton}>
        <FontAwesomeIcon icon='chevron-down'/>
      </div>
    );
  }

  renderDeleteButton() {
    if (this.props.currentUser && this.props.currentUser.token === this.props.userToken) {
      return (
        <FlatButton
          disabled={this.props.isDeletingCritique}
          backgroundColor={colours.MATERIAL_RED}
          hoverColor={colours.MATERIAL_RED_DARK}
          onClick={this.handleDelete}
        >
          <LoadingContent loading={this.props.isDeletingCritique}>
            <span className={css.deleteButton}>
              Delete
            </span>
          </LoadingContent>
        </FlatButton>
      );
    }
  }

  renderMenu() {
    const menuItems = [];
    if (this.props.currentUser && this.props.currentUser.token !== this.props.userToken) {
      menuItems.push({ primaryText: 'Report Resume', onClick: this.handleReport });
    }
    if (this.props.currentUser && this.props.currentUser.admin) {
      menuItems.push({ primaryText: 'ADMIN Delete Resume', onClick: this.handleDelete });
    }
    // If there aren't any menu items, we still want this
    // to take up space in the layout, so the column flexbox
    // can push the Delete Resume button down
    const dropdownElement = (
      <DropdownMenu button={this.renderMenuButton()} menuItems={menuItems}/>
    );
    return (
      <div className={classnames({ [css.invisible]: menuItems.length === 0 })}>
        {!_.isEmpty(menuItems) && dropdownElement}
      </div>
    );
  }

  renderInfo() {
    return (
      <div className={css.info}>
        <div>
          <Link to={`/users/${this.props.userToken}`}
            className={css.userName}
          >
            {this.props.name}
          </Link>
          {this.renderHeadline()}
          {this.renderDate()}
          {this.renderDescription()}
        </div>
        <div className={css.rightInfo}>
          {this.renderMenu()}
          {this.renderDeleteButton()}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={css.container}>
        <UserProfilePhoto
          size='large'
          shape='circle'
          imageUrl={this.props.imgUrl}
        />
        {this.renderInfo()}
        <NegativeConfirmModal
          visible={this.state.deleteModalOpen}
          text='Are you sure you want to delete this resume, and all of its comments? This action CANNOT be undone.'
          onClose={this.handleCloseDeleteModal}
          onConfirm={this.handleDeleteConfirm}
        />
        <NegativeConfirmModal
          visible={this.state.reportModalOpen}
          text='Are you sure you want to report this resume?'
          confirmButtonText='Report'
          onClose={this.handleCloseReportModal}
          onConfirm={this.handleReportConfirm}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.compassStore.currentUser,
    isDeletingCritique: state.critique.isDeletingCritique,
  };
}

export default connect(mapStateToProps)(CritiqueHeader);
