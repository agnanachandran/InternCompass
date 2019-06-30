import React from 'react';
import css from './TermsOfUseContainer.scss';
import Card from 'material-ui/Card';
import { terms, privacyPolicy } from '../constants/terms';
import _ from 'lodash';

export default class TermsOfUseContainer extends React.Component {

  renderSection(paragraphs) {
    return _.map(paragraphs, (paragraph, index) => {
      const isParagraph = _.isString(paragraph);
      const className = isParagraph ? css.content : css.point;
      return (
        <p key={index} className={className}>{isParagraph ? paragraph : paragraph.point}</p>
      );
    });
  }

  renderTerms() {
    return _.map(terms, (section, index) => (
      <div key={index}>
        <div className={css.heading}>{`${index + 1}. ${section.title}`}</div>
        {this.renderSection(section.paragraphs)}
      </div>
    ));
  }

  renderPrivacyPolicy() {
    return _.map(privacyPolicy, (paragraph, index) => (
      <p key={index} className={css.content}>{paragraph}</p>
    ));
  }

  render() {
    const style = {
      padding: '25px 50px',
      margin: '35px 0',
    };

    return (
      <Card style={style}>
        <h3 className={css.title}>InternCompass Terms of Use and Privacy Policy</h3>
        <div className={css.date}>Last modified: January 20, 2017</div>
        {this.renderTerms()}
        <div className={css.heading}>Privacy Policy</div>
        {this.renderPrivacyPolicy()}
      </Card>
    );
  }
}
