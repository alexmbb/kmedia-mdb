import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Card, List } from 'semantic-ui-react';

import * as shapes from '../../shapes';

class SimpleModeList extends PureComponent {
  static propTypes = {
    items: shapes.SimpleMode,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    renderUnit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: {},
  };

  render() {
    const { items, language, t, renderUnit } = this.props;

    return (
      <div>
        {
          items.lessons.length ?
            <List size="large">
              {items.lessons.map(x => renderUnit(x, language, t))}
            </List> :
            null
        }

        {
          items.others.length ?
            <Card fluid>
              <Card.Content>
                <List size="large">
                  {renderUnit(items.others, language, t)}
                </List>
              </Card.Content>
            </Card> :
            null
        }
      </div>
    );
  }
}

export default withNamespaces()(SimpleModeList);
