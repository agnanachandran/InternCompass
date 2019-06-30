import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as interviewQuestionActionCreators from '../actions/interviewQuestionActionCreators';
import InterviewQuestionFilterBarWidget from './components/InterviewQuestionFilterBarWidget';
import InterviewQuestionListWidget from './components/InterviewQuestionListWidget';
import { get } from '../../utils/ajaxCamelCase';

class InterviewQuestionListContainer extends React.Component {
  static propTypes = {
    interviewQuestions: PropTypes.array,
    difficulty: PropTypes.string.isRequired,
    difficulties: PropTypes.array,
    category: PropTypes.string.isRequired,
    categories: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  }

  constructor(props) {
    super(props);
    this.setDifficulty = this.setDifficulty.bind(this);
    this.setCategory = this.setCategory.bind(this);
  }

  componentWillMount() {
    this.actions = bindActionCreators(interviewQuestionActionCreators, this.props.dispatch);
    if (this.props.interviewQuestions === null) {
      this.fetchInterviewQuestions({
        category: this.props.category,
        difficulty: this.props.difficulty
      });
    }

    if (this.props.difficulties === null) {
      this.fetchFilters();
    }
  }

  componentWillUnmount() {
    // TODO: this clears cache the moment we leave the page
    // perhaps we need smarter cache invalidation in the future
    this.actions.setInterviewQuestionsList(null);
  }

  setDifficulty(value) {
    const {
      category,
      location,
    } = this.props;

    this.props.router.push(`${location.pathname}${this.buildUrlParamsString(
        value,
        category
      )}`);
    this.actions.setDifficulty(value);
    this.fetchInterviewQuestions({
      category: category,
      difficulty: value
    });
  }

  setCategory(value) {
    const {
      difficulty,
      location,
    } = this.props;

    this.props.router.push(`${location.pathname}${this.buildUrlParamsString(
        difficulty,
        value
      )}`);
    this.actions.setCategory(value);
    this.fetchInterviewQuestions({
      category: value,
      difficulty: difficulty
    });
  }

  buildUrlParamsString(difficulty, category) {
    let result = '?';
    let difficultyExists = false;
    if (difficulty !== 'all') {
      result += `difficulty=${difficulty}`;
      difficultyExists = true;
    }

    if (category !== 'all') {
      if (difficultyExists) result += '&';
      result += `category=${category}`;
    }
    return result;
  }

  fetchInterviewQuestions(filter) {
    const actions = this.actions;
    get('/interview_questions.json', filter).done((data) => {
      actions.setInterviewQuestionsList(data);
    });
  }

  fetchFilters() {
    const actions = this.actions;
    get('/interview_questions/get_filters.json').done((data) => {
      actions.initFilters(data);
    });
  }

  render() {
    const {
      interviewQuestions,
      difficulty,
      category,
      difficulties,
      categories,
    } = this.props;

    return (
      <div>
        <div>
          <InterviewQuestionFilterBarWidget
            category={category}
            difficulty={difficulty}
            categories={categories}
            difficulties={difficulties}
            setDifficulty={this.setDifficulty}
            setCategory={this.setCategory}
          />
          <InterviewQuestionListWidget
            interviewQuestions={interviewQuestions}
            setInterviewQuestion={this.actions.setInterviewQuestion}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    interviewQuestions: state.interviewQuestion.interviewQuestions,
    difficulty: state.interviewQuestion.listFilter.difficulty,
    category: state.interviewQuestion.listFilter.category,
    difficulties: state.interviewQuestion.difficulties,
    categories: state.interviewQuestion.categories
  };
}

export default withRouter(connect(mapStateToProps)(InterviewQuestionListContainer));
