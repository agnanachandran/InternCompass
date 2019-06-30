import PropTypes from 'prop-types';
import React from 'react';
import css from './CompaniesCategory.scss';
import { colours } from '../../constants/compassConstants';
import CompanyCategoryListItem from './CompanyCategoryListItem';
import FlatButton from 'material-ui/FlatButton';
import _ from 'lodash';
import classnames from 'classnames';

const NUM_COMPANIES_INITIALLY = 7;

export default class CompaniesCategory extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    titleClassName: PropTypes.string,
    companies: PropTypes.arrayOf(PropTypes.object).isRequired,
    initialNum: PropTypes.number.isRequired,
  };

  static defaultProps = {
    initialNum: NUM_COMPANIES_INITIALLY,
  };

  constructor() {
    super();
    this.state = {
      showMore: false,
    };
    this.handleSeeMoreClick = this.handleSeeMoreClick.bind(this);
  }

  handleSeeMoreClick() {
    this.setState({ showMore: !this.state.showMore });
  }

  renderCompanies() {
    return _.map(this.props.companies, (company, i) => {
      if (!this.state.showMore && i >= Math.min(this.props.initialNum)) {
        return null;
      }
      return (
        <CompanyCategoryListItem
          key={i}
          className={css.companyItem}
          {...this.props.companies[i]}
        />
      );
    });
  }

  renderSeeMoreButton() {
    if (this.props.companies.length > this.props.initialNum) {
      const labelStyle = {
        verticalAlign: 'top',
        textTransform: 'none',
        color: 'white',
        fontWeight: 'bold',
        paddingLeft: 0,
        paddingRight: 0,
      };
      return (
        <div className={css.buttonContainer}>
          <FlatButton
            backgroundColor={colours.MATERIAL_BLUE}
            hoverColor={colours.MATERIAL_BLUE_DARK}
            labelStyle={labelStyle}
            onClick={this.handleSeeMoreClick}
            label={this.state.showMore ? 'See Less' : 'See More'}
          />
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className={css.outerContainer}>
        <div className={css.titleContainer}>
          <div className={classnames(css.title, this.props.titleClassName)}>{this.props.title}</div>
          {this.renderSeeMoreButton()}
        </div>
        <div className={css.companiesContainer}>
          {this.renderCompanies()}
        </div>
      </div>
    );
  }
}
