import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import InterviewQuestionTagsWidget from '../../shared_components/InterviewQuestionTagsWidget';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import css from './InterviewQuestionListElementWidget.scss';

export default class InterviewQuestionListElementWidget extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
    difficulty: PropTypes.string,
    setInterviewQuestion: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.setInterviewQuestionWrapper = this.setInterviewQuestionWrapper.bind(this);
  }

  setInterviewQuestionWrapper() {
    const {
      id,
      difficulty,
      tags,
      setInterviewQuestion,
    } = this.props;

    setInterviewQuestion({
      id,
      difficulty,
      tags,
    });
  }

  render() {
    const {
      id,
      title,
      difficulty,
      tags,
    } = this.props;
    return (
      <div>
        <Divider />
        <Link
          to={`/interview_questions/${id}`}
          onClick={this.setInterviewQuestionWrapper}
        >
          <Card className={css.parent}>
            <CardTitle title={title} className={css.title} />
            <CardText className={css.tagsParent}>
              <InterviewQuestionTagsWidget difficulty={difficulty} tags={tags} />
            </CardText>
          </Card>
        </Link>
      </div>
    );
  }

}
