import PropTypes from 'prop-types';
import React from 'react';
import css from './SearchAutoCompleteInput.scss';
import { withRouter } from 'react-router';
import AutoSuggest from 'react-autosuggest';
import { get } from '../../utils/ajaxCamelCase';
import _ from 'lodash';

class SearchAutoCompleteInput extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired, // Distinguish AutoSuggests from each other
    autoFocus: PropTypes.bool.isRequired,
    locationFilter: PropTypes.array.isRequired,
    onChange: PropTypes.func,
    order: PropTypes.string,
    queryString: PropTypes.string,
    // Object whose keys match CSS classes from https://github.com/moroshko/react-autosuggest#theme-optional
    // and whose values are the actual CSS class's name (e.g. {input: css.input} if using CSS modules)
    searchBoxCSS: PropTypes.object,
    width: PropTypes.string.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  };

  static defaultProps = {
    id: 'default',
    autoFocus: false,
  };

  constructor() {
    super();

    this.state = {
      value: null,
      suggestions: [],
      namesToSlugs: {},
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSuggestionsUpdateRequested = this.handleSuggestionsUpdateRequested.bind(this);
    this.handleSuggestionSelected = this.handleSuggestionSelected.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
  }

  getSuggestionValue(suggestion) {
    return suggestion;
  }

  getSuggestions(value) {
    if (!value || value.trim().length < 1) {
      this.setState({
        suggestions: [],
        namesToSlugs: {},
      });
      return;
    }

    const self = this;

    get({
      url: '/suggest',
      data: { query: '\"' + value + '\"' },
      dataType: 'json',
      success: function(data) {
        if (value === self.state.value) {
          self.setState({
            suggestions: data.names,
            namesToSlugs: data.slugs,
          });
        }
      }
    });
  }

  handleChange(event, { newValue }) {
    this.setState({
      value: newValue
    });
    if (this.props.onChange) {
      this.props.onChange(newValue);
    }
  }

  handleSuggestionsUpdateRequested({ value }) {
    this.getSuggestions(value);
  }

  // Full signature: (https://github.com/moroshko/react-autosuggest#onsuggestionselected-optional)
  // event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  handleSuggestionSelected(event, { suggestionValue }) {
    const slug = this.state.namesToSlugs[suggestionValue];
    this.props.router.push(`/companies/${slug}`);
    event.preventDefault();
  }

  renderSuggestion(suggestion, { value, valueBeforeUpDown }) {
    if (valueBeforeUpDown && (value !== suggestion) && (value !== valueBeforeUpDown)) {
      return <span>{suggestion}</span>;
    }

    const valueLen = value.length;
    // Find the position in the suggestion corresponding to where we want to bold
    const start = suggestion.toLowerCase().indexOf(value.trim().toLowerCase());
    const bolded = suggestion.substring(start, start + valueLen);
    const leading = suggestion.substring(0, start);
    const trailing = suggestion.substring(start + valueLen, suggestion.length);

    return (
      <span>
        {leading}
        <strong>{bolded}</strong>
        {trailing}
      </span>
    );
  }

  render() {
    const { suggestions } = this.state;
    let { value } = this.state;
    let { queryString } = this.props;

    if (queryString && value === null) {
      value = queryString;
    }

    value = value || '';

    const inputProps = {
      placeholder: 'Search for companies...',
      value,
      autoFocus: this.props.autoFocus,
      onChange: this.handleChange,
    };

    const theme = css;
    if (this.props.searchBoxCSS) {
      _.assign(css, this.props.searchBoxCSS);
    }

    return (
      <div className={css.inputParent} style={{ width: this.props.width }}>
        <AutoSuggest
          theme={theme}
          suggestions={suggestions}
          onSuggestionsUpdateRequested={this.handleSuggestionsUpdateRequested}
          onSuggestionSelected={this.handleSuggestionSelected}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
        <input type='hidden' name='query' value={value} />
        <input type='hidden' name='page' value='1' />
        <input type='hidden' name='order' value={this.props.order} />
        <input type='hidden' name='location_filter[]' multiple='multiple' value={this.props.locationFilter} />
      </div>
    );
  }
}

export default withRouter(SearchAutoCompleteInput);

