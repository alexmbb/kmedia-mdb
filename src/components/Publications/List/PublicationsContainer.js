import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { CT_ARTICLE } from '../../../helpers/consts';
import { actions as listsActions, selectors as lists } from '../../../redux/modules/lists';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as filters } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import withPagination from '../../pagination/withPagination2';
import Publications from './Publications';

class PublicationsContainer extends withPagination {

  static propTypes = {
    namespace: PropTypes.string.isRequired,
    location: shapes.HistoryLocation.isRequired,
    items: PropTypes.arrayOf(shapes.Article),
    wip: shapes.WIP,
    err: shapes.Error,
    pageNo: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
    isFiltersHydrated: PropTypes.bool,
  };

  static defaultProps = {
    items: [],
    isFiltersHydrated: false,
  };

  componentDidMount() {
    // If filters are already hydrated, handleFiltersHydrated won't be called.
    // We'll have to ask for data here instead.
    if (this.props.isFiltersHydrated) {
      this.askForData(this.props);
    }
  }

  extraFetchParams() {
    return { content_type: [CT_ARTICLE] };
  }

  handlePageChanged = pageNo =>
    this.setPage(this.props, pageNo);

  handleFiltersChanged = () =>
    this.handlePageChanged(1);

  handleFiltersHydrated = () => {
    const p = this.getPageFromLocation(this.props.location);
    this.handlePageChanged(p);
  };

  render() {
    const { items, wip, err, pageNo, total, pageSize, language } = this.props;

    return (
      <Publications
        items={items}
        wip={wip}
        err={err}
        pageNo={pageNo}
        total={total}
        pageSize={pageSize}
        language={language}
        onPageChange={this.handlePageChanged}
        onFiltersChanged={this.handleFiltersChanged}
        onFiltersHydrated={this.handleFiltersHydrated}
      />
    );
  }
}

const mapState = (state) => {
  const namespace = 'publications';
  const nsState   = lists.getNamespaceState(state.lists, namespace);

  return {
    namespace,
    items: (nsState.items || []).map(x => mdb.getDenormContentUnit(state.mdb, x)),
    wip: nsState.wip,
    err: nsState.err,
    pageNo: nsState.pageNo,
    total: nsState.total,
    pageSize: settings.getPageSize(state.settings),
    language: settings.getLanguage(state.settings),
    isFiltersHydrated: filters.getIsHydrated(state.filters, namespace),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: listsActions.fetchList,
    setPage: listsActions.setPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(PublicationsContainer);
