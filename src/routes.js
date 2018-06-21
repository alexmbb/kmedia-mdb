/* eslint-disable react/no-multi-comp */

import React from 'react';
import { renderRoutes } from 'react-router-config';

import { DEFAULT_LANGUAGE } from './helpers/consts';
import LanguageSetter from './components/Language/LanguageSetter';
import Layout from './components/Layout/Layout';
import Lessons from './components/Sections/Lessons/MainPage';
import LessonUnit from './components/Sections/Lessons/Unit/Container';
import LessonCollection from './components/Sections/Lessons/Collection/MainPage';
import LastLessonCollection from './components/Sections/Lessons/Collection/LastDaily';
import Programs from './components/Sections/Programs/List';
import ProgramUnit from './components/Sections/Programs/Unit';
import ProgramCollection from './components/Sections/Programs/Collection';
import Publications from './components/Sections/Publications/List';
import PublicationUnit from './components/Sections/Publications/Unit';
import PublicationCollection from './components/Sections/Publications/Collection';
import Events from './components/Sections/Events/MainPage';
import EventUnit from './components/Sections/Events/Unit';
import EventCollection from './components/Sections/Events/Collection';
import LibraryHomepage from './components/Sections/Library/Homepage';
import LibraryContainer from './components/Sections/Library/LibraryContainer';
import LibraryPerson from './components/Sections/Library/LibraryPerson';
import SearchResults from './components/Search/SearchResultsContainer';
import HomePage from './components/Sections/Home/Container';
import ProjectStatus from './components/Sections/ProjectStatus/ProjectStatus';
// import Design from './components/Design/Design';
import * as ssrDataLoaders from './routesSSRData';

const NotImplemented = () => <h1>Not Implemented Yet</h1>;
const NotFound       = () => <h1>Page not found</h1>;
const Root           = ({ route }) => renderRoutes(route.routes);

/**
 * Creates a page route config
 *
 * @param {string} path
 * @param {React.Component|function} component
 * @param {object} subRoutes{array} prefix=''{string}
 */
const pageRoute = (path, component, { subRoutes, ssrData, prefix = '' } = {}) => ({
  exact: true,
  path: `${prefix}/${path}`,
  component,
  routes: subRoutes,
  ssrData,
});

const routes = [
  { path: '', component: HomePage, options: { ssrData: ssrDataLoaders.home } },
  { path: 'lessons', component: Lessons, options: { ssrData: ssrDataLoaders.lessonsPage } },
  { path: 'lessons/:tab', component: Lessons, options: { ssrData: ssrDataLoaders.lessonsPage } },
  { path: 'lessons/:tab/c/:id', component: LessonCollection, options: { ssrData: ssrDataLoaders.lessonsCollectionPage } },
  { path: 'lessons/cu/:id', component: LessonUnit, options: { ssrData: ssrDataLoaders.cuPage } },
  { path: 'lessons/daily/latest', component: LastLessonCollection, options: { ssrData: ssrDataLoaders.latestLesson } },
  { path: 'programs', component: Programs, options: { ssrData: ssrDataLoaders.cuListPage('programs') } },
  { path: 'programs/cu/:id', component: ProgramUnit, options: { ssrData: ssrDataLoaders.cuPage } },
  {
    path: 'programs/c/:id',
    component: ProgramCollection,
    options: { ssrData: ssrDataLoaders.collectionPage('programs-collection') }
  },
  { path: 'events', component: Events, options: { ssrData: ssrDataLoaders.eventsPage } },
  { path: 'events/:tab', component: Events, options: { ssrData: ssrDataLoaders.eventsPage } },
  { path: 'events/cu/:id', component: EventUnit, options: { ssrData: ssrDataLoaders.cuPage } },
  { path: 'events/c/:id', component: EventCollection, options: { ssrData: ssrDataLoaders.playlistCollectionPage } },
  { path: 'publications', component: Publications, options: { ssrData: ssrDataLoaders.cuListPage('publications') } },
  { path: 'publications/cu/:id', component: PublicationUnit, options: { ssrData: ssrDataLoaders.publicationCUPage } },
  {
    path: 'publications/c/:id',
    component: PublicationCollection,
    options: { ssrData: ssrDataLoaders.collectionPage('publications-collection') }
  },
  { path: 'sources', component: LibraryHomepage },
  { path: 'sources/:id', component: LibraryContainer, options: { ssrData: ssrDataLoaders.libraryPage } },
  { path: 'persons/:id', component: LibraryPerson, options: { ssrData: ssrDataLoaders.libraryPage } },
  { path: 'books', component: NotImplemented },
  { path: 'topics', component: NotImplemented },
  { path: 'photos', component: NotImplemented },
  { path: 'search', component: SearchResults, options: { ssrData: ssrDataLoaders.searchPage } },
  { path: 'project-status', component: ProjectStatus },
  // { path: 'design', component: Design },
  // { path: 'design2', component: Design2 },
];

const createMainRoutes = (prefix) => {
  const defaultPageOptions = { prefix };

  // for convenience
  const defaultPageRoute = (path, component, options = {}) =>
    pageRoute(path, component, { ...defaultPageOptions, ...options });

  return [{
    component: Layout,
    routes: [
      ...routes.map(route => defaultPageRoute(route.path, route.component, route.options)),

      {
        path: '*',
        component: NotFound
      }
    ]
  }];
};

/**
 * A component that sets the language it got from the route params.
 */
const RoutedLanguageSetter = ({ match, route }) => (
  <LanguageSetter language={match.params.language || route.defaultLanguage}>
    {renderRoutes(route.routes)}
  </LanguageSetter>
);

/**
 * Creates routes that would detect the language from the path and updates.
 *
 * @param {string} languagePathPrefix prefix path to detect a language with.
 * @param {function} routesCreator creates the routes that will be actually rendered
 */
const withLanguageRoutes = (languagePathPrefix, routesCreator = prefix => undefined) => ([
  {
    path: languagePathPrefix,
    component: RoutedLanguageSetter,
    routes: routesCreator(languagePathPrefix)
  }, {
    path: '',
    defaultLanguage: DEFAULT_LANGUAGE,
    component: RoutedLanguageSetter,
    routes: routesCreator('')
  }
]);

export default [
  {
    component: Root,
    routes: withLanguageRoutes('/:language([a-z]{2})', createMainRoutes)
  }
];