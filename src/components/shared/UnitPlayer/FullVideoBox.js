import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';

import withIsMobile from '../../../helpers/withIsMobile';
import { MT_AUDIO, MT_VIDEO } from '../../../helpers/consts';
import { getQuery, updateQuery } from '../../../helpers/url';
import playerHelper from '../../../helpers/player';
import * as shapes from '../../shapes';
import AVPlaylistPlayerRMP from '../../AVPlayerRMP/AVPlaylistPlayerRMP';

class FullVideoBox extends Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    location: shapes.HistoryLocation.isRequired,
    PlayListComponent: PropTypes.any,
    language: PropTypes.string.isRequired,
    collection: shapes.GenericCollection.isRequired,
    activePart: PropTypes.number,
    onActivePartChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    activePart: 0,
    PlayListComponent: null
  };

  componentWillMount() {
    const { isMobile, collection, language, history, location, onActivePartChange } = this.props;
    const mediaType = playerHelper.getMediaTypeFromQuery(history.location, isMobile ? MT_AUDIO : MT_VIDEO);
    this.setPlaylist(collection, mediaType, language, () => {
      const activePart = getQuery(location).ap;
      if (activePart != null) {
        onActivePartChange(parseInt(activePart, 10));
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { isMobile, collection, language, location, onActivePartChange } = nextProps;
    const {
      collection: oldCollection,
      language: oldLanguage,
      location: oldLocation
    } = this.props;

    const prevMediaType = playerHelper.getMediaTypeFromQuery(oldLocation, isMobile ? MT_AUDIO : MT_VIDEO);
    const newMediaType = playerHelper.getMediaTypeFromQuery(location, isMobile ? MT_AUDIO : MT_VIDEO);

    if (oldCollection !== collection || oldLanguage !== language || prevMediaType !== newMediaType) {
      // Persist language in playableItem
      this.setPlaylist(collection, newMediaType, this.state.playlist.language);
    }

    const oldLocationActivePart = getQuery(oldLocation).ap;
    const locationActivePart = getQuery(location).ap;
    if (oldLocationActivePart !== locationActivePart) {
      const activePart = parseInt(locationActivePart, 10);
      onActivePartChange(isNaN(activePart) ? 0 : activePart);
    }
  }

  setPlaylist = (collection, mediaType, language, cb) => {
    const playlist = playerHelper.playlist(collection, mediaType, language);
    this.setState({ playlist }, () => cb && cb(playlist));
  };

  setActivePartInQuery = (activePart) => {
    updateQuery(this.props.history, query => ({ ...query, ap: activePart }));
  };

  handleChangeLanguage = (e, language) => {
    const { playlist } = this.state;
    const { activePart, collection } = this.props;

    const playableItem = playlist.items[activePart];

    if (language !== playableItem.language) {
      this.setPlaylist(collection, playableItem.mediaType, language);
    }
  }

  handleSwitchAV = () => {
    const { activePart, history } = this.props;
    const { playlist } = this.state;
    const activeItem = playlist.items[activePart];
    if (activeItem.mediaType === MT_AUDIO && activeItem.availableMediaTypes.includes(MT_VIDEO)) {
      playerHelper.setMediaTypeInQuery(history, MT_VIDEO);
    } else if (activeItem.mediaType === MT_VIDEO && activeItem.availableMediaTypes.includes(MT_AUDIO)) {
      playerHelper.setMediaTypeInQuery(history, MT_AUDIO);
    }
  };

  handlePartClick = (e, data) =>
    this.setActivePartInQuery(parseInt(data.name, 10));

  render() {
    const { t, activePart, collection, PlayListComponent } = this.props;
    const { playlist } = this.state;

    return (
      <Grid.Row>
        <Grid.Column computer={10} mobile={16}>
          <AVPlaylistPlayerRMP
            playlist={playlist}
            activePart={activePart}
            onActivePartChange={this.setActivePartInQuery}
            onLanguageChange={this.handleChangeLanguage}
            onSwitchAV={this.handleSwitchAV}
            t={t}
          />
        </Grid.Column>
        <Grid.Column className="avbox__playlist" computer={6} mobile={16}>
          
            <PlayListComponent
              collection={collection}
              activePart={activePart}
              t={t}
              onItemClick={this.handlePartClick}
            />
          
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default withIsMobile(withRouter(FullVideoBox));