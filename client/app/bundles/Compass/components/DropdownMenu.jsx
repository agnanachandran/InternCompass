import PropTypes from 'prop-types';
import React from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router';
import _ from 'lodash';
import css from './DropdownMenu.scss';

export default class DropdownMenu extends React.Component {
  static propTypes = {
    menuItems: PropTypes.arrayOf(PropTypes.shape({
      primaryText: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      link: PropTypes.string,
    })).isRequired,
    button: PropTypes.node.isRequired,
  };

  constructor() {
    super();
    this.state = {
      open: false,
    };
    this.handleTouchTap = this.handleTouchTap.bind(this);
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose(onClick) {
    if (onClick) {
      onClick();
    }
    this.setState({
      open: false,
    });
  }

  renderMenuItems() {
    return _.map(this.props.menuItems, (menuItemProps, index) => {
      const otherProps = {};
      if (menuItemProps.link) {
        otherProps['containerElement'] = (<Link to={menuItemProps.link}/>);
      }
      return (
        <MenuItem
          key={index}
          primaryText={menuItemProps.primaryText}
          onClick={_.bind(this.handleRequestClose, this, menuItemProps.onClick)}
          {...otherProps}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <div className={css.button} onClick={this.handleTouchTap}>
          {this.props.button}
        </div>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={_.bind(this.handleRequestClose, this, () => {})}
        >
          <Menu style={{ minWidth: '125px' }} maxHeight={220}>
            {this.renderMenuItems()}
          </Menu>
        </Popover>
      </div>
    );
  }
}
