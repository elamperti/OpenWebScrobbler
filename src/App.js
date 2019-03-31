import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import ReactGA from 'react-ga';
import get from 'lodash/get';

import axios from 'axios';
import qs from 'qs';

import {
  getUserInfo,
  logOut,
} from './store/actions/userActions';
import { createAlert } from './store/actions/alertActions';

import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import AlertZone from './components/AlertZone';
import AnalyticsListener from './components/AnalyticsListener';
import UpdateToast from './components/UpdateToast';

import Home from './views/Home';
import ScrobbleSong from './views/ScrobbleSong';
import ScrobbleAlbum from './views/ScrobbleAlbum';
import ScrobbleUser from './views/ScrobbleUser';

class App extends Component {
  constructor(props) {
    super(props);
    this.props.getUserInfo();

    let axiosErrorHandler = (payload) => {
      let errorNumber = payload ? get(payload, 'data.error', payload.status) : -1;
      let newError = {
        type: 'danger',
        persistent: false,
        title: '',
        message: null,
        rawMessage: null,
      };
      let showErrorNumber = false;

      switch (errorNumber) {
        case 4: // Authentication Failed
          newError.type = 'danger';
          newError.message = 'authFailed';
          break;
        case 9: // Invalid session key
        case 17: // User must be logged in
          newError.type = 'warning';
          newError.message = 'loginAgain';
          newError.persistent = true;
          showErrorNumber = true;
          this.props.logOut(newError);
          break;
        case 11: // Service offline
        case 16: // Service temporarily unavailable
          newError.title = 'serviceUnavailable';
          newError.message = 'lastfmUnavailable';
          showErrorNumber = true;
          break;
        case 13: // Invalid method signature supplied
        case 26: // API key suspended
        case 29: // Rate limit exceeded
        default:
          newError.title = 'unexpectedError';
          newError.rawMessage = get(payload, 'data.message', null);
          showErrorNumber = true;
      }

      if (newError.message !== 'loginAgain') { // errors 9 and 17 already trigger an alert
        this.props.createAlert({
          ...newError,
          errorNumber: showErrorNumber ? errorNumber : null,
        });
      }
    }

    let axiosTiming = (response) => {
      if (response.config.timing) {
        response.config.timing.elapsedTime = performance.now() - response.config.timing.start;
      }
    }

    axios.interceptors.request.use(
      (request) => {
        request.timing = {
          start: performance.now(),
        }
        if (request.method === 'post') { // PHP doesn't understand JSON payloads
          request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          request.data = qs.stringify(request.data);
        }
        return request;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => {
        axiosTiming(response);
        if (response.config.url.match(/^\/api/)) {
          switch (response.status) {
            case 503:
              ReactGA.exception({
                description: 'Rate limit hit',
                fatal: false
              });
              break;
            case 401:
              ReactGA.exception({
                description: 'Invalid session key',
                fatal: true
              });
              this.props.logOut({
                type: 'warning',
                message: 'loginAgain',
                persistent: true,
                showErrorNumber: true,
                errorNumber: 401,
              });
              break;
            default:
              break;
          }
          if (response.config.timing) {
            ReactGA.timing({
              category: 'Client response time',
              variable: response.config.url,
              value: Math.round(response.config.timing.elapsedTime)
            });
          }
          if (response.data.error) {
            axiosErrorHandler(response);
          }
        }
        return response;
      },
      (error) => {
        axiosErrorHandler(error.response);
        return Promise.reject(error.response);
      }
    );
  }

  render() {
    return (
      <BrowserRouter>
        <div className="d-flex flex-column h-100">
          { process.env.REACT_APP_ANALYTICS_CODE ? <AnalyticsListener /> : null }
          <Navigation />
          { this.props.updates.newVersionReady ? <UpdateToast /> : null }

          <div className="container">
            <AlertZone />
          </div>
          <main className="container flex-wrap flex-grow-1">
            <Switch>
              <PrivateRoute exact path="/scrobble/song" component={ScrobbleSong} />
              <PrivateRoute exact path="/scrobble/album" component={ScrobbleAlbum} />
              <PrivateRoute exact path="/scrobble/user/:username?" component={ScrobbleUser} />
              <Route exact path="/" component={Home} />
              <Redirect to="/" />
            </Switch>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    updates: state.updates,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserInfo: getUserInfo(dispatch),
    createAlert: createAlert(dispatch),
    logOut: logOut(dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  translate(['common', 'alerts'])(App)
);
