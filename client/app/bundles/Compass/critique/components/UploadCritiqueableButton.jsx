import PropTypes from 'prop-types';
import React from 'react';
import css from './UploadCritiqueableButton.scss';
import { Link } from 'react-router';
import FontAwesomeIcon from '../../components/FontAwesomeIcon';
import FlatButton from 'material-ui/FlatButton';
import { colours } from '../../constants/compassConstants';

export default class UploadCritiqueableButton extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object,
  };

  render() {
    const labelStyle = {
      verticalAlign: 'top',
      color: 'white',
      fontWeight: 'bold',
    };

    return (
      <Link to='/critiques/upload'>
        <FlatButton
          backgroundColor={colours.MATERIAL_BLUE}
          hoverColor={colours.MATERIAL_BLUE_DARK}
          labelStyle={labelStyle}
          label='Upload'
          icon={<FontAwesomeIcon className={css.uploadIcon} icon='upload' />}
        />
      </Link>
    );
  }
}


