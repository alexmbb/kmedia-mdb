import { all } from 'redux-saga/effects';

import { sagas as device } from './device';
import { sagas as mdb } from './mdb';
import { sagas as programs } from './programs';
import { sagas as publications } from './publications';
import { sagas as events } from './events';
import { sagas as lessons } from './lessons';
import { sagas as filters } from './filters';
import { sagas as lists } from './lists';
import { sagas as tags } from './tags';
import { sagas as settings } from './settings';
import { sagas as search } from './search';
import { sagas as assets } from './assets';
import { sagas as home } from './home';

const allSagas = [
  ...device,
  ...mdb,
  ...programs,
  ...publications,
  ...events,
  ...lessons,
  ...filters,
  ...lists,
  ...tags,
  ...settings,
  ...search,
  ...assets,
  ...home,
];

export function* rootSaga() {
  yield all(allSagas.map(s => s()));
}
