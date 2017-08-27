import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Media, Player } from 'react-media-player';
import classNames from 'classnames';

import * as shapes from '../shapes';
import { physicalFile } from '../../helpers/utils';
import AVPlayPause from './AVPlayPause';
import AVPlaybackRate from './AVPlaybackRate';
import AVCenteredPlay from './AVCenteredPlay';
import AVTimeElapsed from './AVTimeElapsed';
import AVFullScreen from './AVFullScreen';
import AVMuteUnmute from './AVMuteUnmute';
import AVLanguage from './AVLanguage';
import AVAudioVideo from './AVAudioVideo';
import AVProgress from './AVProgress';

class AVPlayerRMP extends PureComponent {

  static propTypes = {
    audio: shapes.MDBFile,
    video: shapes.MDBFile,
    active: shapes.MDBFile,
    onSwitchAV: PropTypes.func.isRequired,
    // poster: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    defaultValue: PropTypes.string.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    audio: null,
    video: null,
    active: null,
    mediaType: null,
    poster: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      videoElement: null,
      controlsVisible: true,
      timeoutId: null,
    };
  }

  componentDidMount() {
    const videoElement = this.player_.instance;
    this.setState({ videoElement });
    // By default hide controls after a while if player playing.
    this.hideControlsTimeout();
  }

  buffers = () => {
    const { videoElement } = this.state;
    const ret              = [];
    if (videoElement) {
      for (let idx = 0; idx < videoElement.buffered.length; ++idx) {
        ret.push({
          start: videoElement.buffered.start(idx),
          end: videoElement.buffered.end(idx)
        });
      }
    }
    return ret;
  };

  // Remember the current time and isPlaying while switching.
  onSwitchAV = (...params) => {
    const { onSwitchAV } = this.props;
    const { currentTime, isPlaying } = this.player_.context.media;
    this.setState({ wasCurrentTime: currentTime, wasPlaying: isPlaying }, () => {
      onSwitchAV(...params);
    });
  }

  // Remember the current time and isPlaying while switching.
  onLanguageChange = (...params) => {
    const { onLanguageChange } = this.props;
    const { currentTime, isPlaying } = this.player_.context.media;
    this.setState({ wasCurrentTime: currentTime, wasPlaying: isPlaying }, () => {
      onLanguageChange(...params);
    });
  }

  onPlayerReady = () => {
    const { wasCurrentTime, wasPlaying } = this.state;
    if (wasCurrentTime) {
      this.player_.context.media.seekTo(wasCurrentTime);
    }
    if (wasPlaying) {
      this.player_.context.media.play();
    }
    this.setState({wasCurrentTime: undefined, wasPlaying: undefined});
  }

  showControls = (callback = undefined) => {
    const { timeoutId } = this.state;
    if (timeoutId) {
      console.log('Show controls. Set timetout null.');
      this.setState({controlsVisible: true, timeoutId: null}, () => {
        clearTimeout(timeoutId);
        if (callback) {
          callback();
        }
      });
    } else {
      console.log('Show controls.')
      this.setState({controlsVisible: true}, callback);
    }
  }

  hideControlsTimeout = () => {
    if (!this.state.timeoutId) {
      const timeoutId = setTimeout(() => {
        console.log('Hide controls now.')
        this.setState({controlsVisible: false});
      }, 2000);
      console.log('Set timeout.');
      this.setState({timeoutId});
    }
  }

  controlsEnter = () => {
    this.showControls();
  }

  centerMove = () => {
    this.showControls(() => this.hideControlsTimeout());
  }

  controlsLeave = () => {
    this.hideControlsTimeout();
  }

  playbackRateChange = (e, rate) => {
    this.player_.instance.playbackRate = parseFloat(rate.slice(0, -1));
  }

  render() {
    const { audio, video, active, languages, defaultValue, t } = this.props;
    const { controlsVisible } = this.state;

    const forceShowControls = !this.player_ || !this.player_.context.media.isPlaying;
    console.log('forceShowControls', forceShowControls);

    const centerPlay = active === video ? (
      <div className="media-center-control"
           onMouseMove={this.centerMove}>
        <AVCenteredPlay />
      </div>
    ) : null;

    return (
      <div>

        <Media>
          {
            ({ playPause, isFullscreen }) => (
              <div
                className="media"
                style={{
                  minHeight: active === video ? 200 : 40,
                  minWidth: active === video ? 300 : 'auto'
                }}
              >
                <div
                  className={classNames('media-player', {
                    'media-player-fullscreen': isFullscreen,
                    fade: !controlsVisible && !forceShowControls
                  })}
                >
                  <Player
                    ref={c => this.player_ = c}
                    src="https://www.html5rocks.com/en/tutorials/video/basics/devstories.mp4"
                    vendor={active === video ? 'video' : 'audio'}
                    autoPlay={false}
                    onReady={this.onPlayerReady}
                    loop="false"
                    preload="auto"
                    onClick={(...params) => { console.log(...params); playPause(); }}
                  />
                  <div
                    className={classNames('media-controls', { fade: !controlsVisible && !forceShowControls })}
                  >
                    <div className="controls-wrapper"
                         onMouseEnter={this.controlsEnter}
                         onMouseLeave={this.controlsLeave}>
                      <div className="controls-container">
                        <AVPlayPause />
                        <AVTimeElapsed />
                        <AVProgress buffers={this.buffers()} />
                        <AVPlaybackRate
                          onSelect={this.playbackRateChange}
                          upward={video === active} />
                        <AVMuteUnmute upward={video === active} />
                        <AVAudioVideo
                          isAudio={audio === active}
                          isVideo={video === active}
                          setAudio={this.onSwitchAV}
                          setVideo={this.onSwitchAV}
                          t={t}
                        />
                        <AVLanguage
                          languages={languages}
                          defaultValue={defaultValue}
                          onSelect={this.onLanguageChange}
                          upward={video === active}
                        />
                        <AVFullScreen />
                      </div>
                    </div>
                    { centerPlay }
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
