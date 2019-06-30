import PropTypes from 'prop-types';
import React from 'react';
import PerksSelection from './PerksSelection';
import PerksSuggestions from './PerksSuggestions';
import update from 'react-addons-update';
import _ from 'lodash';

function getSuggestedPerksStateFromProps(suggestedPerks) {
  return _.map(suggestedPerks, (perk, index) => ({
    name: perk.name,
    display: true,
    index,
  }));
}

export default class PerksWidget extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    suggestedPerks: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedPerks: [],
      suggestedPerks: getSuggestedPerksStateFromProps(props.suggestedPerks),
    };

    this.handleSuggestionClick = this.handleSuggestionClick.bind(this);
    this.handlePerkDelete = this.handlePerkDelete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.suggestedPerks) {
      this.setState({
        suggestedPerks: getSuggestedPerksStateFromProps(nextProps.suggestedPerks)
      });
    }
  }

  handlePerksChange(perks) {
    const newPerks = _.map(perks, (perk) => _.pick(perk, 'name'));
    this.props.onChange(newPerks);
  }

  handleSuggestionClick(index) {
    const newSelectedPerks = update(this.state.selectedPerks, { $push: [this.state.suggestedPerks[index]] });
    this.setState({
      selectedPerks: newSelectedPerks,
      suggestedPerks: update(this.state.suggestedPerks, { [index]: { $merge: { display: false } } }),
    });
    this.handlePerksChange(newSelectedPerks);
  }

  handlePerkDelete(selectedIndex, suggestedIndex) {
    const newSelectedPerks = update(this.state.selectedPerks, { $splice: [[selectedIndex, 1]] });
    this.setState({
      selectedPerks: newSelectedPerks,
      suggestedPerks: update(this.state.suggestedPerks, { [suggestedIndex]: { $merge: { display: true } } }),
    });
    this.handlePerksChange(newSelectedPerks);
  }

  render() {
    if (_.isEmpty(this.props.suggestedPerks)) {
      return null;
    }

    return (
      <div>
        <PerksSelection perks={this.state.selectedPerks} onDelete={this.handlePerkDelete} />
        <PerksSuggestions perks={this.state.suggestedPerks} onClick={this.handleSuggestionClick} />
      </div>
    );
  }
}

