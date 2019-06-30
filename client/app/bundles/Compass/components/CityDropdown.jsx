import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import css from './CityDropdown.scss';
import classnames from 'classnames';

export default class CityDropdown extends React.Component {
  static propTypes = {
    onCitySelected: PropTypes.func.isRequired,
    onInputChange: PropTypes.func,
    selectedCity: PropTypes.string,
    placeholder: PropTypes.string,
    borderless: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    borderless: false,
  };

  constructor() {
    super();
    this.handleInput = this.handleInput.bind(this);
    this.handleSelectCity = this.handleSelectCity.bind(this);
  }

  componentDidMount() {
    /*global SERVER_RENDER*/
    if (!SERVER_RENDER) {
      const GoogleMapsLoader = require('google-maps');
      const parent = this;
      GoogleMapsLoader.load((google) => {
        parent.autoComplete =
          new google.maps.places.Autocomplete(parent.locationField, { types: ['(cities)'] });
        parent.autoComplete.addListener('place_changed', parent.handleSelectCity);
      });
    }
  }

  handleInput(e) {
    const value = e.target.value;
    if (this.props.onInputChange) {
      this.props.onInputChange(value);
    }
  }

  handleSelectCity() {
    const place = this.autoComplete.getPlace();
    if (!place.formatted_address) {
      return;
    }
    const country = _.find(place.address_components, component => {
      return _.includes(component.types, 'country');
    });
    const city = place.formatted_address;

    this.props.onCitySelected(city, country.short_name);
  }

  focus() {
    this.locationField.focus();
  }

  render() {
    const { selectedCity, placeholder } = this.props;
    return (
      <input
        className={classnames(css.location, {
          [css.borderless]: this.props.borderless,
        })}
        placeholder={placeholder}
        ref={(e) => this.locationField = e}
        type='text'
        onChange={this.handleInput}
        value={selectedCity}
      />
    );
  }
}
