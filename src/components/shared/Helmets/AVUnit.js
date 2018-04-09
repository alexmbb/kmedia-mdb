import React, { Component } from 'react';

import { isEmpty } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import Basic from './Basic';
import Image from './Image';

class AVUnit extends Component {
  static propTypes = {
    unit: shapes.ContentUnit,
  };

  static defaultProps = {
    unit: undefined,
  };

  render() {
    const { unit } = this.props;

    if (!unit) {
      return null;
    }

    // if unit.description doesn't exist, use the collection description
    let { description } = unit;
    if (isEmpty(description)) {
      const collections = Object.values(unit.collections);
      if (collections.length > 0) {
        description = collections[0].description;
      }
    }

    return (
      <div>
        <Basic title={unit.name} description={description} />
        <Image unitOrUrl={unit} />

        {/* // /!*TODO: add Helmets.Basic:url ? *!/ */}
        {/* // /!*TODO: add tags from unit (tags=unit.tags) ? *!/ */}
        {/* // /!*TODO: add profile helmet *!/ */}
        {/* // /!*TODO: add* Helmets.Article:section *!/ */}
        {/* // <Article publishedTime={unit.film_date} /> */}

      </div>
    );
  }
}

export default AVUnit;
