import { createAction, handleActions } from 'redux-actions';
import identity from 'lodash/identity';

import { tracePath } from '../../helpers/utils';
import { types as settings } from './settings';

/* Types */

const FETCH_SOURCES         = 'Sources/FETCH_SOURCES';
const FETCH_SOURCES_SUCCESS = 'Sources/FETCH_SOURCES_SUCCESS';
const FETCH_SOURCES_FAILURE = 'Sources/FETCH_SOURCES_FAILURE';
const FETCH_INDEX           = 'Sources/FETCH_INDEX';
const FETCH_INDEX_SUCCESS   = 'Sources/FETCH_INDEX_SUCCESS';
const FETCH_INDEX_FAILURE   = 'Sources/FETCH_INDEX_FAILURE';
const FETCH_CONTENT         = 'Sources/FETCH_CONTENT';
const FETCH_CONTENT_SUCCESS = 'Sources/FETCH_CONTENT_SUCCESS';
const FETCH_CONTENT_FAILURE = 'Sources/FETCH_CONTENT_FAILURE';

export const types = {
  FETCH_SOURCES,
  FETCH_SOURCES_SUCCESS,
  FETCH_SOURCES_FAILURE,
  FETCH_INDEX,
  FETCH_INDEX_SUCCESS,
  FETCH_INDEX_FAILURE,
  FETCH_CONTENT,
  FETCH_CONTENT_SUCCESS,
  FETCH_CONTENT_FAILURE,
};

/* Actions */

const fetchSources        = createAction(FETCH_SOURCES);
const fetchSourcesSuccess = createAction(FETCH_SOURCES_SUCCESS);
const fetchSourcesFailure = createAction(FETCH_SOURCES_FAILURE);
const fetchIndex          = createAction(FETCH_INDEX);
const fetchIndexSuccess   = createAction(FETCH_INDEX_SUCCESS, (id, data) => ({ id, data }));
const fetchIndexFailure   = createAction(FETCH_INDEX_FAILURE, (id, err) => ({ id, err }));
const fetchContent        = createAction(FETCH_CONTENT, (id, name) => ({ id, name }));
const fetchContentSuccess = createAction(FETCH_CONTENT_SUCCESS);
const fetchContentFailure = createAction(FETCH_CONTENT_FAILURE);

export const actions = {
  fetchSources,
  fetchSourcesSuccess,
  fetchSourcesFailure,
  fetchIndex,
  fetchIndexSuccess,
  fetchIndexFailure,
  fetchContent,
  fetchContentSuccess,
  fetchContentFailure,
};

/* Reducer */

const initialState = {
  byId: {},
  roots: [],
  error: null,
  getByID: identity,
  indexById: {},
  content: {
    data: null,
    wip: false,
    err: null,
  },
};

const buildById = (items) => {
  const byId = {};

  // We BFS the tree, extracting each item by it's ID
  // and normalizing it's children
  let s = [...items];
  while (s.length > 0) {
    const node = s.pop();
    if (node.children) {
      s = s.concat(node.children);
    }
    byId[node.id] = {
      ...node,
      children: node.children ? node.children.map(x => x.id) : node,
    };
  }

  return byId;
};

export const reducer = handleActions({
  [settings.SET_LANGUAGE]: (state) => {
    const indexById = state.indexById || initialState.indexById;
    return {
      ...initialState,
      indexById
    };
  },

  [FETCH_SOURCES_SUCCESS]: (state, action) => {
    const byId = buildById(action.payload);

    // selectors
    // we keep those in state to avoid recreating them every time a selector is called
    const getByID     = id => byId[id];
    const getPath     = source => tracePath(source, getByID);
    const getPathByID = id => getPath(getByID(id));

    return {
      ...state,
      byId,
      getByID,
      getPath,
      getPathByID,
      roots: action.payload.map(x => x.id),
      error: null,
    };
  },

  [FETCH_SOURCES_FAILURE]: (state, action) => ({
    ...state,
    error: action.payload,
  }),

  [FETCH_INDEX]: (state, action) => ({
    ...state,
    indexById: {
      ...state.indexById,
      [action.payload]: { wip: true },
    }
  }),

  [FETCH_INDEX_SUCCESS]: (state, action) => {
    const { id, data } = action.payload;
    return {
      ...state,
      indexById: {
        ...state.indexById,
        [id]: { data, wip: false, err: null },
      }
    };
  },

  [FETCH_INDEX_FAILURE]: (state, action) => {
    const { id, err } = action.payload;
    return {
      ...state,
      indexById: {
        ...state.indexById,
        [id]: { err, wip: false },
      },
    };
  },

  [FETCH_CONTENT]: (state, action) => ({
    ...state,
    content: { wip: true }
  }),

  [FETCH_CONTENT_SUCCESS]: (state, action) => ({
    ...state,
    content: { data: action.payload, wip: false, err: null }
  }),

  [FETCH_CONTENT_FAILURE]: (state, action) => ({
    ...state,
    content: { wip: false, err: action.payload }
  }),

}, initialState);

/* Selectors */

const getSources    = state => state.byId;
const getRoots      = state => state.roots;
const getSourceById = state => state.getByID;
const getPath       = state => state.getPath;
const getPathByID   = state => state.getPathByID;
const getIndexById  = state => state.indexById;
const getContent    = state => state.content;

export const selectors = {
  getSources,
  getRoots,
  getSourceById,
  getPath,
  getPathByID,
  getIndexById,
  getContent,
};
