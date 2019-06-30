import PropTypes from 'prop-types';
import React from 'react';
import Linkify from 'react-linkify';
import css from './CritiqueComment.scss';
import { formatDateWithTime } from '../../utils/formatUtils';
import UserProfilePhoto from '../../components/UserProfilePhoto';
import UserHeadline from '../../user/components/UserHeadline';
import FontAwesomeIcon from '../../components/FontAwesomeIcon';
import DropdownMenu from '../../components/DropdownMenu';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as critiqueActions from '../actions/critiqueActions';
import NegativeConfirmModal from '../../components/NegativeConfirmModal';
import _ from 'lodash';

class CritiqueComment extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
    id: PropTypes.number.isRequired,
    isEditing: PropTypes.bool.isRequired,
    onEdit: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    school: PropTypes.string,
    program: PropTypes.string,
    userToken: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      deleteModalOpen: false,
      reportModalOpen: false,
    };
    this.handleCloseDeleteModal = this.handleCloseDeleteModal.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
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

  handleEdit() {
    this.props.onEdit(this.props.id, this.props.text);
  }

  handleDelete() {
    this.setState({ deleteModalOpen: true });
  }

  handleDeleteConfirm() {
    this.actions.deleteComment(this.props.id);
  }

  handleCloseReportModal() {
    this.setState({ reportModalOpen: false });
  }

  handleReport() {
    this.setState({ reportModalOpen: true });
  }

  handleReportConfirm() {
    this.setState({ reportModalOpen: false });
    this.actions.reportComment(this.props.id);
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
        {formatDateWithTime(this.props.createdAt)}{this.props.createdAt === this.props.updatedAt ? '' : ' (Edited)'}
      </div>
    );
  }

  renderText() {
    return (
      <div>
        <div className={css.text}>
          <Linkify properties={{ target: '_blank', className: css.link }}>
            {this.props.text}
          </Linkify>
        </div>
        <div className={css.currentlyEditing}>
          {this.props.isEditing ? '(Editing)' : ''}
        </div>
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

  renderMenu() {
    const menuItems = [];
    if (this.props.currentUser) {
      if (this.props.currentUser.token === this.props.userToken) {
        menuItems.push({ primaryText: 'Edit Comment', onClick: this.handleEdit });
        menuItems.push({ primaryText: 'Delete Comment', onClick: this.handleDelete });
      } else {
        menuItems.push({ primaryText: 'Report Comment', onClick: this.handleReport });
      }
      if (this.props.currentUser.admin) {
        menuItems.push({ primaryText: 'ADMIN Delete Comment', onClick: this.handleDelete });
      }
    }
    if (!_.isEmpty(menuItems)) {
      return (
        <div>
          <DropdownMenu button={this.renderMenuButton()} menuItems={menuItems}/>
        </div>
      );
    }
  }

  renderInfo() {
    return (
      <div className={css.info}>
        <div className={css.commentHeader}>
          <Link to={`/users/${this.props.userToken}`}
            className={css.userName}
          >
            {this.props.name}
          </Link>
          {this.renderMenu()}
        </div>
        {/*this.renderHeadline()*/}
        {this.renderDate()}
        {this.renderText()}
      </div>
    );
  }

  render() {
    return (
      <div className={css.container}>
        <UserProfilePhoto
          size='small'
          shape='circle'
          imageUrl={this.props.imgUrl}
        />
        {this.renderInfo()}
        <NegativeConfirmModal
          visible={this.state.deleteModalOpen}
          text='Are you sure you want to delete this comment?'
          onClose={this.handleCloseDeleteModal}
          onConfirm={this.handleDeleteConfirm}
        />
        <NegativeConfirmModal
          visible={this.state.reportModalOpen}
          text='Are you sure you want to report this comment?'
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
  };
}

export default connect(mapStateToProps)(CritiqueComment);

