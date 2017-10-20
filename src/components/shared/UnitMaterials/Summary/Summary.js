import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import * as shapes from '../../../shapes';

class Summary extends Component {

  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    t: PropTypes.func.isRequired,
  };

  render() {
    const { unit, t } = this.props;

    if (!unit.description) {
      return <Segment basic>{t('materials.summary.no-summary')}</Segment>;
    }

    return (
      <Segment basic>
        <div dangerouslySetInnerHTML={{ __html: unit.description }} />
      </Segment>
    );
  }
}

export default Summary;
