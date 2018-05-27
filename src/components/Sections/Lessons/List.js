import React, { Component } from 'react';
import { List, Table } from 'semantic-ui-react';

import { CT_DAILY_LESSON, CT_LESSON_PART, NO_NAME } from '../../../helpers/consts';
import { CollectionsBreakdown } from '../../../helpers/mdb';
import { canonicalLink } from '../../../helpers/links';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as lists } from '../../../redux/modules/lists';
import { mapState as baseMapState, UnitListContainer, wrap } from '../../Pages/UnitList/Container';
import Link from '../../Language/MultiLanguageLink';
import SectionHeader from '../../shared/SectionHeader';

const CT_DAILY_LESSON_I18N_KEY = `constants.content-types.${CT_DAILY_LESSON}`;

export const renderUnit = (unit, t) => {
  const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));

  const relatedItems = breakdown.getDailyLessons().map(x =>
    (
      <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
        {t(CT_DAILY_LESSON_I18N_KEY)} {t('values.date', { date: x.film_date })}
      </List.Item>
    )
  ).concat(breakdown.getAllButDailyLessons().map(x => (
    <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
      {x.name || NO_NAME}
    </List.Item>
  )));

  return (
    <Table.Row verticalAlign="top" key={unit.id} className="no-thumbnail">
      <Table.Cell collapsing singleLine>
        <span className="index__date">{t('values.date', { date: unit.film_date })}</span>
      </Table.Cell>
      <Table.Cell>
        <Link className="index__title" to={canonicalLink(unit)}>
          {unit.name || NO_NAME}
        </Link>
        {
          relatedItems.length === 0 ?
            null :
            (
              <List horizontal divided link className="index__collections" size="tiny">
                <List.Item>
                  <List.Header>
                    {t('lessons.list.related')}:
                  </List.Header>
                </List.Item>
                {relatedItems}
              </List>
            )
        }
      </Table.Cell>
    </Table.Row>
  );
};

export const renderCollection = (collection, t) => {
  let units = [];
  if (collection.content_units) {
    units = collection.content_units.map((unit) => {
      const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));

      const relatedItems = breakdown.getDailyLessons()
        .filter(x => x.id !== collection.id)
        .map(x =>
          (
            <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
              {t(CT_DAILY_LESSON_I18N_KEY)} {t('values.date', { date: x.film_date })}
            </List.Item>
          )
        ).concat(breakdown.getAllButDailyLessons().map(x => (
          <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
            {x.name || NO_NAME}
          </List.Item>
        )));

      return (
        <Table.Row key={`u-${unit.id}`} verticalAlign="top" className="no-thumbnail">
          <Table.Cell>
            <Link className="index__item" to={canonicalLink(unit)}>
              {unit.name || NO_NAME}
            </Link>
            {
              relatedItems.length === 0 ?
                null :
                (
                  <List horizontal divided link className="index__collections" size="tiny">
                    <List.Item>
                      <List.Header>
                        {t('lessons.list.related')}:
                      </List.Header>
                    </List.Item>
                    {relatedItems}
                  </List>
                )
            }
          </Table.Cell>
        </Table.Row>
      );
    });
  }

  const rows   = [];
  const cuSpan = collection.content_units ? collection.content_units.length + 1 : 1;

  rows.push((
    <Table.Row key={`l-${collection.id}`} verticalAlign="top" className="no-thumbnail">
      <Table.Cell collapsing singleLine rowSpan={cuSpan}>
        <span className="index__date">{t('values.date', { date: collection.film_date })}</span>
      </Table.Cell>
      <Table.Cell>
        <Link className="index__title" to={canonicalLink(collection)}>
          {`${t(CT_DAILY_LESSON_I18N_KEY)}${collection.number ? ` #${collection.number}` : ''}`}
        </Link>
      </Table.Cell>
    </Table.Row>
  ));

  return rows.concat(units);
};

export const renderUnitOrCollection = (item, t) => (
  item.content_type === CT_LESSON_PART ?
    renderUnit(item, t) :
    renderCollection(item, t)
);

const mapState = (state, ownProps) => {
  const nsState = lists.getNamespaceState(state.lists, ownProps.namespace);

  return {
    ...baseMapState(state, ownProps),
    items: (nsState.items || []).map(x => (
      x[1] === CT_LESSON_PART ?
        mdb.getDenormContentUnit(state.mdb, x[0]) :
        mdb.getDenormCollectionWUnits(state.mdb, x[0]))
    ),
  };
};

const MyUnitList = wrap(UnitListContainer, mapState);

class LessonsList extends Component {
  render() {
    return (
      <div>
        <SectionHeader section="lessons" />
        <MyUnitList
          namespace="lessons"
          renderUnit={renderUnitOrCollection}
        />
      </div>
    );
  }
}

export default LessonsList;
