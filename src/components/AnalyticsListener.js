import React from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router';
import ReactGA from 'react-ga';

class AnalyticsListener extends React.Component {
  componentDidMount() {
    this.sendPageChange(window.location.pathname);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.sendPageChange(this.props.location.pathname)
    }
  }

  sendPageChange(path, search='') {
    let page = path + search;
    ReactGA.set({page});
    ReactGA.pageview(page);
  }

  render() {
    return null;
  }
}

AnalyticsListener.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default withRouter(AnalyticsListener);
