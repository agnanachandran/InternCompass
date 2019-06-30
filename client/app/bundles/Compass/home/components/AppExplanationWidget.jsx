import React from 'react';
import CritiquesExplanation from './CritiquesExplanation';
import WriteReviewExplanation from './WriteReviewExplanation';
import css from './AppExplanationWidget.scss';

export default class AppExplanationWidget extends React.Component {
  render() {
    return (
      <div className={css.container}>
        <WriteReviewExplanation />
        <CritiquesExplanation />
      </div>
    );
  }
}
