import PropTypes from 'prop-types';
import React from 'react';
import css from './InterviewQuestionFilterBarWidget.scss';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import { List, ListItem } from 'material-ui/List';
import Reorder from 'material-ui/svg-icons/action/reorder';
import FullCircle from 'material-ui/svg-icons/av/fiber-manual-record';
import HalfCircle from 'material-ui/svg-icons/toggle/radio-button-checked';
import EmptyCircle from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import _ from 'lodash';

export default class InterviewQuestionFilterBarWidget extends React.Component {
  static propTypes = {
    difficulty: PropTypes.string.isRequired,
    difficulties: PropTypes.array,
    category: PropTypes.string.isRequired,
    categories: PropTypes.array,
    setDifficulty: PropTypes.func.isRequired,
    setCategory: PropTypes.func.isRequired,
  };

  renderDifficulties(difficulties, selected) {
    const difficultyToIcon = {
      all: <Reorder />,
      easy: <EmptyCircle />,
      moderate: <HalfCircle />,
      hard: <FullCircle />,
    };

    const setDifficulty = this.props.setDifficulty;

    return _.map(difficulties, (difficulty, index) =>
      (
        <ListItem
          className={selected === difficulty ? css.selectedListItem : ''}
          primaryText={_.capitalize(difficulty)}
          leftIcon={difficultyToIcon[difficulty]}
          key={difficulty}
          value={difficulty}
          onClick={function() { setDifficulty(this.value); }}
        />
      )
    );
  }

  renderCategories(categories, selected) {
    const setCategory = this.props.setCategory;

    return _.map(categories, (category, index) =>
      (
        <ListItem
          className={selected === category.urlSlug ? css.selectedListItem : ''}
          primaryText={_.capitalize(category.name)}
          key={category.urlSlug}
          value={category.urlSlug}
          onClick={function() { setCategory(this.value); }}
        />
      )
    );
  }

  render() {
    const {
      difficulty,
      category,
      difficulties,
      categories } = this.props;
    return (
      <div className={css.categoriesParent}>
        <List>
          <Subheader>Difficulty</Subheader>
          {this.renderDifficulties(difficulties, difficulty)}
        </List>
        <Divider />
        <List>
          <Subheader>Categories</Subheader>
          {this.renderCategories(categories, category)}
        </List>
      </div>
    );
  }
}
