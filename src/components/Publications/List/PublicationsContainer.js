import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/publications';
import { selectors as settings } from '../../../redux/modules/settings';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as filters } from '../../../redux/modules/filters';
import * as shapes from '../../shapes';
import withPagination from '../../pagination/withPagination';
import Publications from './Publications';

class PublicationsContainer extends withPagination {

  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    items: PropTypes.arrayOf(shapes.Article),
    wip: shapes.WIP,
    err: shapes.Error,
    pageNo: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    isFiltersHydrated: PropTypes.bool,
    fetchList: PropTypes.func.isRequired,
    setPage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
    isFiltersHydrated: false,
  };

  componentDidMount() {
    // If filters are already hydrated, handleFiltersHydrated won't be called.
    // We'll have to ask for data here instead.
    if (this.props.isFiltersHydrated) {
      withPagination.askForData(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { language } = nextProps;

    if (language !== this.props.language) {
      withPagination.askForData(nextProps);
    }

    super.componentWillReceiveProps(nextProps);
  }

  handlePageChanged = pageNo =>
    withPagination.handlePageChange(this.props, pageNo);

  handleFiltersChanged = () =>
    withPagination.handlePageChange(this.props, 1);

  handleFiltersHydrated = () =>
    withPagination.handlePageChange(this.props);

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
  const paging = withPagination.mapState('publications', state, selectors, settings);

  return {
    items: selectors.getItems(state.publications)
      .map(x => mdb.getDenormContentUnit(state.mdb, x)),
    wip: selectors.getWip(state.publications).list,
    err: selectors.getErrors(state.publications).list,
    pageNo: paging.pageNo,
    total: paging.total,
    pageSize: settings.getPageSize(state.settings),
    language: settings.getLanguage(state.settings),
    isFiltersHydrated: filters.getIsHydrated(state.filters, 'publications'),
  };
};

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchList: actions.fetchList,
    setPage: actions.setPage,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(PublicationsContainer);
