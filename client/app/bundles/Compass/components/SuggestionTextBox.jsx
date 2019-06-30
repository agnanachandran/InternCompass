import PropTypes from 'prop-types';
import React from 'react';
import css from './SuggestionTextBox.scss';
import AutoSuggest from 'react-autosuggest';
import { get } from '../utils/ajaxCamelCase';
import { isMobileDevice } from '../utils/utils';
import { dataSources, dataSourcesToUrls } from '../constants/compassConstants';
import _ from 'lodash';

export default class SuggestionTextBox extends React.PureComponent {
  static propTypes = {
    dataSource: PropTypes.string.isRequired,
    queryParams: PropTypes.object,
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired, // value for input
    onValueChanged: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      suggestions: [],
    };

    this.handleSuggestionsUpdateRequested = this.handleSuggestionsUpdateRequested.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.getSuggestionValue = this.getSuggestionValue.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getSearchUrlForSource = this.getSearchUrlForSource.bind(this);
    this.getSearchQueryParametersForSource = this.getSearchQueryParametersForSource.bind(this);
  }

  componentDidMount() {
    if (this.props.autoFocus && this.inputBox && !isMobileDevice()) {
      this.inputBox.focus();
    }
  }

  handleChange(event, { newValue }) {
    this.props.onValueChanged(newValue);
  }

  handleSuggestionsUpdateRequested({ value }) {
    this.getSuggestions(value);
  }

  getSearchQueryParametersForSource(value) {
    const { dataSource, queryParams } = this.props;
    const newQueryParams = { query: `"${value}"` };

    switch (dataSource) {
      case dataSources.COMPANY:
        return newQueryParams;
      case dataSources.JOB:
        return _.merge(newQueryParams, queryParams);
      default:
        return {};
    }
  }

  getSuggestions(value) {
    if (!value || value.trim().length < 2) {
      this.setState({
        suggestions: [],
      });
      return [];
    }

    const url = this.getSearchUrlForSource();
    const params = this.getSearchQueryParametersForSource(value);

    get({
      url: url,
      data: params,
      success: (data) => {
        if (value === this.props.value) {
          this.setState({
            suggestions: data.names || data,
          });
        }
      }
    });
  }

  getSearchUrlForSource() {
    const { dataSource } = this.props;
    return (dataSource in dataSourcesToUrls) ? dataSourcesToUrls[dataSource] : '';
  }

  getSuggestionValue(suggestion) {
    return suggestion;
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
    const inputProps = {
      placeholder: '',
      value: this.props.value,
      onChange: this.handleChange,
    };

    return (
      <span>
        <AutoSuggest
          id={this.props.id}
          theme={css}
          suggestions={this.state.suggestions}
          onSuggestionsUpdateRequested={this.handleSuggestionsUpdateRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          ref={(autosuggest) => {
            if (autosuggest) {
              this.inputBox = autosuggest.input;
            }
          }}
        />
        <input type='hidden' value={this.props.value} />
      </span>
    );
  }
}
