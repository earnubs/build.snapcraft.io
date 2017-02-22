import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import { syncHistoryWithStore } from 'react-router-redux';

import routes from './routes';
import store from './store';

const history = syncHistoryWithStore(browserHistory, store);


export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router routes={routes} history={history} />
      </Provider>
    );
  }
}
