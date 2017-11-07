import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import * as shapes from '../../shapes';
import TabsMenu from '../../shared/TabsMenu';
import Summary from './Summary/Summary';
import SourcesContainer from './Sources/SourcesContainer';
import Sketches from './Sketches';

class Materials extends Component {

  static propTypes = {
    unit: shapes.ContentUnit,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: undefined,
  };

  render() {
    const { unit, t } = this.props;

    if (!unit) {
      return null;
    }

    const items = [
      {
        name: 'summary',
        label: t('materials.summary.header'),
        component: <Summary unit={this.props.unit} t={t} />,
      },
      {
        name: 'transcription',
        label: t('materials.transcription.header'),
        component: <Segment basic>{t('materials.transcription.header')}</Segment>,
      },
      {
        name: 'sources',
        label: t('materials.sources.header'),
        component: <SourcesContainer unit={this.props.unit} t={t} />
      },
      {
        name: 'sketches',
<<<<<<< Updated upstream
        label: t('materials.sketches.header'),
        component: <Segment basic>{t('materials.sketches.header')}</Segment>,
        // component: <div style="outerWidth=200px; outerHeight=200px" visible="true"><Sketches></Sketches></div>,
=======
        label: t(`${tPrefix}.sketches`),
        //component: <Segment basic>{t(`${tPrefix}.sketches`)}</Segment>,
        component: <Sketches />,
>>>>>>> Stashed changes
      },
    ];

    return (
      <TabsMenu items={items} />
    );
  }
}

export default Materials;
