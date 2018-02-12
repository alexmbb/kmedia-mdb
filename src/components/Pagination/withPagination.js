import React from 'react';
import PropTypes from 'prop-types';

import { getQuery } from '../../helpers/url';
import * as shapes from '../shapes';

class withPagination extends React.Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    pageNo: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    location: shapes.HistoryLocation.isRequired,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
  };

  static getPageFromLocation(location) {
    const q = getQuery(location);
    const p = q.page ? Number.parseInt(q.page, 10) : 1;
    return Number.isNaN(p) || p <= 0 ? 1 : p;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pageSize !== this.props.pageSize){
      this.setPage(nextProps, 1);
    }
    //keep the same page on language change
    else if (nextProps.language !== this.props.language) {
        this.setPage(nextProps, this.props.pageNo);
    }
    else if (nextProps.namespace !== this.props.namespace){
        this.askForData(nextProps);
    }
  }

  setPage(props, pageNo) {
    props.setPage(props.namespace, pageNo || props.pageNo);
    this.askForData(props, pageNo);
  }

  askForData(props, page, params = {}) {
    const { namespace, fetchList, pageNo, pageSize } = props;
    fetchList(namespace, page || pageNo, { ...params, ...this.extraFetchParams(), pageSize });
  }

  // eslint-disable-next-line class-methods-use-this
  extraFetchParams() {
    // this is overridden in subclasses. Try not to modify...
    return {};
  }
}

export default withPagination;
