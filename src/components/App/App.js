import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { I18nextProvider } from 'react-i18next';

import { DEFAULT_LANGUAGE } from '../../helpers/consts';
import i18n from '../../helpers/i18nnext';
import { selectors as system } from '../../redux/modules/system';
import MultiLanguageRouteProvider from '../Language/MultiLanguageRouteProvider';
import Routes from './Routes';
import '../../stylesheets/Kmedia.css';

const Loader = () => (
  <div style={{
    width: '100vw',
    height: '100vh',
    backgroundColor: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}
  >
    <h1 style={{ color: 'white' }}>Loading...</h1>
  </div>
);

class App extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isAppReady: PropTypes.bool,
  };

  static defaultProps = {
    isAppReady: false,
  };

  render() {
    const { isAppReady, store, history } = this.props;

    if (isAppReady) {
      return (
        <I18nextProvider i18n={i18n} initialLanguage={DEFAULT_LANGUAGE}>
          <Provider store={store}>
            <ConnectedRouter history={history}>
              <MultiLanguageRouteProvider>
                <Routes />
              </MultiLanguageRouteProvider>
            </ConnectedRouter>
          </Provider>
        </I18nextProvider>
      );
    }

    return <Loader />;
  }
}

export default connect(
  state => ({ isAppReady: system.isReady(state.system) })
)(App);
