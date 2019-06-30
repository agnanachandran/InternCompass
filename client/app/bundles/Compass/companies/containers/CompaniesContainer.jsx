import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import css from './CompaniesContainer.scss';
import CompaniesCategory from '../components/CompaniesCategory';
import CenteredSpinner from '../../components/CenteredSpinner';
import * as companiesActionCreators from '../actions/companiesActionCreators';
import _ from 'lodash';

class CompaniesContainer extends React.Component {
  static propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      companies: PropTypes.array.isRequired,
    })),
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.actions = bindActionCreators({ ...companiesActionCreators }, props.dispatch);
  }

  componentDidMount() {
    if (!this.props.categories) {
      this.actions.fetchCompanies();
    }
  }

  renderCategories() {
    if (!this.props.categories) {
      return (
        <CenteredSpinner size={1} margin='0px' />
      );
    }

    return _.map(this.props.categories, category => (
      <CompaniesCategory key={category.title} title={category.title} companies={category.companies} />
    ));
  }

  render() {
    return (
      <div className={css.outerContainer}>
        <div>{this.renderCategories()}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    categories: state.companies.companyCategories,
  };
}

export default connect(mapStateToProps)(CompaniesContainer);

