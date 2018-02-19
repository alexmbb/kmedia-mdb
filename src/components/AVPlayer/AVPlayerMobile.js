import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import debounce from 'lodash/debounce';
import { withRouter } from 'react-router-dom';
import { Icon, Message } from 'semantic-ui-react';

import { MT_AUDIO, MT_VIDEO } from '../../helpers/consts';
import { getQuery } from '../../helpers/url';
import { fromHumanReadableTime } from '../../helpers/time';
import { PLAYER_MODE } from './constants';
import AVPlayPause from './AVPlayPause';
import AVLanguageMobile from './AVLanguageMobile';
import AVAudioVideo from './AVAudioVideo';
import AVEditSlice from './AVEditSlice';
import ShareFormMobile from './ShareFormMobile';

const PLAYER_VOLUME_STORAGE_KEY = '@@kmedia_player_volume';
const DEFAULT_PLAYER_VOLUME     = 0.8;

class AVPlayerMobile extends PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,

    // Language dropdown props.
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    language: PropTypes.string.isRequired,
    onLanguageChange: PropTypes.func.isRequired,

    // Audio/Video switch props.
    item: PropTypes.object.isRequired, // TODO: (yaniv) add shape fo this
    onSwitchAV: PropTypes.func.isRequired,

    // Slice props
    history: PropTypes.object.isRequired,

    // Playlist props
    showNextPrev: PropTypes.bool,
    hasNext: PropTypes.bool,
    hasPrev: PropTypes.bool,
    onFinish: PropTypes.func,
    onPrev: PropTypes.func,
    onNext: PropTypes.func,
  };

  static defaultProps = {
    showNextPrev: false,
    hasNext: false,
    hasPrev: false,
    onFinish: noop,
    onPrev: noop,
    onNext: noop,
  };

  state = {
    error: false,
    errorReason: '',
    mode: PLAYER_MODE.NORMAL,
    isSliceMode: false,
  };

  componentWillMount() {
    const { history } = this.props;

    let sliceStart = 0;
    let sliceEnd   = Infinity;

    let mode    = PLAYER_MODE.NORMAL;
    const query = getQuery(history.location);

    if (query.sstart) {
      mode       = PLAYER_MODE.SLICE_VIEW;
      sliceStart = fromHumanReadableTime(query.sstart).asSeconds();
    }

    if (query.send) {
      mode     = PLAYER_MODE.SLICE_VIEW;
      sliceEnd = fromHumanReadableTime(query.send).asSeconds();
    }

    this.setState({ sliceStart, sliceEnd, mode });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item !== this.props.item) {
      this.setState({ error: false, errorReason: '' });
    }
  }

  onSwitchAV = (...params) => {
    // We only keep the current time.
    // Playing state is irrelevant on mobile due to user gesture finish
    // prior to media element presence on the page
    this.wasCurrentTime = this.media.currentTime;
    this.props.onSwitchAV(...params);
  };

  // Remember the current time and playing state while switching.
  onLanguageChange = (...params) => {
    this.wasCurrentTime = this.media.currentTime;
    this.props.onLanguageChange(...params);
  };

  handleMediaRef = (ref) => {
    if (ref) {
      this.media = ref;
      this.media.addEventListener('play', this.handlePlay);
      this.media.addEventListener('pause', this.handlePause);
      this.media.addEventListener('ended', this.handleEnded);
      this.media.addEventListener('error', this.handleError);
      this.media.addEventListener('timeupdate', this.handleTimeUpdate);
      this.media.addEventListener('volumechange', this.handleVolumeChange);

      this.restoreVolume();
    } else if (this.media) {
      this.media.removeEventListener('play', this.handlePlay);
      this.media.removeEventListener('pause', this.handlePause);
      this.media.removeEventListener('ended', this.handleEnded);
      this.media.removeEventListener('error', this.handleError);
      this.media.removeEventListener('timeupdate', this.handleTimeUpdate);
      this.media.removeEventListener('volumechange', this.handleVolumeChange);
      this.media = ref;
    }
  };

  handlePlay = () => {
    this.seekIfNeeded();

    // make future src changes autoplay
    this.media.autoplay = true;
  };

  handleVolumeChange = (e) => {
    this.persistVolume(e.currentTarget.volume);
  };

  persistVolume = debounce((value) => {
    localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, value);
  }, 200);

  restoreVolume = () => {
    let value = localStorage.getItem(PLAYER_VOLUME_STORAGE_KEY);
    if (value == null || Number.isNaN(value)) {
      value = DEFAULT_PLAYER_VOLUME;
      localStorage.setItem(PLAYER_VOLUME_STORAGE_KEY, value);
    }

    this.media.volume = value;
  };

  seekIfNeeded = () => {
    if (this.wasCurrentTime) {
      this.media.currentTime = this.wasCurrentTime;
      this.wasCurrentTime    = undefined;
    } else if (this.state.sliceStart) {
      this.media.currentTime = this.state.sliceStart;
    }
  };

  handlePause = () => {
    // stop future src changes from autoplay.
    // The exception is paused event fires before ended event
    // In playlist mode we need to move on to next item.
    // so we don't change the autoplay value in such cases.
    if (Math.abs(this.media.currentTime - this.media.duration) > 0.1) {
      this.media.autoplay = false;
    }
  };

  handleEnded = () => {
    if (this.props.onFinish) {
      this.props.onFinish();
    }
  };

  handleTimeUpdate = (e) => {
    const { mode, sliceEnd } = this.state;

    const time = e.currentTarget.currentTime;
    if (mode !== PLAYER_MODE.SLICE_VIEW) {
      return;
    }

    const lowerTime = Math.min(sliceEnd, time);
    if (lowerTime < sliceEnd && (sliceEnd - lowerTime < 0.5)) {
      this.media.pause();
      this.seekTo(sliceEnd);
    }
  };

  handleError = (e) => {
    const { t } = this.props;
    // Show error only on loading of video.
    if (!e.currentTarget.currentTime && this.media.paused) {
      const { item }  = this.props;
      let errorReason = '';
      if (item.src.endsWith('wmv') || item.src.endsWith('flv')) {
        errorReason = t('messages.unsupported-media-format');
      } else {
        errorReason = t('messages.unknown');
      }
      this.setState({ error: true, errorReason });
    }
  };

  seekTo = (t) => {
    this.media.currentTime = t;
  };

  toggleSliceMode = () =>
    this.setState({ isSliceMode: !this.state.isSliceMode });

  handleJumpBack = () => {
    const { currentTime, duration } = this.media;

    const jumpTo = Math.max(0, Math.min(currentTime - 5, duration));
    this.seekTo(jumpTo);
  };

  handleJumpForward = () => {
    const { currentTime, duration } = this.media;

    const jumpTo = Math.max(0, Math.min(currentTime + 5, duration));
    this.seekTo(jumpTo);
  };

  render() {
    const {
            item,
            languages,
            language,
            t,
            showNextPrev,
            hasNext,
            hasPrev,
            onPrev,
            onNext,
          } = this.props;

    const { error, errorReason, isSliceMode } = this.state;

    const isVideo       = item.mediaType === MT_VIDEO;
    const isAudio       = item.mediaType === MT_AUDIO;
    const fallbackMedia = item.mediaType !== item.requestedMediaType;

    if (!item.src) {
      return <Message warning>{t('messages.no-playable-files')}</Message>;
    }

    let mediaEl;

    if (isVideo) {
      mediaEl = (
        <video
          controls
          playsInline
          ref={this.handleMediaRef}
          src={item.src}
          preload="metadata"
          poster={item.preImageUrl}
        />
      );
    } else {
      mediaEl = (
        <audio
          controls
          ref={this.handleMediaRef}
          src={item.src}
          preload="metadata"
        />
      );
    }

    return (
      <div className="mediaplayer">
        <div style={{ marginBottom: '0px' }}>{mediaEl}</div>
        {
          error ?
            <div className="player-button">
              {t('player.error.loading')}
              {errorReason ? ` ${errorReason}` : ''}
              &nbsp;
              <Icon name="warning sign" size="large" />
            </div> :
            null
        }

        <div className="mediaplayer__wrapper">
          <div className="mediaplayer__controls">
            <AVPlayPause
              withoutPlay
              media={{
                isLoading: false,
              }}
              showNextPrev={showNextPrev}
              hasNext={hasNext}
              hasPrev={hasPrev}
              onPrev={onPrev}
              onNext={onNext}
            />
            <div className="mediaplayer__spacer" />
            <AVEditSlice onActivateSlice={this.toggleSliceMode} />
            <button type="button" tabIndex="-1" onClick={this.handleJumpBack}>
              <Icon name="backward" />
            </button>
            <button type="button" tabIndex="-1" onClick={this.handleJumpForward}>
              <Icon name="forward" />
            </button>
            <AVAudioVideo
              isAudio={isAudio}
              isVideo={isVideo}
              onSwitch={this.onSwitchAV}
              fallbackMedia={fallbackMedia}
              t={t}
            />
            <AVLanguageMobile
              languages={languages}
              language={language}
              requestedLanguage={item.requestedLanguage}
              onSelect={this.onLanguageChange}
              t={t}
            />
          </div>
        </div>

        {
          isSliceMode ?
            <ShareFormMobile media={this.media} /> :
            null
        }
      </div>
    );
  }
}

export default withRouter(AVPlayerMobile);