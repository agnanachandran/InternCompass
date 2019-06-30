import React from 'react';
import css from './AppExplanationItem.scss';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import { colours } from '../../constants/compassConstants';

export default class WriteReviewExplanation extends React.Component {
  render() {
    const labelStyle = {
      verticalAlign: 'top',
      color: 'white',
      fontWeight: 'bold',
    };

    return (
      <div className={css.container}>
        <img className={css.image} src='/images/write_review_explanation.png' />
        <div className={css.title}>
          Share Your Experience
        </div>
        <div className={css.description}>
          <span className={css.text}>
            InternCompass wouldn't exist without the support of thousands of students. We'd love for you to write an internship review and help out the community.
            <br/>
            <br/>
          </span>
          <Link to='/write-review' className={css.button}>
            <FlatButton
              backgroundColor={colours.MATERIAL_GREEN}
              hoverColor={colours.MATERIAL_GREEN_DARK}
              labelStyle={labelStyle}
              label='Write a Review'
            />
          </Link>
        </div>
      </div>
    );
  }
}

