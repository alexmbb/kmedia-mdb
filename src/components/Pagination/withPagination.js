import React from 'react';
import PropTypes from 'prop-types';

import { getQuery } from '../../helpers/url';
import * as shapes from '../shapes';

class withPagination extends React.Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    pageNo: PropTypes.number.isRequired, // eslint-disable-line react/no-unused-prop-types
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    location: shapes.HistoryLocation.isRequired, // eslint-disable-line react/no-unused-prop-types
    fetchList: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    setPage: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  };

  static getPageFromLocation(location) {
    const q = getQuery(location);
    const p = q.page ? Number.parseInt(q.page, 10) : 1;
    return Number.isNaN(p) || p <= 0 ? 1 : p;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.language !== this.props.language
      || nextProps.namespace !== this.props.namespace) {
      this.askForData(nextProps);
    }

    if (nextProps.pageSize !== this.props.pageSize) {
      this.setPage(nextProps, 1);
    }
  }

  setPage(props, pageNo) {
    props.setPage(props.namespace, pageNo || props.pageNo);
    this.askForData(props, pageNo);
  }

  askForData(props, page, params = {}) {
    const { namespace, fetchList, pageNo, pageSize } = props;
    fetchList(namespace, page || pageNo, { ...params, ...this.extraFetchParams(props), pageSize });
  }

  // eslint-disable-next-line class-methods-use-this
  extraFetchParams() {
    // this is overridden in subclasses. Try not to modify...
    return {};
  }
}

export default withPagination;
