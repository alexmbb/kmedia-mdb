import React, { Component } from 'react';
import { List, Table } from 'semantic-ui-react';

import { CT_ARTICLE } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/utils';
import { CollectionsBreakdown } from '../../../helpers/mdb';
import UnitList from '../../pages/UnitList/Container';
import Link from '../../Language/MultiLanguageLink';

const renderUnit = (unit, t) => {
  const breakdown = new CollectionsBreakdown(Object.values(unit.collections || {}));
  const articles  = breakdown.getArticles();

  const relatedItems = articles.map(x =>
    (
      <List.Item key={x.id} as={Link} to={canonicalLink(x)}>
        {x.name || '☠ no name'}
      </List.Item>
    )
  );

  let filmDate = '';
  if (unit.film_date) {
    filmDate = t('values.date', { date: new Date(unit.film_date) });
  }

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine width={1}>
        <strong>{filmDate}</strong>
      </Table.Cell>
      <Table.Cell>
        <Link to={canonicalLink(unit)}>
          <strong>{unit.name || '☠ no name'}</strong>
        </Link>
        <List horizontal divided link className="index-list__item-subtitle" size="tiny">
          <List.Item>
            <List.Header>{t('publications.list.item_from')}</List.Header>
          </List.Item>
          {relatedItems}
        </List>
      </Table.Cell>
    </Table.Row>
  );
};

class PublicationsContainer extends Component {

  extraFetchParams = () => ({ content_type: [CT_ARTICLE] });

  render() {
    return (
      <UnitList
        namespace="publications"
        extraFetchParams={this.extraFetchParams}
        renderUnit={renderUnit}
      />
    );
  }
}

export default PublicationsContainer;
