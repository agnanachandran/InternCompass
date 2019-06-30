import PropTypes from 'prop-types';
import React, { Component } from 'react';
import css from './CritiqueWidget.scss';
import CritiqueHeader from './CritiqueHeader';
import CritiqueContent from './CritiqueContent';

export default class CritiqueWidget extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    name: PropTypes.string.isRequired,
    userToken: PropTypes.string.isRequired,
    school: PropTypes.string,
    program: PropTypes.string,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    resumeKey: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  render() {
    return (
      <div className={css.container}>
        <CritiqueHeader
          imgUrl={this.props.imgUrl}
          name={this.props.name}
          userToken={this.props.userToken}
          school={this.props.school}
          program={this.props.program}
          date={this.props.date}
          description={this.props.description}
          dispatch={this.props.dispatch}
          token={this.props.token}
        />
        <CritiqueContent
          token={this.props.token}
          resumeKey={this.props.resumeKey}
          comments={this.props.comments}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}
