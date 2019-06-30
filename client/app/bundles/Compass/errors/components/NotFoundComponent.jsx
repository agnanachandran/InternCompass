import React from 'react';
import { Link } from 'react-router';
import Divider from 'material-ui/Divider';
import Card from 'material-ui/Card';
import css from './NotFoundComponent.scss';

export default class NotFoundWidget extends React.Component {
  render() {
    return (
      <div className={css.container}>
        <Card>
          <h1 className={css.header}>Page Not Found</h1>
          <div className={css.dividerContainer}>
            <Divider />
          </div>
          <p className={css.description}>We couldn't find what you were looking for.<br />You may want to head back to the <Link className={css.link} to='/'>homepage</Link>.</p>
        </Card>
      </div>
    );
  }
}
