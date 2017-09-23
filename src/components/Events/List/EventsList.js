import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Grid, Table } from 'semantic-ui-react';
import moment from 'moment';
import Link from '../../Language/MultiLanguageLink';
import * as shapes from '../../shapes';
import { canonicalLink } from '../../../helpers/utils';
import { fromToLocalized } from '../../../helpers/date';

class EventsList extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([shapes.EventCollection, shapes.EventItem])),
  };

  static defaultProps = {
    items: []
  };

  renderCollection = (collection) => {
    const localDate = fromToLocalized(
      moment.utc(collection.start_date, 'YYYY-MM-DD'),
      moment.utc(collection.end_date, 'YYYY-MM-DD')
    );

    return (
      <Table.Row verticalAlign="top" key={collection.id}>
        <Table.Cell collapsing singleLine width={1}>
          <strong>{localDate}</strong>
        </Table.Cell>
        <Table.Cell>
          <Link to={canonicalLink(collection)}>
            <strong>{collection.name || '⛔ NO NAME'}</strong>
          </Link>
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { items } = this.props;

    if (!Array.isArray(items) || items.length === 0) {
      return (<Grid columns={2} celled="internally" />);
    }

    return (

      <Table basic="very" sortable>
        <Table.Body>
          {
            items.map(this.renderCollection)
          }
        </Table.Body>
      </Table>
    );
  }
}

export default EventsList;
