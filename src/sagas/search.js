import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { getQuery, updateQuery as urlUpdateQuery } from './helpers/url';
import { actions, selectors, types } from '../redux/modules/search';
import { selectors as settings } from '../redux/modules/settings';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as filterSelectors } from '../redux/modules/filters';
import { filtersTransformer } from '../filters';

function* autocomplete(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const resp     = yield call(Api.autocomplete, { q: action.payload, language });
    yield put(actions.autocompleteSuccess(resp));
  } catch (err) {
    yield put(actions.autocompleteFailure(err));
  }
}

function* search(action) {
  try {
    yield* urlUpdateQuery(query => Object.assign(query, { q: action.payload.q }));

    const language = yield select(state => settings.getLanguage(state.settings));
    const sortBy = yield select(state => selectors.getSortBy(state.search));

    // Prepare filters values.
    const filters = yield select(state => filterSelectors.getFilters(state.filters, 'search'));
    const params  = filtersTransformer.toApiParams(filters);
    const filterQuery = Object.entries(params).map(([v, k]) => `${v}:${k}`).join(' ')

    const q = action.payload.q ? `${action.payload.q} ${filterQuery}` : filterQuery;
    if (!q) {
      // If no query nor filters, silently fail the request, don't sent request to backend.
      yield put(actions.searchFailure(null));
      return
    }
    const resp     = yield call(Api.search, { q, sortBy, language });

    if (Array.isArray(resp.hits.hits) && resp.hits.hits.length > 0) {
      // TODO edo: optimize data fetching
      // Here comes another call for all content_units we got
      // in order to fetch their possible additional collections.
      // We need this to show 'related to' second line in list.
      // This second round trip to the API is awful,
      // we should strive for a single call to the API and get all the data we need.
      // hmm, relay..., hmm ?
      const cuIDsToFetch = resp.hits.hits.reduce((acc, val) => {
        return acc.concat(val._source.mdb_uid);
      }, []);
      const language     = yield select(state => settings.getLanguage(state.settings));
      const pageSize     = cuIDsToFetch.length;
      const resp2        = yield call(Api.units, { id: cuIDsToFetch, pageSize, language });

      yield put(mdbActions.receiveContentUnits(resp2.content_units));
    }

    yield put(actions.searchSuccess(resp));
  } catch (err) {
    yield put(actions.searchFailure(err));
  }
}

function* updatePageInQuery(action) {
  const page = action.payload > 1 ? action.payload : null;
  yield* urlUpdateQuery(query => Object.assign(query, { page }));
}

function* updateSortByInQuery(action) {
  const sortBy = action.payload;
  yield* urlUpdateQuery(query => Object.assign(query, { sort_by: sortBy }));
}

function* hydrateUrl() {
  const query            = yield* getQuery();
  const { q, page = '1'} = query;

  if (q) {
    if (query.sort_by) {
      yield put(actions.setSortBy(query.sort_by));
    }

    let pageSize = query.page_size;
    if (!pageSize) {
      pageSize = yield select(state => settings.getPageSize(state.settings));
    }

    const pageNo = parseInt(page, 10);

    yield put(actions.search(q, pageNo, pageSize));
    yield put(actions.setPage(pageNo));
  }
}

function* watchAutocomplete() {
  yield takeLatest(types.AUTOCOMPLETE, autocomplete);
}

function* watchSearch() {
  yield takeLatest(types.SEARCH, search);
}

function* watchSetPage() {
  yield takeLatest(types.SET_PAGE, updatePageInQuery);
}

function* watchSetSortBy() {
  yield takeLatest(types.SET_SORT_BY, updateSortByInQuery);
}

function* watchHydrateUrl() {
  yield takeLatest(types.HYDRATE_URL, hydrateUrl);
}

export const sagas = [
  watchAutocomplete,
  watchSearch,
  watchSetPage,
  watchSetSortBy,
  watchHydrateUrl,
];
