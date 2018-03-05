import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Image, List, Table } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import NavLink from '../../Language/MultiLanguageNavLink';

class Kabbalist extends Component {
  static propTypes = {
    getSourceById: PropTypes.func.isRequired,
    author: shapes.Author.isRequired,
    portrait: PropTypes.string,
  };

  static defaultProps = {
    portrait: '',
  };

  renderBook = (book) => {
    const { id, name, description } = book;
    return (
      <List.Item key={id}>
        <NavLink to={`/sources/${id}`}>
          {name} {description ? ` - ${description}` : ''}
        </NavLink>
      </List.Item>
    );
  };

  render() {
    const { author, getSourceById, portrait }              = this.props;
    const { name, full_name: fullName, children: volumes } = author;

    let displayName = fullName || name;
    if (fullName && name) {
      displayName += ` (${name})`;
    }

    return (
      <Table.Row verticalAlign="top">
        <Table.Cell collapsing width={2}>
          {portrait ? <Image src={portrait} /> : null}
        </Table.Cell>
        <Table.Cell>
          <Header size="small">{displayName}</Header>
          <List bulleted className="sources__list">
            {
              volumes ?
                volumes.map(x => (this.renderBook(getSourceById(x)))) :
                null
            }
          </List>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default Kabbalist;
