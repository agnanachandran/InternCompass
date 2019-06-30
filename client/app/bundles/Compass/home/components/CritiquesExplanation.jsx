import React from 'react';
import css from './AppExplanationItem.scss';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import { colours } from '../../constants/compassConstants';

export default class CritiquesExplanation extends React.Component {
  render() {
    const labelStyle = {
      verticalAlign: 'top',
      color: 'white',
      fontWeight: 'bold',
    };

    return (
      <div className={css.container}>
        <img className={css.image} src='/images/upload_critiqueable.png' />
        <div className={css.title}>
          Resume Critiques
        </div>
        <div className={css.description}>
          <span className={css.text}>
            Prepare for internship applications by getting your resume critiqued. Our community can provide invaluable advice that will help you for your next internship search!
            <br/>
            <br/>
          </span>
          <Link to='/critiques'>
            <FlatButton
              backgroundColor={colours.MATERIAL_BLUE}
              hoverColor={colours.MATERIAL_BLUE_DARK}
              labelStyle={labelStyle}
              label='View Resumes'
            />
          </Link>
        </div>
      </div>
    );
  }
}

