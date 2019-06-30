import PropTypes from 'prop-types';
import React from 'react';

export default class TextInput extends React.Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    children: PropTypes.array,
    id: PropTypes.string,
    submitText: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  };

  render() {
    const { action, children, id, submitText, token } = this.props;
    return (
      <form id={id} action={action} method='post' acceptCharset='UTF-8'>
        <input type='hidden' name='authenticity_token' value={token}/>
        <input name='utf8' type='hidden' value='✓'/>
        {children}
        <input type='submit' name='commit' value={submitText}/>
      </form>
    );
  }
}