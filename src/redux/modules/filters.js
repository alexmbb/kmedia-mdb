import { createAction, handleActions } from 'redux-actions';
import isFunction from 'lodash/isFunction';
import isEqual from 'lodash/isEqual';

/* Types */

const STOP_EDITING_FILTER = 'Filters/STOP_EDITING_FILTER';
const CLOSE_ACTIVE_FILTER = 'Filters/CLOSE_ACTIVE_FILTER';
const EDIT_NEW_FILTER = 'Filters/EDIT_NEW_FILTER';
const EDIT_EXISTING_FILTER = 'Filters/EDIT_EXISTING_FILTER';

const ADD_FILTER_VALUE  = 'Filters/ADD_FILTER_VALUE';
const SET_FILTER_VALUE  = 'Filters/SET_FILTER_VALUE';
const REMOVE_FILTER_VALUE = 'Filters/REMOVE_FILTER_VALUE';
const SET_HYDRATED_FILTER_VALUES = 'Filters/SET_HYDRATED_FILTER_VALUES';
const HYDRATE_FILTERS = 'Filters/HYDRATE_FILTERS';
const FILTERS_HYDRATED = 'Filters/FILTERS_HYDRATED';

export const types = {
  STOP_EDITING_FILTER,
  CLOSE_ACTIVE_FILTER,
  EDIT_NEW_FILTER,
  EDIT_EXISTING_FILTER,

  ADD_FILTER_VALUE,
  SET_FILTER_VALUE,
  REMOVE_FILTER_VALUE,
  SET_HYDRATED_FILTER_VALUES,
  HYDRATE_FILTERS,
  FILTERS_HYDRATED
};

/* Actions */

const stopEditingFilter = createAction(STOP_EDITING_FILTER, (namespace, name) => ({ namespace, name }));
const closeActiveFilter = createAction(CLOSE_ACTIVE_FILTER, (namespace, name) => ({ namespace, name }));
const editNewFilter = createAction(EDIT_NEW_FILTER, (namespace, name) => ({ namespace, name }));
const editExistingFilter = createAction(EDIT_EXISTING_FILTER, (namespace, name, index = 0) => ({ namespace, name, index }));

const addFilterValue = createAction(ADD_FILTER_VALUE, (namespace, name, value, index) => ({ namespace, name, value, index }));
const setFilterValue = createAction(SET_FILTER_VALUE, (namespace, name, value) => ({ namespace, name, value }));
const removeFilterValue = createAction(REMOVE_FILTER_VALUE, (namespace, name, value) => ({ namespace, name, value }));
const setHydratedFilterValues = createAction(
  SET_HYDRATED_FILTER_VALUES,
  (namespace, filters) => ({ namespace, filters })
);
const hydrateFilters = createAction(HYDRATE_FILTERS, (namespace, from = 'query') => ({ namespace, from }));
const filtersHydrated = createAction(FILTERS_HYDRATED, namespace => ({ namespace }));

export const actions = {
  stopEditingFilter,
  closeActiveFilter,
  editNewFilter,
  editExistingFilter,

  addFilterValue,
  setFilterValue,
  removeFilterValue,
  setHydratedFilterValues,
  hydrateFilters,
  filtersHydrated
};

/* Reducer */

const initialState = {};

const setFilterState = (state, namespace, name, newFilterStateReducer) => {
  const oldNamespace = state[namespace] || { [name]: {}, activeFilter: '' };
  if (!oldNamespace[name]) {
    oldNamespace[name] = {};
  }
  const newFilterState = isFunction(newFilterStateReducer)
    ? newFilterStateReducer(oldNamespace[name])
    : newFilterStateReducer;

  if (oldNamespace[name] === newFilterState) {
    return state;
  }

  return {
    ...state,
    [namespace]: {
      ...oldNamespace,
      [name]: {
        ...oldNamespace[name],
        ...newFilterState
      }
    }
  };
};

const _stopEditing = (state, action) => {
  const { namespace, name } = action.payload;
  return setFilterState(state, namespace, name, {
    editingExistingValue: false,
    activeValueIndex: null
  });
};

const _closeActiveFilter = (state, action) => {
  const newState = _stopEditing(state, action);

  newState[action.payload.namespace].activeFilter = '';
  return newState;
};

const _editNewFilter = (state, action) => {
  const { namespace, name } = action.payload;

  const newState = setFilterState(state, namespace, name, (filterState) => ({
    activeValueIndex: Array.isArray(filterState.values) && filterState.values.length > 0 ? filterState.length - 1 : 0,
    editingExistingValue: false,
  }));
  newState[namespace].activeFilter = name;
  return newState;
};

const _editExistingFilter = (state, action) => {
  const { namespace, name, index } = action.payload;
  const newState = setFilterState(state, namespace, name, {
    activeValueIndex: index,
    editingExistingValue: true
  });

  newState[namespace].activeFilter = name;
  return newState;
};

const _addFilterValue = (state, action) => {
  const { namespace, name, value } = action.payload;

  return setFilterState(state, namespace, name, (filterState) => {
    const values = filterState.values || [];
    if (value.length === 0 || values.some((v) => isEqual(v, value))) {
      return filterState;
    }

    return {
      values: values.concat([value]),
      activeValueIndex: values.length - 1
    };
  });
};

const _setFilterValue = (state, action) => {
  const { namespace, name, value, index } = action.payload;
  return setFilterState(state, namespace, name, (filterState) => {
    if (typeof index === 'undefined') {
      return { values: [value] };
    }

    const values = filterState.values || [];
    return {
      values: values.slice(0, index).concat(value).concat(values.slice(index)),
      activeValueIndex: index
    };
  });
};

const _removeFilterValue = (state, action) => {
  const { namespace, name, value } = action.payload;

  return setFilterState(state, namespace, name, filterState => {
    const values = filterState.values || [];
    const idx = values.indexOf(value);

    // eslint-disable-next-line no-bitwise
    if (!~idx) {
      return filterState;
    }

    const newValues = values.slice(0, idx).concat(values.slice(idx + 1));

    return { values: newValues };
  });
};

const _setHydratedFilterValues = (state, action) => {
  const { namespace, filters } = action.payload;
  const oldNamespace = state[namespace] || {};

  return {
    ...state,
    [namespace]: {
      ...oldNamespace,
      ...Object.keys(filters).reduce((acc, name) => {
        const value = filters[name];
        acc[name] = {
          ...oldNamespace[name],
          values: Array.isArray(value) ? value : [value]
        };
        return acc;
      }, {})
    }
  };
};

const _hydrateFilters = (state, action) => ({
  ...state,
  isHydrated: {
    ...state.isHydrated,
    [action.payload.namespace]: false
  }
});

const _filtersHydrated = (state, action) => ({
  ...state,
  isHydrated: {
    ...state.isHydrated,
    [action.payload.namespace]: true
  }
});

export const reducer = handleActions({
  [STOP_EDITING_FILTER]: _stopEditing,
  [CLOSE_ACTIVE_FILTER]: _closeActiveFilter,
  [EDIT_NEW_FILTER]: _editNewFilter,
  [EDIT_EXISTING_FILTER]: _editExistingFilter,

  [ADD_FILTER_VALUE]: _addFilterValue,
  [SET_FILTER_VALUE]: _setFilterValue,
  [REMOVE_FILTER_VALUE]: _removeFilterValue,
  [SET_HYDRATED_FILTER_VALUES]: _setHydratedFilterValues,
  [HYDRATE_FILTERS]: _hydrateFilters,
  [FILTERS_HYDRATED]: _filtersHydrated
}, initialState);

/* Selectors */
const getFilters = (state, namespace) => {
  const filters = !!state[namespace] ? state[namespace] : null;

  if (!filters) {
    return [];
  }

  return Object.keys(filters).map(filterName => ({
    name: filterName,
    ...filters[filterName],
  }));
};

const getFilterValue = (state, namespace, name, index = 0) =>
  state[namespace] &&
  state[namespace][name] &&
  state[namespace][name].values &&
  state[namespace][name].values[index];

const getLastFilterValue = (state, namespace, name) => {
  if (
    state[namespace] &&
    state[namespace][name] &&
    state[namespace][name].values &&
    state[namespace][name].values.length > 0
  ) {
    const values = state[namespace][name].values;
    return values[values.length - 1];
  }

  return undefined;
};

const getActiveValueIndex = (state, namespace, name ) =>
  state[namespace] &&
  state[namespace][name] &&
  state[namespace][name].activeValueIndex;

const getActiveValue = (state, namespace, name) =>
  getFilterValue(state, namespace, name, getActiveValueIndex(state, namespace, name)) ||
  getLastFilterValue(state, namespace, name);

const getIsEditingExistingFilter = (state, namespace, name) =>
  !!state[namespace] &&
  !!state[namespace][name] &&
  !!state[namespace][name].editingExistingValue;

const getIsHydrated = (state, namespace) => !!state.isHydrated && !!state.isHydrated[namespace];

const getActiveFilter = (state, namespace) => (
  (state[namespace] && state[namespace] && state[namespace].activeFilter)
    ? state[namespace].activeFilter
    : ''
);

export const selectors = {
  getFilters,
  getFilterValue,
  getLastFilterValue,
  getActiveValueIndex,
  getActiveValue,
  getIsEditingExistingFilter,
  getIsHydrated,
  getActiveFilter
};
