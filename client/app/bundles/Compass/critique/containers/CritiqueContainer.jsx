import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as critiqueActions from '../actions/critiqueActions';
import CritiqueWidget from '../components/CritiqueWidget';
import CenteredSpinner from '../../components/CenteredSpinner';

class CritiqueContainer extends Component {
  static propTypes = {
    critiqueCreator: PropTypes.object,
    critique: PropTypes.object,
    params: PropTypes.object.isRequired, // object whose only key is `critiqueToken`
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.actions = bindActionCreators(critiqueActions, props.dispatch);
  }

  componentDidMount() {
    if (!this.props.critique) {
      this.actions.fetchCritique(this.props.params.critiqueToken);
    }
  }

  componentWillReceiveProps(nextProps) {
    // Ensure navigating to another critique page fetches the new critique's data
    if (this.props.critique && this.props.params.critiqueToken !== nextProps.params.critiqueToken) {
      this.actions.fetchCritique(nextProps.params.critiqueToken);
    }
  }

  componentWillUnmount() {
    this.actions.receiveCritique(null, null);
  }

  render() {
    if (!this.props.critiqueCreator || !this.props.critique) {
      return (
        <CenteredSpinner size={1} marginTop={'10px'} />
      );
    }
    return (
      <CritiqueWidget
        token={this.props.critique.token}
        imgUrl={this.props.critiqueCreator.imgUrl}
        name={this.props.critiqueCreator.name}
        userToken={this.props.critiqueCreator.token}
        school={this.props.critiqueCreator.school}
        program={this.props.critiqueCreator.program}
        date={this.props.critique.updatedAt}
        description={this.props.critique.description}
        resumeKey={this.props.critique.resumeKey}
        comments={this.props.critique.comments}
        dispatch={this.props.dispatch}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    critiqueCreator: state.user.critiqueCreator,
    critique: state.critique.critique,
  };
}

export default connect(mapStateToProps)(CritiqueContainer);
