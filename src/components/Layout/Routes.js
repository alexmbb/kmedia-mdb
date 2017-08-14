import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Lessons from '../Lessons/List/LessonsContainer';
import LessonPart from '../Lessons/Part/LessonPartContainer';
import FullLesson from '../Lessons/Full/FullLessonContainer';
import Design from '../Design/Design';

const NotImplemented = () => <h1>Not Implemented Yet</h1>;
const NotFound       = () => <h1>Page not found</h1>;

const Routes = ({ match }) => {
  const { url } = match;

  // remove slash (/) from the end
  const urlPrefix = /\/$/.test(url) ? url.slice(0, -1) : match.url;

  return (
    <Switch>
      <Route exact path={`${urlPrefix}/`} component={Lessons} />
      <Route exact path={`${urlPrefix}/lessons`} component={Lessons} />
      <Route exact path={`${urlPrefix}/lessons/part/:id`} component={LessonPart} />
      <Route exact path={`${urlPrefix}/lessons/full/:id`} component={FullLesson} />
      <Route exact path={`${urlPrefix}/tv_shows`} component={NotImplemented} />
      <Route exact path={`${urlPrefix}/lectures`} component={NotImplemented} />
      <Route exact path={`${urlPrefix}/sources`} component={NotImplemented} />
      <Route exact path={`${urlPrefix}/events`} component={NotImplemented} />
      <Route exact path={`${urlPrefix}/books`} component={NotImplemented} />
      <Route exact path={`${urlPrefix}/topics`} component={NotImplemented} />
      <Route exact path={`${urlPrefix}/publications`} component={NotImplemented} />
      <Route exact path={`${urlPrefix}/photos`} component={NotImplemented} />
      <Route exact path={`${urlPrefix}/design`} component={Design} />
      <Route exact path={`${urlPrefix}/design2`} component={Lessons} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
