import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as interviewQuestionActionCreators from '../actions/interviewQuestionActionCreators';
import InterviewQuestionShowWidget from './components/InterviewQuestionShowWidget';
import InterviewQuestionNotFoundWidget from './components/InterviewQuestionNotFoundWidget';
import { get } from '../../utils/ajaxCamelCase';

class InterviewQuestionShowContainer extends React.Component {
  static propTypes = {
    interviewQuestion: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.actions = bindActionCreators(interviewQuestionActionCreators, this.props.dispatch);
    if (this.props.interviewQuestion !== null
      && !('descriptionMarkdown' in this.props.interviewQuestion) ) {
      this.fetchInterviewQuestion();
    }
  }

  componentWillUnmount() {
    // TODO: this clears cache the moment we leave the page
    // perhaps we need smarter cache invalidation in the future
    this.actions.setInterviewQuestion(null);
  }

  fetchInterviewQuestion() {
    const actions = this.actions;
    get(`/interview_questions/${this.props.interviewQuestion.id}.json`).done((data) => {
      actions.setInterviewQuestion(data);
    });
  }

  render() {
    if (this.props.interviewQuestion === null) {
      return (
        <InterviewQuestionNotFoundWidget />
      );
    }

    return (
      <InterviewQuestionShowWidget {...this.props.interviewQuestion} />
    );
  }
}

function mapStateToProps(state) {
  return { interviewQuestion: state.interviewQuestion.interviewQuestion };
}

export default connect(mapStateToProps)(InterviewQuestionShowContainer);
