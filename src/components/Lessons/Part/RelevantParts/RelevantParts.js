import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Container, Header, Item } from 'semantic-ui-react';

import { formatError } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../../shared/Splash';
import myimage from './image.png';

const RelevantParts = (props) => {
  const { lesson, fullLesson, wip, err, t } = props;

  if (err) {
    return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
  }

  if (wip) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  }

  if (fullLesson && Array.isArray(fullLesson.content_units)) {
    const otherParts = fullLesson.content_units.filter(part => part.id !== lesson.id);

    return (
      otherParts.length ? (
        <div style={{ marginTop: '50px' }}>
          <Header as="h3" content={t('lessons.part.relevant-parts.title')} />
          <Item.Group divided link>
            {
              otherParts.slice(0, 3).map(part => (
                <Item as={Link} key={part.id} to={`/lessons/part/${part.id}`}>
                  <Item.Image src={myimage} size="tiny" />
                  <Item.Content >
                    <Header
                      as="h4"
                      content={t('lessons.part.relevant-parts.item-title', { name: fullLesson.ccuNames[part.id] })}
                    />
                    <Item.Meta>
                      <small>{moment.duration(part.duration, 'seconds').format('hh:mm:ss')}</small>
                    </Item.Meta>
                    <Item.Description>{part.name}</Item.Description>
                  </Item.Content>
                </Item>
              ))
            }
            <Item>
              <Item.Content>
                <Container
                  fluid
                  as={Link}
                  textAlign="right"
                  to={`/lessons/full/${fullLesson.id}`}
                >
                  {t('buttons.more')} &raquo;
                </Container>
              </Item.Content>
            </Item>
          </Item.Group>
        </div>
      ) : <div />
    );
  }

  return (
    <FrownSplash
      text={t('messages.lesson-not-found')}
      subtext={
        <Trans i18nKey="messages.lesson-not-found-subtext">
          Try the <Link to="/lessons">lessons list</Link>...
        </Trans>
      }
    />
  );
};

RelevantParts.propTypes = {
  lesson: shapes.LessonPart.isRequired,
  fullLesson: shapes.LessonCollection,
  wip: shapes.WIP,
  err: shapes.Error,
  t: PropTypes.func.isRequired,
};

RelevantParts.defaultProps = {
  fullLesson: null,
  wip: false,
  err: null,
};

export default RelevantParts;