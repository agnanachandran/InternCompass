import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import css from './SearchResultWidget.scss';
import pluralize from 'pluralize';
import CompanyLogo from '../../components/CompanyLogo';

class SearchResultWidget extends React.Component {
  static propTypes = {
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    logoUrl: PropTypes.string,
    size: PropTypes.number,
    websiteUrl: PropTypes.string,
    careersUrl: PropTypes.string,
    numJobs: PropTypes.number,
    numReviews: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { slug, name, size, websiteUrl, careersUrl } = this.props;
    const description = this.props.description ? this.props.description.split('*').join('') : '';
    const company = { slug, name, description, size, websiteUrl, careersUrl };
    this.props.onChange(company);
  }

  renderSubHeader(numJobs, numReviews) {
    return (
      <span>
        {`${numReviews} ${pluralize('review', numReviews)} `}
        &middot;
        {` ${numJobs} ${pluralize('job', numJobs)} `}
      </span>
    );
  }

  renderDescription(highlights) {
    let elements = [];
    for (let idx = 0; idx < highlights.length; idx++) {
      if (idx % 2 === 0) {
        elements.push(<span key={idx} className={css.faded}>{highlights[idx]}</span>);
      } else {
        elements.push(<span key={idx} className={css.highlight}>{highlights[idx]}</span>);
      }
    }
    return <span>{elements}</span>;
  }

  render() {
    const { slug, name, description, numJobs, numReviews } = this.props;
    const highlights = (description) ? description.split('*') : '';

    return (
      <Link to={`/companies/${slug}`} onClick={this.handleClick}>
        <div className={css.container}>
          <div className={css.imgCol}>
            <CompanyLogo
              logoUrl={this.props.logoUrl}
              companyName={name}
              size='medium'
            />
          </div>
          <div className={css.contentCol}>
            <span className={css.name}>{name}</span>
            <p className={css.info}>{this.renderSubHeader(numJobs, numReviews)}</p>
            <p className={css.description}>{this.renderDescription(highlights)}</p>
          </div>
        </div>
      </Link>
    );
  }
}

export default SearchResultWidget;
