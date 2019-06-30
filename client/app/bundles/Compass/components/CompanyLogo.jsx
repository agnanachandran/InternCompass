import PropTypes from 'prop-types';
import React from 'react';
import css from './CompanyLogo.scss';
import { Link } from 'react-router';
import classnames from 'classnames';

export default class CompanyLogo extends React.Component {
  static propTypes = {
    logoUrl: PropTypes.string,
    className: PropTypes.string,
    companySlug: PropTypes.string,
    companyName: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'xLarge', 'xxLarge']),
  };

  constructor() {
    super();
    this.state = {
      error: false,
    };
    this.handleImageError = this.handleImageError.bind(this);
    this.sizes = {
      small: 40,
      medium: 60,
      large: 80,
      xLarge: 100,
      xxLarge: 120,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Reset error state
    if (this.props.logoUrl !== nextProps.logoUrl || this.props.companyName !== nextProps.companyName) {
      this.setState({
        error: false,
      });
    }
  }

  handleImageError() {
    this.setState({ error: true });
  }

  getBackgroundColour() {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7',
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
      '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
      '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
      '#795548', '#9E9E9E', '#607D8B',
    ];

    let hash = 0;
    for (let char of this.props.companyName) {
      hash = (hash << 5) - hash + char.charCodeAt(0);
      hash |= 0;
    }
    // Mod to length, handle negative idx.
    const length = colors.length;
    return colors[((hash % length) + length) % length];
  }

  render() {
    const { className, logoUrl, companyName, size, companySlug } = this.props;
    const sizeValue = this.sizes[size];
    const logoSize = `${sizeValue}px`;

    const companyLink = companySlug ? `/companies/${companySlug}` : null;
    if (logoUrl && !this.state.error) {
      const imgElement = (
        <img
          className={classnames(className, css.img)}
          src={logoUrl}
          width={logoSize}
          height={logoSize}
          onError={this.handleImageError}
        />
      );
      if (companyLink) {
        return (
          <Link to={companyLink}>
            {imgElement}
          </Link>
        );
      }
      return imgElement;
    }

    const logoPlaceholderStyle = {
      background: this.getBackgroundColour(),
      width: logoSize,
      height: logoSize,
      lineHeight: logoSize,
      fontSize: `${sizeValue*0.6}px`,
    };
    const companyLogo = (
      <span style={logoPlaceholderStyle} className={css.logo}>
        {companyName.charAt(0)}
      </span>
    );
    if (companyLink) {
      return (
        <Link to={companyLink}>
          {companyLogo}
        </Link>
      );
    }
    return companyLogo;
  }
}
