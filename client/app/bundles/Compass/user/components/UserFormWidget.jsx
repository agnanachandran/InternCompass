import PropTypes from 'prop-types';
import React from 'react';
import Logo from '../../components/Logo';
import css from './UserFormWidget.scss';

export default class UserFormWidget extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className={css.outer}>
        <div className={css.inner}>
          <Logo className={css.logo}/>
          {this.props.form}
        </div>
      </div>
    );
  }
}
