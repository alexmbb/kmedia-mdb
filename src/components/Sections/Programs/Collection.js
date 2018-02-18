import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import { NO_NAME } from '../../../helpers/consts';
import { canonicalLink } from '../../../helpers/utils';
import Link from '../../Language/MultiLanguageLink';
import UnitLogo from '../../shared/Logo/UnitLogo';
import Collection from '../../Pages/Collection/Container';

export const renderUnit = (unit, t) => {
  let filmDate = '';
  if (unit.film_date) {
    filmDate = t('values.date', { date: new Date(unit.film_date) });
  }

  const link = canonicalLink(unit);

  return (
    <Table.Row key={unit.id} verticalAlign="top">
      <Table.Cell collapsing singleLine width={1}>
        <strong>{filmDate}</strong>
      </Table.Cell>
      <Table.Cell collapsing width={1}>
        <Link to={link}>
          <UnitLogo fluid unitId={unit.id} />
        </Link>
      </Table.Cell>
      <Table.Cell>
        <Link to={link}>
          <strong>{unit.name || NO_NAME}</strong>
        </Link>
      </Table.Cell>
    </Table.Row>
  );
};

class ProgramCollection extends Component {

  render() {
    return <Collection namespace="programs-collection" renderUnit={renderUnit} />;
  }
}

export default ProgramCollection;
