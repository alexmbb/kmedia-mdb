import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans, withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { Button, Container, Divider, Grid, Image, Message } from 'semantic-ui-react';

import { SEARCH_GRAMMAR_HIT_TYPES, SEARCH_INTENT_HIT_TYPES } from '../../helpers/consts';
import { isEmpty } from '../../helpers/utils';
import { getQuery } from '../../helpers/url';
import { selectors as settings } from '../../redux/modules/settings';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../redux/modules/tags';
import { filtersTransformer } from '../../filters';
import * as shapes from '../shapes';
import WipErr from '../shared/WipErr/WipErr';
import Pagination from '../Pagination/Pagination';
import ResultsPageHeader from '../Pagination/ResultsPageHeader';
import SearchResultCU from './SearchResultCU';
import SearchResultCollection from './SearchResultCollection';
import SearchResultIntent from './SearchResultIntent';
import SearchResultLandingPage from './SearchResultLandingPage';
import SearchResultTwitters from './SearchResultTwitters';
import SearchResultSource from './SearchResultSource';
import SearchResultPost from './SearchResultPost';
import DidYouMean from './DidYouMean';
import { SectionLogo } from '../../helpers/images';

class SearchResults extends Component {
  static propTypes = {
    getSourcePath: PropTypes.func,
    areSourcesLoaded: PropTypes.bool.isRequired,
    queryResult: PropTypes.shape({
      intents: PropTypes.arrayOf(PropTypes.shape({
        language: PropTypes.string,
        type: PropTypes.string,
        value: PropTypes.shape({}),
      })),
      search_result: PropTypes.shape({})
    }),
    cMap: PropTypes.objectOf(shapes.Collection),
    cuMap: PropTypes.objectOf(shapes.ContentUnit),
    twitterMap: PropTypes.objectOf(shapes.Tweet),
    pageNo: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
    handlePageChange: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
      ]))
    })).isRequired,
    location: shapes.HistoryLocation.isRequired,
    click: PropTypes.func.isRequired,
    postMap: PropTypes.objectOf(PropTypes.shape({
      blog: PropTypes.string,
      content: PropTypes.string,
      created_at: PropTypes.string,
      title: PropTypes.string,
      url: PropTypes.string,
      wp_id: PropTypes.number,
    })).isRequired,
    hitType: PropTypes.shape({}),
    contentLanguage: PropTypes.string.isRequired,
  };

  static defaultProps = {
    queryResult: null,
    cMap: {},
    cuMap: {},
    twitterMap: {},
    wip: false,
    err: null,
    getSourcePath: undefined,
    hitType: undefined,
  };

  state = {
    showNote: true
  };

  filterByHitType = (hit) => {
    const { hitType } = this.props;
    return hitType ? hit.type === hitType : true;
  };

  renderHit = (hit, rank) => {
    const { cMap, cuMap, postMap }                                                                          = this.props;
    const { _source: { mdb_uid: mdbUid, result_type: resultType, landing_page: landingPage }, _type: type } = hit;

    const props = { ...this.props, hit, rank, key: `${mdbUid || landingPage}_${type}` };

    if (SEARCH_GRAMMAR_HIT_TYPES.includes(type)) {
      return <SearchResultLandingPage {...props} />;
    }

    // To be deprecated soon.
    if (SEARCH_INTENT_HIT_TYPES.includes(type)) {
      return <SearchResultIntent {...props} />;
    }

    if (type === 'tweets_many') {
      return <SearchResultTwitters  {...props} />;
    }

    let result = null;
    const cu   = cuMap[mdbUid];
    const c    = cMap[mdbUid];
    const p    = postMap[mdbUid];

    if (cu) {
      result = <SearchResultCU {...props} cu={cu} />;
    } else if (c) {
      result = <SearchResultCollection c={c} {...props} />;
    } else if (p) {
      return <SearchResultPost {...props} post={p} />;
    } else if (resultType === 'sources') {
      result = <SearchResultSource {...props} />;
    }

    // maybe content_units are still loading ?
    // maybe stale data in elasticsearch ?
    return result;
  };

  hideNote = () => this.setState({ showNote: false });

  renderTopNote = () => {
    const { t, contentLanguage } = this.props;
    const language               = t(`constants.languages.${contentLanguage}`);
    return (
      this.state.showNote
        ? (
          <Message info className="search-result-note">
            <Image floated="left">
              <SectionLogo name='info' />
            </Image>
            <Button floated="right" icon="close" size="tiny" circular onClick={this.hideNote} />
            <Container>
              <strong>
                {t('search.topNote.tip')}
                :
                {' '}
              </strong>
              {t('search.topNote.first', { language })}
            </Container>
            <Container>{t('search.topNote.second')}</Container>
          </Message>
        )
        : null
    );
  };

  render() {
    const
      {
        filters,
        wip,
        err,
        queryResult,
        areSourcesLoaded,
        pageNo,
        pageSize,
        language,
        t,
        handlePageChange,
        location,
      } = this.props;

    const wipErr = WipErr({ wip: wip || !areSourcesLoaded, err, t });
    if (wipErr) {
      return wipErr;
    }

    // Query from URL (not changed until pressed Enter)
    const query = getQuery(location).q;

    if (query === '' && !Object.values(filtersTransformer.toApiParams(filters)).length) {
      return <div>{t('search.results.empty-query')}</div>;
    }

    const { search_result: results, typo_suggest } = queryResult;

    if (isEmpty(results)) {
      return null;
    }

    const { /* took, */ hits: { total, hits } } = results;
    // Elastic too slow and might fails on more than 1k results.
    const totalForPagination                    = Math.min(1000, total);

    let content;
    if (total === 0) {
      content = (
        <Trans i18nKey="search.results.no-results">
          Your search for
          <strong style={{ fontStyle: 'italic' }}>{{ query }}</strong>
          found no results.
        </Trans>
      );
    } else {
      content = (
        <Grid>
          <Grid.Column key="1" computer={12} tablet={16} mobile={16}>
            {/* Requested by Mizrahi this.renderTopNote() */}
            {typo_suggest
              ? <DidYouMean typo_suggest={typo_suggest} />
              : null
            }

            <div className="searchResult_content">
              <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} t={t} />
              {hits.filter(this.filterByHitType).map(this.renderHit)}
            </div>
            <Divider fitted />

            <Container className="padded pagination-wrapper" textAlign="center">
              <Pagination
                pageNo={pageNo}
                pageSize={pageSize}
                total={totalForPagination}
                language={language}
                onChange={handlePageChange}
              />
            </Container>
          </Grid.Column>
          <Grid.Column key="2" />
        </Grid>
      );
    }
    return content;
  }
}

export default connect(state => ({
  filters: filterSelectors.getFilters(state.filters, 'search'),
  areSourcesLoaded: sourcesSelectors.areSourcesLoaded(state.sources),
  getSourcePath: sourcesSelectors.getPathByID(state.sources),
  getSourceById: sourcesSelectors.getSourceById(state.sources),
  getTagById: tagsSelectors.getTagById(state.tags),
  contentLanguage: settings.getContentLanguage(state.settings),
}))(withNamespaces()(SearchResults));
