import React from 'react';
import Card from 'material-ui/Card';
import contentCss from './CompanyContent.scss';
import css from './CompanyInterviewQuestionsContainer.scss';

export default class CompanyInterviewQuestionsContainer extends React.Component {
  render() {
    return (
      <Card className={contentCss.card}>
        <h2 className={css.title}>Interview Questions</h2>
      </Card>
    );
  }
}

