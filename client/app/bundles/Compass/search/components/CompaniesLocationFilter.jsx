import PropTypes from 'prop-types';
import React from 'react';
import CityDropdown from '../../components/CityDropdown';
import css from './CompaniesLocationFilter.scss';
import Checkbox from 'material-ui/Checkbox';
import CompaniesSearchComponent from './CompaniesSearchComponent';
import _ from 'lodash';

const INITIAL_LOCATIONS = [
  'Toronto, ON, Canada',
  'Waterloo, ON, Canada',
  'Vancouver, BC, Canada',
  'San Francisco, CA, USA',
  'Seattle, WA, USA',
  'New York, NY, USA',
];

function getSelectedLocations(preselectedLocations) {
  const alreadyAddedLocations = {};
  const selectedLocations = _.map(INITIAL_LOCATIONS, (location) => {
    const isChecked = _.includes(preselectedLocations, location);
    if (isChecked) {
      alreadyAddedLocations[location] = true;
    }

    return {
      location,
      isChecked,
    };
  });

  _.each(preselectedLocations, (location) => {
    if (_.isUndefined(alreadyAddedLocations[location])) {
      selectedLocations.push({
        location,
        isChecked: true,
      });
    }
  });
  return selectedLocations;
}

export default class CompaniesLocationFilter extends React.Component {
  static propTypes = {
    queryString: PropTypes.string,
    page: PropTypes.number.isRequired,
    order: PropTypes.string.isRequired,
    locationFilter: PropTypes.array.isRequired,
    onUpdateQuery: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleLocationToggled = this.handleLocationToggled.bind(this);

    this.state = {
      selectedLocations: getSelectedLocations(props.locationFilter),
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      selectedLocations: getSelectedLocations(newProps.locationFilter),
    });
  }

  // If `forceSelection` is true, this function can only toggle the location on
  handleLocationToggled(location, forceSelection) {
    let newLocationFilter;
    const alreadySelected = _.findIndex(this.state.selectedLocations, (selectedLocation) =>
          selectedLocation.location === location
          && selectedLocation.isChecked) > -1;
    if (alreadySelected && !forceSelection) {
      newLocationFilter = _.without(this.props.locationFilter, location);
    } else if (alreadySelected && forceSelection) {
      return; // Nothing changed, so don't update search
    } else {
      newLocationFilter = [...this.props.locationFilter, location];
    }
    this.props.onUpdateQuery('locationFilter', newLocationFilter);
  }

  renderLocations() {
    return _.map(this.state.selectedLocations, (location, idx) => {
      return (
        <Checkbox
          key={idx}
          label={location.location}
          labelStyle={{ color: '#555', fontFamily: '"Open Sans", sans-serif' }}
          onCheck={() => this.handleLocationToggled(location.location, false)}
          checked={location.isChecked}
          className={css.locationCheckbox}
        />
      );
    });
  }

  render() {
    return (
      <div className={css.filterContainer}>
        <div className={css.locationLabel}>Location</div>
        {this.renderLocations()}
        <div className={css.locationDropdown}>
          <CityDropdown
            placeholder='Search for a city'
            onCitySelected={(city) => this.handleLocationToggled(city, true)}
            borderless={true}
          />
        </div>
        <CompaniesSearchComponent
          queryString={this.props.queryString}
          page={this.props.page}
          order={this.props.order}
          locationFilter={this.props.locationFilter}
        />
      </div>
    );
  }
}
