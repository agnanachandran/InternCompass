import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import RectangularChip from '../../components/RectangularChip';
import css from './InterviewQuestionTagsWidget.scss';

export default class InterviewQuestionTagsWidget extends React.Component {
  static propTypes = {
    tags: PropTypes.array.isRequired,
    difficulty: PropTypes.string.isRequired,
  };

  render() {
    const { difficulty, tags } = this.props;

    const chips = _.map(tags, (tag) =>
      (
        <RectangularChip key={tag.id} content={tag.name}/>
      )
    );

    return (
      <div>
        <RectangularChip
          chipProps={{
            className: css[difficulty],
            labelColor: 'white',
          }}
          content={difficulty}
        />
        {chips}
      </div>
    );
  }
}
