import { canonicalCollection, tracePath } from './utils';
import { filtersTransformer } from '../filters/index';
import { stringify as urlSearchStringify } from './url';

import {
  BLOG_ID_LAITMAN_CO_IL,
  BLOG_ID_LAITMAN_COM,
  BLOG_ID_LAITMAN_ES,
  BLOG_ID_LAITMAN_RU,
  COLLECTION_EVENTS_TYPE,
  COLLECTION_LESSONS_TYPE,
  COLLECTION_PROGRAMS_TYPE,
  COLLECTION_PUBLICATIONS_TYPE,
  CT_ARTICLE,
  CT_ARTICLES,
  CT_BLOG_POST,
  CT_CLIP,
  CT_CLIPS,
  CT_CONGRESS,
  CT_DAILY_LESSON,
  CT_EVENT_PART,
  CT_FRIENDS_GATHERING,
  CT_FRIENDS_GATHERINGS,
  CT_FULL_LESSON,
  CT_HOLIDAY,
  CT_KITEI_MAKOR,
  CT_LECTURE,
  CT_LECTURE_SERIES,
  CT_LELO_MIKUD,
  CT_LESSON_PART,
  CT_LESSONS_SERIES,
  CT_MEAL,
  CT_MEALS,
  CT_PICNIC,
  CT_PUBLICATION,
  CT_SPECIAL_LESSON,
  CT_TRAINING,
  CT_UNITY_DAY,
  CT_UNKNOWN,
  CT_VIDEO_PROGRAM,
  CT_VIDEO_PROGRAM_CHAPTER,
  CT_VIRTUAL_LESSON,
  CT_VIRTUAL_LESSONS,
  CT_WOMEN_LESSON,
  CT_WOMEN_LESSONS,
  EVENT_TYPES,
  SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_LINK,
  UNIT_EVENTS_TYPE,
  UNIT_LESSONS_TYPE,
  UNIT_PROGRAMS_TYPE,
  UNIT_PUBLICATIONS_TYPE,
} from './consts';

export const landingPageSectionLink = (landingPage) => {
  return SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_LINK[landingPage];
};

export const intentSectionLink = (section, filters) => {
  const filterValues = filters.map(({ name, value, getFilterById }) => {
    if (['topics-filter', 'sources-filter'].includes(name)) {
      const tagOrSource = getFilterById(value);
      if (!tagOrSource) {
        return null;
      }
      const path = tracePath(tagOrSource, getFilterById);
      return { name, values: [path.map(y => y.id)] };
    }

    return { name, values: [value] };
  });
  const query        = filtersTransformer.toQueryParams(filterValues.filter(f => !!f));
  return `/${section}?${urlSearchStringify(query)}`;
};

/* WARNING!!!
   This function MUST be synchronized with the next one: canonicalContentType
 */
export const canonicalLink = (entity, mediaLang) => {
  if (!entity) {
    return '/';
  }

  // source
  if (entity.content_type === 'SOURCE') {
    return `/sources/${entity.id}`;
  }

  if (entity.content_type === 'POST') {
    const [blogID, postID] = entity.id.split('-');
    let blogName;

    switch (parseInt(blogID, 10)) {
    case BLOG_ID_LAITMAN_RU:
      blogName = 'laitman-ru';
      break;
    case BLOG_ID_LAITMAN_COM:
      blogName = 'laitman-com';
      break;
    case BLOG_ID_LAITMAN_ES:
      blogName = 'laitman-es';
      break;
    case BLOG_ID_LAITMAN_CO_IL:
      blogName = 'laitman-co-il';
      break;
    default:
      blogName = 'laitman-co-il';
    }

    return `/publications/blog/${blogName}/${postID}`;
  }

  // collections
  switch (entity.content_type) {
  case CT_DAILY_LESSON:
  case CT_SPECIAL_LESSON:
    return `/lessons/daily/c/${entity.id}`;
  case CT_VIRTUAL_LESSONS:
    return `/lessons/virtual/c/${entity.id}`;
  case CT_LECTURE_SERIES:
    return `/lessons/lectures/c/${entity.id}`;
  case CT_WOMEN_LESSONS:
    return `/lessons/women/c/${entity.id}`;
    // case CT_CHILDREN_LESSONS:
    //   return `/lessons/children/c/${entity.id}`;
  case CT_LESSONS_SERIES:
    return `/lessons/series/c/${entity.id}`;
  case CT_VIDEO_PROGRAM:
  case CT_CLIPS:
    return `/programs/c/${entity.id}`;
  case CT_ARTICLES:
    return `/publications/articles/c/${entity.id}`;
  case CT_FRIENDS_GATHERINGS:
  case CT_MEALS:
  case CT_CONGRESS:
  case CT_HOLIDAY:
  case CT_PICNIC:
  case CT_UNITY_DAY:
    return `/events/c/${entity.id}`;
  default:
    break;
  }

  // units whose canonical collection is an event goes as an event item
  const collection = canonicalCollection(entity);
  if (collection && EVENT_TYPES.indexOf(collection.content_type) !== -1) {
    return `/events/cu/${entity.id}`;
  }

  const mediaLangSuffix = mediaLang ? `?language=${mediaLang}` : '';

  // unit based on type
  switch (entity.content_type) {
  case CT_LESSON_PART:
  case CT_LECTURE:
  case CT_VIRTUAL_LESSON:
  case CT_WOMEN_LESSON:
  case CT_BLOG_POST:
    // case CT_CHILDREN_LESSON:
    return `/lessons/cu/${entity.id}${mediaLangSuffix}`;
  case CT_VIDEO_PROGRAM_CHAPTER:
  case CT_CLIP:
    return `/programs/cu/${entity.id}${mediaLangSuffix}`;
  case CT_EVENT_PART:
  case CT_FULL_LESSON:
  case CT_FRIENDS_GATHERING:
  case CT_MEAL:
    return `/events/cu/${entity.id}${mediaLangSuffix}`;
  case CT_ARTICLE:
    return `/publications/articles/cu/${entity.id}?${mediaLangSuffix}`;
  case CT_UNKNOWN:
  case CT_TRAINING:
  case CT_KITEI_MAKOR:
  case CT_PUBLICATION:
  case CT_LELO_MIKUD:
    return '/';
  default:
    return '/';
  }
};

/* WARNING!!!
   This function MUST be synchronized with the previous one: canonicalLink
 */
export const canonicalContentType = (entity) => {
  switch (entity) {
  case 'sources':
    return ['SOURCE'];
  case 'lessons':
    return [...COLLECTION_LESSONS_TYPE, ...UNIT_LESSONS_TYPE];
  case 'programs':
    return [...COLLECTION_PROGRAMS_TYPE, ...UNIT_PROGRAMS_TYPE];
  case 'publications':
    return ['POST', CT_ARTICLES, ...COLLECTION_PUBLICATIONS_TYPE, ...UNIT_PUBLICATIONS_TYPE];
  case 'events':
    return [...COLLECTION_EVENTS_TYPE, ...UNIT_EVENTS_TYPE];
  default:
    return [];
  }
};
