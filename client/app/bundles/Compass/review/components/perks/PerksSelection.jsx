import PropTypes from 'prop-types';
import React from 'react';
import PerkTag from './PerkTag';
import _ from 'lodash';
import css from './PerksSelection.scss';

export default class PerksSelection extends React.Component {
  static propTypes = {
    perks: PropTypes.array,
    onDelete: PropTypes.func.isRequired,
  };

  renderPerks() {
    return _.map(this.props.perks, (perk, idx) =>
      <PerkTag key={idx} text={perk.name} onDelete={() => this.props.onDelete(idx, perk.index)} />
    );
  }

  renderPerksTagsContainer() {
    if (this.props.perks && this.props.perks.length > 0) {
      return (
        <div className={css.perksTagsContainer}>
          {this.renderPerks()}
        </div>
      );
    }
    return (
      <span className={css.noPerksText}>Select from the suggestions below</span>
    );
  }

  render() {
    return (
      <div className={css.container}>
        <div className={css.perksTextContainer}>
          Perks:
        </div>
        {this.renderPerksTagsContainer()}
      </div>
    );
  }
}



