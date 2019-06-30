import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import * as critiqueActions from '../actions/critiqueActions';
import css from './CritiquesContainer.scss';
import CenteredSpinner from '../../components/CenteredSpinner';
import UploadCritiqueableBanner from '../components/UploadCritiqueableBanner';
import CritiqueItem from '../components/CritiqueItem';
import _ from 'lodash';
import { colours } from '../../constants/compassConstants.jsx';
import PaginatorWidget from '../../components/PaginatorWidget';

class CritiquesContainer extends Component {
  static propTypes = {
    userCritiques: PropTypes.array, // Logged in user's critiques
    critiques: PropTypes.array, // critiques
    critiqueCreators: PropTypes.object, // users who created the critiques
    totalPages: PropTypes.number.isRequired,
    currentUser: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired, // object whose only key is `page`
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.actions = bindActionCreators(critiqueActions, props.dispatch);
  }

  componentDidMount() {
    if (this.props.userCritiques === null || this.props.critiques === null) {
      this.actions.fetchCritiques(this.props.params.page);
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.params.page !== this.props.params.page) {
      this.actions.fetchCritiques(nextProps.params.page);
    }
  }

  componentWillUnmount() {
    this.actions.receiveCritiques({ critiques: null }, { userCritiques: null, critiqueCreators: null });
  }

  renderBanner() {
    if (_.isEmpty(this.props.userCritiques)) {
      return (
        <UploadCritiqueableBanner
          currentUser={this.props.currentUser}
        />
      );
    }
  }

  renderCritiques() {
    return _.map(this.props.critiques, (critique) => {
      const critiqueCreator = this.props.critiqueCreators[critique.id];
      return (
        <CritiqueItem
          key={critique.token}
          critique={critique}
          critiqueCreator={critiqueCreator}
        />
      );
    });
  }

  renderContent() {
    if (this.props.userCritiques === null || this.props.critiques === null) {
      return (
        <CenteredSpinner size={1} />
      );
    }
    const labelStyle = {
      verticalAlign: 'top',
      color: 'white',
      fontWeight: 'bold',
    };
    return (
      <div>
        {this.renderBanner()}
        <div className={css.critiquesHeader}>
          <h2 className={css.critiquesHeaderText}>Critiques</h2>
          {this.props.userCritiques.length > 0 && (
            <Link to={`/critiques/${this.props.userCritiques[0].token}`}>
              <FlatButton
                backgroundColor={colours.MATERIAL_BLUE}
                hoverColor={colours.MATERIAL_BLUE_DARK}
                labelStyle={labelStyle}
                label='View My Critique'
              />
            </Link>
          )}
        </div>
        {this.renderCritiques()}
        <PaginatorWidget
          page={parseInt(this.props.params.page) || 1}
          totalPages={this.props.totalPages}
          onChange={(page) => this.context.router.push(`/critiques/page/${page}`)}
        />
      </div>
    );
  }

  render() {
    return (
      <div className={css.userCritiquesContainer}>
        {this.renderContent()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userCritiques: state.critique.userCritiques,
    critiques: state.critique.critiques,
    critiqueCreators: state.user.critiqueCreators,
    totalPages: state.critique.totalPages,
    currentUser: state.compassStore.currentUser,
  };
}

export default connect(mapStateToProps)(CritiquesContainer);
