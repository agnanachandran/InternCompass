import PropTypes from 'prop-types';
import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import css from './CompanyMenuBarButton.scss';
import FontAwesomeIcon from '../../../components/FontAwesomeIcon';
import LoadingContent from '../../../components/LoadingContent';

export default class CompanyMenuBarButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    backgroundColor: PropTypes.string.isRequired,
    hoverColor: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    style: PropTypes.object,
    icon: PropTypes.string,
    loading: PropTypes.bool,
  };

  renderIcon() {
    if (this.props.icon) {
      return (
        <FontAwesomeIcon className={css.icon} icon={this.props.icon}/>
      );
    }
  }

  renderContent() {
    return (
      <span className={css.label}>
        {this.renderIcon()}
        {this.props.text}
      </span>
    );
  }

  render() {
    return (
      <FlatButton
        disabled={this.props.loading}
        onClick={this.props.onClick}
        backgroundColor={this.props.backgroundColor}
        hoverColor={this.props.hoverColor}
        style={this.props.style}
      >
        <LoadingContent loading={this.props.loading}>
          {this.renderContent()}
        </LoadingContent>
      </FlatButton>
    );
  }
}
