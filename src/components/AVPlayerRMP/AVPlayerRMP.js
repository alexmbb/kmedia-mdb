// https://github.com/souporserious/react-media-player

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Grid } from 'semantic-ui-react';
import { controls, Media, Player } from 'react-media-player';

import * as shapes from '../shapes';
import { physicalFile } from '../../helpers/utils';
import LanguageSelector from '../shared/LanguageSelector';

import AVPlayPause from './AVPlayPause';
import AVTimeElapsed from './AVTimeElapsed';
import AVSwitch from './AVSwitch';
import AVFullScreen from './AVFullScreen';
import AVMuteUnmute from './AVMuteUnmute';

import Progress from './Progress';

const { SeekBar, Volume } = controls;

class AVPlayerRMP extends PureComponent {

  static propTypes = {
    playerId: PropTypes.string.isRequired,
    audio: shapes.MDBFile,
    video: shapes.MDBFile,
    active: shapes.MDBFile,
    handleSwitchAV: PropTypes.func.isRequired,
    // poster: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    defaultValue: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  static defaultProps = {
    audio: null,
    video: null,
    active: null,
    mediaType: null,
    poster: null,
  };

  render() {
    const { audio, video, active, playerId, handleSwitchAV, languages, defaultValue, onSelect, t } = this.props;

    return (
      <div>
        <Grid.Column className="player_panel" width={6}>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <AVSwitch video={video} audio={audio} active={active} t={t} onChange={handleSwitchAV} />
              </Grid.Column>
              <Grid.Column>
                <LanguageSelector
                  languages={languages}
                  defaultValue={defaultValue}
                  onSelect={onSelect}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
        <Media>
          {
            ({ playPause }) => (
              <div className="media" id={playerId}>
                <div className="media-player">
                  <Player
                    src={physicalFile(active, true)}
                    vendor={active === video ? 'video' : 'audio'}
                    autoPlay={false}
                    loop="false"
                    onClick={() => playPause()}
                  />
                  <div className="media-controls">
                    <div className="controls-container">
                      <AVPlayPause />
                      <AVTimeElapsed />
                      <Progress />
                      <SeekBar />
                      <AVMuteUnmute />
                      <Volume />
                      <AVFullScreen />
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </Media>
      </div>
    );
  }
}

export default AVPlayerRMP;
