import PropTypes from 'prop-types';
import React from 'react';
import ReactTooltip from 'react-tooltip';

export default class FontAwesomeIcon extends React.Component {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    className: PropTypes.string,
    ariaHidden: PropTypes.bool.isRequired,
    tooltipOptions: PropTypes.shape({
      text: PropTypes.string.isRequired,
      place: PropTypes.oneOf(['top', 'right', 'bottom', 'left']).isRequired,
    }),
  };

  static defaultProps = {
    ariaHidden: true,
  };

  render() {
    const { className, icon, ariaHidden, tooltipOptions } = this.props;
    const dataTip = tooltipOptions ? tooltipOptions.text : null;
    return (
      <span className={className}>
        <i
          data-tip={dataTip}
          className={`fa fa-${icon}`}
          aria-hidden={ariaHidden}
        />
        {
          dataTip &&
          <ReactTooltip place={tooltipOptions.place} type='dark' effect='float'/>
        }
      </span>
    );
  }
}