import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import { reducer as system } from './modules/system';
import { reducer as settings } from './modules/settings';
import { reducer as lessons } from './modules/lessons';
import { reducer as filters } from './modules/filters';
import { reducer as sources } from './modules/sources';
import { reducer as mdb } from './modules/mdb';

export default combineReducers({
  router,
  system,
  settings,
  lessons,
  filters,
  sources,
  mdb,
});

