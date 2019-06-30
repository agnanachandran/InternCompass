import PropTypes from 'prop-types';
import React from 'react';
import cssStarsInput from './StarsInput.scss';
import cssStarsWidget from './StarsWidget.scss';
import Star from './Star';
import cssStar from './Star.scss';
import { isMobileDevice } from '../utils/utils';

const FULL_THRESHOLD = 0;
const HALF_THRESHOLD = 0.5;

// out of 5, can make a prop if we need later
class InternalStarsWidget extends React.PureComponent {
  static propTypes = {
    selectedRating: PropTypes.number.isRequired,
    hoverRating: PropTypes.number.isRequired,
    size: PropTypes.oneOf(['small', 'medium']),
    showHalf: PropTypes.bool,
  };

  getFontSizeFromSize() {
    if (this.props.size === 'small') {
      return '20px';
    } else if (this.props.size === 'medium') {
      return '26px';
    }
  }

  renderStars() {
    let selectedRating = this.props.selectedRating;
    let hoverRating = this.props.hoverRating;
    const threshold = (this.props.showHalf === false) ? FULL_THRESHOLD : HALF_THRESHOLD;

    let stars = [];
    for (let i = 0; i < 5; i++) {
      let selectedFill;
      if (selectedRating > threshold) {
        selectedFill = 'filled';
        selectedRating--;
      } else if (selectedRating > 0) {
        selectedFill = 'half';
        selectedRating -= 0.5;
      } else {
        selectedFill = 'empty';
      }
      let hoverFill;
      if (hoverRating > threshold) {
        hoverFill = 'filled';
        hoverRating--;
      } else if (hoverRating > 0) {
        hoverFill = 'half';
        hoverRating -= 0.5;
      } else {
        hoverFill = 'empty';
      }
      const fontSize = this.getFontSizeFromSize();
      stars.push(
        <div key={i} className={cssStarsWidget.starHoverContainer} style={{ width: fontSize, height: fontSize, fontSize: fontSize }}>
          <Star
            fill={selectedFill}
          />
          {
            hoverFill !== 'empty' &&
            <Star
              fill={hoverFill}
              className={cssStar.hover}
              border={false}
            />
          }
        </div>
      );
    }
    return stars;
  }

  render() {
    return (
      <span className={cssStarsWidget.starsContainer}>
        {this.renderStars()}
      </span>
    );
  }
}

export default class StarsInput extends React.PureComponent {
  static propTypes = {
    initialRating: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    initialRating: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      shownRating: props.initialRating,
      selectedRating: props.initialRating,
      hoverDisabled: false,
      isMobileDevice: false,
    };
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    this.setState({
      isMobileDevice: isMobileDevice(),
    });
  }

  handleMouseClick(e) {
    const value = this.getValue(e);
    this.setState({ selectedRating: value, shownRating: 0, hoverDisabled: true });
    this.props.onChange(value);
  }

  handleMouseLeave() {
    this.setState({ shownRating: 0, hoverDisabled: false });
  }

  handleMouseMove(e) {
    if (!this.state.hoverDisabled
        || Math.ceil(this.getValue(e)) !== Math.ceil(this.state.selectedRating)) {
      this.setState({ shownRating: this.getValue(e), hoverDisabled: false });
    }
  }

  getValue(e) {
    const boundingRect = this.refs.container.getBoundingClientRect();
    const relativeX = e.clientX - boundingRect.left;
    const unit = boundingRect.width / 5;
    const value = relativeX / unit;
    return Math.ceil(value);
  }

  render() {
    return (
      <span
        ref='container'
        onClick={this.handleMouseClick}
        // iPhone treats tap as mousemove instead of click when both event handlers are present on element.
        // The hover effect isn't really useful on mobile anyway
        onMouseMove={this.state.isMobileDevice ? null : this.handleMouseMove}
        onMouseLeave={this.state.isMobileDevice ? null : this.handleMouseLeave}
        className={cssStarsInput.container}
      >
        <InternalStarsWidget
          selectedRating={this.state.selectedRating}
          hoverRating={this.state.shownRating}
          size='medium'
          showHalf={false}
        />
      </span>
    );
  }
}
