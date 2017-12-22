import { createFilterDefinition } from './util';
import {
  COLLECTION_LESSONS_TYPE,
  COLLECTION_PROGRAMS_TYPE,
  COLLECTION_EVENTS_TYPE,
  UNIT_LESSONS_TYPE,
  UNIT_PROGRAMS_TYPE,
  UNIT_EVENTS_TYPE,
} from '../../helpers/consts.js';

export const sectionsFilter = createFilterDefinition({
  name: 'sections-filter',
  queryKey: 'section',
  valueToApiParam: value => options[value],
  tagIcon: 'wpforms',
  valueToTagLabel: (value, props, store, t) => {
    if (!value) {
      return '';
    }
    return t(value);
  }
});

export const options = {
  'filters.sections-filter.lessons': {
    units_content_types: UNIT_LESSONS_TYPE,
    collections_content_types: COLLECTION_LESSONS_TYPE,
  },
  'filters.sections-filter.programs': {
    units_content_types: UNIT_PROGRAMS_TYPE,
    collections_content_types: COLLECTION_PROGRAMS_TYPE,
  },
  'filters.sections-filter.events': {
    units_content_types: UNIT_EVENTS_TYPE,
    collections_content_types: COLLECTION_EVENTS_TYPE,
  },
}
