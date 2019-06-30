import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { colours, routingUrls } from '../../constants/compassConstants';
import HeroHeader from '../components/HeroHeader';
import AppExplanationWidget from './AppExplanationWidget';
import RecentReviewsWidget from './RecentReviewsWidget';
import css from './HomeWidget.scss';
import { Link } from 'react-router';
import CompaniesContainer from '../../companies/containers/CompaniesContainer';

export default class HomeWidget extends Component {
  static propTypes = {
    recentReviews: PropTypes.array,
    dispatch: PropTypes.func.isRequired,
  };

  renderRecentReviewsWidget() {
    if (this.props.recentReviews && this.props.recentReviews.length >= 2) {
      return (
        <RecentReviewsWidget reviews={this.props.recentReviews} />
      );
    }
  }

  renderViewMoreCompaniesCTA() {
    const buttonStyle ={
      height: '50px',
      width: '220px',
      color: 'white',
      fontWeight: 600,
      fontSize: '15px',
    };
    const labelStyle = {
      color: 'white',
      fontWeight: 'bold',
    };

    return (
      <div className={css.viewMoreCompaniesCTAContainer}>
        <Link to={routingUrls.SEARCH}>
          <FlatButton
            backgroundColor={colours.MATERIAL_BLUE}
            hoverColor={colours.MATERIAL_BLUE_DARK}
            style={buttonStyle}
            labelStyle={labelStyle}
            label='View More Companies'
          />
        </Link>
      </div>
    );
  }

  render() {
    return (
      <div className='app-container'>
        <HeroHeader />
        <AppExplanationWidget />
        {this.renderRecentReviewsWidget()}
        <CompaniesContainer dispatch={this.props.dispatch} />
        {this.renderViewMoreCompaniesCTA()}
      </div>
    );
  }
}
