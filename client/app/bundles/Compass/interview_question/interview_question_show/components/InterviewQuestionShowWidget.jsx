import PropTypes from 'prop-types';
import React from 'react';
import InterviewQuestionTagsWidget from '../../shared_components/InterviewQuestionTagsWidget';
import { Card, CardText } from 'material-ui/Card';
import css from './InterviewQuestionShowWidget.scss';
import marked from 'marked';

export default class InterviewQuestionShowWidget extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    descriptionMarkdown: PropTypes.string,
    difficulty: PropTypes.string,
    tags: PropTypes.array
  }

  rawMarkup() {
    if (this.props.descriptionMarkdown) {
      return { __html: marked(this.props.descriptionMarkdown) };
    } else {
      return { __html: '' };
    }
  }

  render() {
    const { title, difficulty, tags } = this.props;
    return (
      <div>
        <Card className={css.headerCard}>
          <CardText>
            <div className={css.title}>{title}</div>
            <InterviewQuestionTagsWidget difficulty={difficulty} tags={tags} />
          </CardText>
        </Card>
        <Card>
          <CardText>
            <div className='markdownParent' dangerouslySetInnerHTML={this.rawMarkup()}></div>
          </CardText>
        </Card>
      </div>
    );
  }

}

