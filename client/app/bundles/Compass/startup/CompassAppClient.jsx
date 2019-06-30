import React from 'react';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import createStore from '../store/compassStore';
import getRoutes from '../routes/routes';

export default (props) => {
  const store = createStore(props);

  // Create an enhanced history that syncs navigation events with the store
  const history = syncHistoryWithStore(
    browserHistory,
    store
  );

  history.listen((location) => {
    /*global ga*/
    ga('set', 'page', location.pathname + location.search);
    ga('send', 'pageview');
  });

  return (
    <Provider store={store}>
      <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
        {getRoutes(store)}
      </Router>
    </Provider>
  );
};
