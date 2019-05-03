import { createAction } from 'redux-actions';

import { handleActions, types as settings } from './settings';
import { types as ssr } from './ssr';

/* Types */
const FETCH_DATA           = 'Home/FETCH_DATA';
const FETCH_DATA_SUCCESS   = 'Home/FETCH_DATA_SUCCESS';
const FETCH_DATA_FAILURE   = 'Home/FETCH_DATA_FAILURE';
const FETCH_BANNER         = 'Assets/FETCH_BANNER';
const FETCH_BANNER_SUCCESS = 'Assets/FETCH_BANNER_SUCCESS';
const FETCH_BANNER_FAILURE = 'Assets/FETCH_BANNER_FAILURE';

export const types = {
  FETCH_DATA,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
  FETCH_BANNER,
  FETCH_BANNER_SUCCESS,
  FETCH_BANNER_FAILURE,
};

/* Actions */

const fetchData          = createAction(FETCH_DATA);
const fetchDataSuccess   = createAction(FETCH_DATA_SUCCESS);
const fetchDataFailure   = createAction(FETCH_DATA_FAILURE);
const fetchBanner        = createAction(FETCH_BANNER);
const fetchBannerSuccess = createAction(FETCH_BANNER_SUCCESS);
const fetchBannerFailure = createAction(FETCH_BANNER_FAILURE);

export const actions = {
  fetchData,
  fetchDataSuccess,
  fetchDataFailure,
  fetchBanner,
  fetchBannerSuccess,
  fetchBannerFailure,
};

/* Reducer */

const initialState = {
  latestLesson: null,
  latestUnits: null,
  banner: {
    data: {},
    wip: false,
    err: null,
  },
  wip: false,
  err: null,
};

const onSetLanguage = (draft) => {
  draft.latestLesson = null;
  draft.latestUnits  = null;
  draft.banner       = null;
  draft.wip          = false;
  draft.err          = null;
};

const onData = draft => {
  draft.wip = true;
};

const onDataSuccess = (draft, payload) => {
  draft.wip          = false;
  draft.err          = null;
  draft.latestLesson = payload.latest_daily_lesson.id;
  draft.latestUnits  = payload.latest_units.map(x => x.id);
  draft.banner       = payload.banner;
};

const onDataFailure = (draft, payload) => {
  draft.wip  = false;
  draft.data = null;
  draft.err  = payload;
};

const onFetchBanner = draft => {
  draft.banner.wip  = true;
  draft.banner.data = {};
};

const onFetchBannerSuccess = (draft, payload) => {
  draft.banner.wip  = false;
  draft.banner.err  = null;
  draft.banner.data = payload.content;
};

const onFetchBannerFailure = (draft, payload) => {
  draft.banner.wip  = false;
  draft.banner.data = null;
  draft.banner.err  = payload;
};

const onSSRPrepare = draft => {
  if (draft.err) {
    draft.err = draft.err.toString();
  }
};

export const reducer = handleActions({
  [ssr.PREPARE]: onSSRPrepare,

  [settings.SET_LANGUAGE]: onSetLanguage,

  [FETCH_DATA]: onData,
  [FETCH_DATA_SUCCESS]: onDataSuccess,
  [FETCH_DATA_FAILURE]: onDataFailure,

  [FETCH_BANNER]: onFetchBanner,
  [FETCH_BANNER_SUCCESS]: onFetchBannerSuccess(),
  [FETCH_BANNER_FAILURE]: onFetchBannerFailure,
}, initialState);

/* Selectors */

const getLatestLesson = state => state.latestLesson;
const getLatestUnits  = state => state.latestUnits;
const getBanner       = state => state.banner;
const getWip          = state => state.wip;
const getError        = state => state.err;

export const selectors = {
  getLatestLesson,
  getLatestUnits,
  getBanner,
  getWip,
  getError,
};
