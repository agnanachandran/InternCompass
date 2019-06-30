import PropTypes from 'prop-types';
import React from 'react';
import Carousel from 'nuka-carousel';
import _ from 'lodash';
import classnames from 'classnames';
import RecentReviewWidget from './RecentReviewWidget';
import css from './RecentReviewsWidget.scss';

let hasManuallyChangedSlides = false; // Only autoplay if user has not manually changed slides

class LeftArrowWidget extends React.Component {
  static propTypes = {
    previousSlide: PropTypes.func.isRequired,
  };

  handleClick() {
    hasManuallyChangedSlides = true;
    this.props.previousSlide();
  }

  render() {
    return (
      <i className={classnames('fa', 'fa-angle-left', css.arrow)} onClick={_.bind(this.handleClick, this)} aria-hidden={true} />
    );
  }
}

class RightArrowWidget extends React.Component {
  static propTypes = {
    nextSlide: PropTypes.func.isRequired,
  };

  handleClick() {
    hasManuallyChangedSlides = true;
    this.props.nextSlide();
  }

  render() {
    return (
      <i className={classnames('fa', 'fa-angle-right', css.arrow)} onClick={_.bind(this.handleClick, this)} aria-hidden={true} />
    );
  }
}

class DotsWidget extends React.Component {
  static propTypes = {
    goToSlide: PropTypes.func.isRequired,
    currentSlide: PropTypes.number.isRequired,
    slideCount: PropTypes.number.isRequired,
  };

  handleClick(idx) {
    hasManuallyChangedSlides = true;
    this.props.goToSlide(idx);
  }

  renderCircles() {
    return _.map(_.range(this.props.slideCount), (idx) => {
      if (idx === this.props.currentSlide) {
        return (
          <div key={idx} className={css.circleTarget}>
            <div className={css.filledCircle} />
          </div>
        );
      } else {
        return (
          <div key={idx} onClick={_.bind(this.handleClick, this, idx)} className={css.circleTarget}>
            <div className={css.emptyCircle} />
          </div>
        );
      }
    });
  }

  render() {
    return (
      <div>
        {this.renderCircles()}
      </div>
    );
  }
}

const DECORATORS = [
  {
    component: LeftArrowWidget,
    position: 'CenterLeft'
  },
  {
    component: RightArrowWidget,
    position: 'CenterRight'
  },
  {
    component: DotsWidget,
    position: 'BottomCenter'
  }
];

export default class RecentReviewsWidget extends React.Component {
  static propTypes = {
    reviews: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      autoplayState: true,
    };
  }

  handleAfterSlide() {
    if (hasManuallyChangedSlides) {
      this.setState({
        autoplayState: false
      });
    }
  }

  renderRecentReviews() {
    return _.map(this.props.reviews, (review, idx) =>
      <RecentReviewWidget key={idx} review={review} />
    );
  }

  render() {
    return (
      <div className={css.container}>
        <h2 className={css.header}>Recent Reviews</h2>
        <div>
          <Carousel
            wrapAround={true}
            autoplay={this.state.autoplayState}
            autoplayInterval={5000}
            decorators={DECORATORS}
            afterSlide={_.bind(this.handleAfterSlide, this)}
          >
            {this.renderRecentReviews()}
          </Carousel>
        </div>
      </div>
    );
  }
}
