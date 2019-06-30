import PropTypes from 'prop-types';
import React from 'react';
import InterviewQuestionListElementWidget from './InterviewQuestionListElementWidget';
import css from './InterviewQuestionListWidget.scss';
import _ from 'lodash';
import Divider from 'material-ui/Divider';
import { Card, CardHeader, CardText } from 'material-ui/Card';

export default class InterviewQuestionListWidget extends React.Component {
  static propTypes = {
    interviewQuestions: PropTypes.array,
    setInterviewQuestion: PropTypes.func.isRequired,
  }

  renderInterviewQuestions(interviewQuestions, difficulty) {
    if (!interviewQuestions || interviewQuestions.length === 0) {
      return (
        <div>
          <Divider />
          <div className={css.noQuestionsMessage}>
            Sorry, no questions match these filters right now.
          </div>
        </div>
      );
    }
    const { setInterviewQuestion } = this.props;

    return _.map(interviewQuestions, interviewQuestion =>
      (
        <InterviewQuestionListElementWidget
          key={interviewQuestion.id}
          {...interviewQuestion}
          setInterviewQuestion={setInterviewQuestion}
        />
      )
    );
  }

  render() {
    const { interviewQuestions } = this.props;

    return (
      <div className={css.questionListParent}>
        <Card zDepth={1}>
          <CardHeader title='Interview Questions' />
          <CardText style={{ padding: '0px' }}>
            {this.renderInterviewQuestions(interviewQuestions)}
          </CardText>
        </Card>
      </div>
    );
  }
}
