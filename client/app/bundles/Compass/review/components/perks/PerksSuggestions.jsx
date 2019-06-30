import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import PerkTag from './PerkTag';
import css from './PerksSuggestions.scss';

export default class PerksSuggestions extends React.Component {

  static propTypes = {
    perks: PropTypes.array,
    onClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
  }

  renderPerkSuggestions() {
    return _.map(this.props.perks, (perk, idx) => {
      if (perk.display) {
        return (
          <PerkTag key={idx} text={perk.name} onClick={() => this.props.onClick(idx)} />
        );
      }
    });
  }

  render() {
    const suggestions = this.renderPerkSuggestions();
    const containerClasses = classnames({
      [css.hide]: _.every(suggestions, _.isUndefined)
    });

    return (
      <div className={containerClasses}>
        <div className={css.suggestionsTextContainer}>
          Suggestions:
        </div>
        <div className={css.suggestionsTagsContainer}>
          {suggestions}
        </div>
      </div>
    );
  }
}

