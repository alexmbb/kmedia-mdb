import React, { Component } from 'react';
import ReactGA from 'react-ga';

import { HistoryLocation } from '../../shapes';

class GAPageView extends Component {
  componentDidMount() {
    // Initial page load - only fired once
    const { location } = this.props;
    this.sendPageChange(location.pathname, location.search);
  }

  componentWillReceiveProps(nextProps) {
    // When props change, check if the URL has changed or not
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.sendPageChange(nextProps.location.pathname, nextProps.location.search);
    }
  }

  sendPageChange = (pathname, search = '') => {
    const page = pathname + search;
    ReactGA.set({ page });
    ReactGA.pageview(page);
  };

  render() {
    return <div />;
  }
}

GAPageView.propTypes = {
  location: HistoryLocation.isRequired
};

export default GAPageView;
