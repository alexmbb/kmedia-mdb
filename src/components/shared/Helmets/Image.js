import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet-async';

import { assetUrl, imaginaryUrl, Requests } from '../../../helpers/Api';
import { isEmpty } from '../../../helpers/utils';
import * as shapes from '../../shapes';

class Image extends Component {
  static propTypes = {
    unitOrUrl: PropTypes.oneOfType([
      shapes.ContentUnit,
      PropTypes.string,
    ])
  };

  static defaultProps = {
    unitOrUrl: null,
  };

  // eslint-disable-next-line class-methods-use-this
  buildImage(url, width, height) {
    // TODO: enlarge is the most expensive op, use another one!
    const imageUrl = `${imaginaryUrl('enlarge')}?${Requests.makeParams({ url, width, height, nocrop: true })}`;

    // TODO: BUG !!!, when a new image overrides the old one,
    // it breaks the helmet structure (separate the image properties
    // to different places at the HTML head (is all should be close to each other)
    return <meta property="og:image" content={imageUrl} />;
    // return [
    /* <meta property="og:image" content={imageUrl} key="1" />, */
    /* <meta property="og:image:width" content={width} key="2" />, */
    /* <meta property="og:image:height" content={height} key="3" /> */
    // ];
  }

  render() {
    const { unitOrUrl } = this.props;

    if (isEmpty(unitOrUrl)) {
      return null;
    }

    let imageUrl = unitOrUrl;
    // if unitOrUrl is a unit
    if (typeof (unitOrUrl) !== typeof ('')) {
      imageUrl = assetUrl(`api/thumbnail/${unitOrUrl.id}`);
    }

    return (
      <Helmet>
        {/* Facebook */}
        {this.buildImage(imageUrl, 1200, 630)}
        {/* Whatsapp */}
        {this.buildImage(imageUrl, 300, 300)}
        {/* Twitter */}
        {this.buildImage(imageUrl, 280, 150)}
      </Helmet>
    );
  }
}

export default Image;
