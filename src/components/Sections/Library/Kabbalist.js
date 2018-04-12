import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Header, Image, List, Table } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import NavLink from '../../Language/MultiLanguageNavLink';

class Kabbalist extends Component {
  static propTypes = {
    getSourceById: PropTypes.func.isRequired,
    author: shapes.Author.isRequired,
    language: PropTypes.string.isRequired,
    portrait: PropTypes.string,
  };

  static defaultProps = {
    portrait: '',
  };

  static mapLinks = {
    ar: 'ari',
    bs: 'baal-hasulam',
    ml: 'michael-laitman',
    rb: 'rabash',
    rh: 'rashbi',
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
    const { author, getSourceById, portrait, language }        = this.props;
    const { id, name, full_name: fullName, children: volumes } = author;

    let displayName = fullName || name;
    if (fullName && name) {
      displayName += ` (${name})`;
    }

    const kabbalist = Kabbalist.mapLinks[id];

    return (
      <Table.Row verticalAlign="top">
        <Table.Cell collapsing width={2}>
          {portrait ? <Image src={portrait} /> : null}
        </Table.Cell>
        <Table.Cell>
          <div className={classnames({ sources__list: true, 'sources__list--image': !!portrait })}>
            <Header size="small">
              {
                kabbalist ? <a href={`/persons/${kabbalist}-${language}.html`} alt={fullName}>{displayName}</a> : displayName
              }
            </Header>
            <div>
              <List bulleted>
                {
                  volumes ?
                    volumes.map(x => (this.renderBook(getSourceById(x)))) :
                    null
                }
              </List>
            </div>
          </div>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default Kabbalist;
