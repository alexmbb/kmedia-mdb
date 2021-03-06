import { call, put, select, takeLatest } from 'redux-saga/effects';

import Api from '../helpers/Api';
import { CT_LECTURE_SERIES, CT_LESSONS_SERIES, CT_VIRTUAL_LESSONS, } from '../helpers/consts';
import { actions, selectors, types } from '../redux/modules/lessons';
import { types as listTypes } from '../redux/modules/lists';
import { actions as mdbActions } from '../redux/modules/mdb';
import { selectors as settings } from '../redux/modules/settings';
import { isEmpty } from '../helpers/utils';
import { setTab } from './helpers/url';

function* fetchLecturesList(action) {
  if (action.payload.namespace !== 'lessons-virtual'
    && action.payload.namespace !== 'lessons-lectures') {
    return;
  }
  try {
    // fetch once
    const lectures = yield select(state => selectors.getLecturesByType(state.lessons));
    if (!isEmpty(lectures)) {
      return;
    }

    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.collections, {
      language,
      content_type: [CT_VIRTUAL_LESSONS, CT_LECTURE_SERIES],
      pageNo: 1,
      pageSize: 1000,
      with_units: false,
    });

    if (Array.isArray(data.collections)) {
      yield put(mdbActions.receiveCollections(data.collections));
      yield put(actions.receiveLectures(data.collections));
    }
  } catch (err) {
    console.log('fetch lectures error', err);
  }
}

export function* fetchAllSeries(action) {
  try {
    const language = yield select(state => settings.getLanguage(state.settings));
    const { data } = yield call(Api.collections, {
      ...action.payload,
      contentTypes: [CT_LESSONS_SERIES],
      language,
      pageNo: 1,
      pageSize: 1000, // NOTE: we need to get all, and the endpoint lets us fetch only with pagination,
      with_units: false,
    });
    yield put(mdbActions.receiveCollections(data.collections));
    yield put(actions.fetchAllSeriesSuccess(data));
  } catch (err) {
    yield put(actions.fetchAllSeriesFailure(err));
  }
}

function* watchFetchList() {
  yield takeLatest(listTypes.FETCH_LIST, fetchLecturesList);
}

function* watchFetchAllSeries() {
  yield takeLatest(types.FETCH_ALL_SERIES, fetchAllSeries);
}

function* watchSetTab() {
  yield takeLatest(types.SET_TAB, setTab);
}

export const sagas = [
  watchFetchList,
  watchFetchAllSeries,
  watchSetTab,
];
