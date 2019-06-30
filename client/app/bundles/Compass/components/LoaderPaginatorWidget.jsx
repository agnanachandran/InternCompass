import PropTypes from 'prop-types';
import React from 'react';
import css from './LoaderPaginatorWidget.scss';
import classnames from 'classnames';
import _ from 'lodash';
import { dataSourcesToUrls } from '../constants/LoaderPaginatorConstants';

class LoaderPaginatorWidget extends React.Component {
  static propTypes = {
    dataSource: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    totalPages: PropTypes.number.isRequired,
    onLoad: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      page: 1,
    };

    this.getButtonStyle = this.getButtonStyle.bind(this);
    this.getSourceUrl = this.getSourceUrl.bind(this);
    this.getRequestData = this.getRequestData.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleError() {
    this.setState({
      page: this.state.page - 1
    });
  }

  handleClick(event) {
    this.setState({
      page: this.state.page + 1
    });

    const data = this.getRequestData();
    const url = this.getSourceUrl();
    this.props.onLoad(url, data, this.handleError);
  }

  getSourceUrl() {
    const { dataSource } = this.props;
    return (dataSource in dataSourcesToUrls) ? dataSourcesToUrls[dataSource] : '';
  }

  getRequestData() {
    const { data } = this.props;
    let requestData = { page: this.state.page + 1 };

    return _.merge(requestData, data);
  }

  getButtonStyle() {
    return classnames([css.loaderButton], {
      [css.hidden]: this.state.page === this.props.totalPages,
    });
  }

  render() {
    const buttonStyle = this.getButtonStyle();

    return (
      <div className={css.container}>
        <button className={buttonStyle} onClick={this.handleClick}>Show more</button>
      </div>
    );
  }
}

export default LoaderPaginatorWidget;
