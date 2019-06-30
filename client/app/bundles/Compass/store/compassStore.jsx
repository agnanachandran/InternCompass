import { compose, createStore, applyMiddleware } from 'redux';

// See
// https://github.com/gaearon/redux-thunk and http://redux.js.org/docs/advanced/AsyncActions.html
// This is not actually used for this simple example, but you'd probably want to use this
// once your app has asynchronous actions.
import thunkMiddleware from 'redux-thunk';

// This provides an example of logging redux actions to the console.
// You'd want to disable this for production.

import reducer from '../reducers';
import { initialState } from '../reducers';
import { camelize } from '../utils/deepCamelCase';
import _ from 'lodash';

export default (props) => {
  const camelCaseProps = camelize(props);
  let mergedInitialState = _.merge(initialState, camelCaseProps);
  const composedStore = compose(
    applyMiddleware(thunkMiddleware)
  );
  const storeCreator = composedStore(createStore);
  const store = storeCreator(reducer, mergedInitialState);

  return store;
};
