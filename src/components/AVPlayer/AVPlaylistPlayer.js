import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Media } from 'react-media-player';

import { MT_AUDIO } from '../../helpers/consts';
import * as shapes from '../shapes';
import AVMobileCheck from './AVMobileCheck';
import { getQuery } from '../../helpers/url';
import { DeviceInfoContext } from '../../helpers/app-contexts';

class AVPlaylistPlayer extends Component {
  static contextType = DeviceInfoContext;
  static propTypes   = {
    items: PropTypes.arrayOf(shapes.VideoItem).isRequired,
    selected: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    uiLanguage: PropTypes.string.isRequired,
    onSelectedChange: PropTypes.func.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
    onSwitchAV: PropTypes.func.isRequired,
    history: shapes.History.isRequired,
  };

  constructor(props) {
    super(props);
    const { history } = props;
    let autoPlay      = false;

    if (history) {
      const query = getQuery(history.location);
      if (query.sstart) {
        autoPlay = true;
      }
    }

    this.state = { autoPlay };
  }

  handleMediaEditModeChange = mediaEditMode => this.setState({ mediaEditMode });

  handleDropdownOpenedChange = isDropdownOpened => this.setState({ isDropdownOpened });

  onFinish = () => {
    const { selected, onSelectedChange, items } = this.props;
    if (selected < items.length - 1) {
      onSelectedChange(selected + 1);
    }
    this.setState({ autoPlay: true });
  };

  onNext = () => {
    const { selected, onSelectedChange, items } = this.props;
    if (selected < items.length - 1) {
      onSelectedChange(selected + 1);
    }
  };

  onPrev = () => {
    const { selected, onSelectedChange } = this.props;
    if (selected > 0) {
      onSelectedChange(selected - 1);
    }
  };

  onPlay = () => this.setState({ autoPlay: true });

  onPause = () => this.setState({ autoPlay: false });

  render() {
    const { selected, items, language, onSwitchAV, onLanguageChange, uiLanguage } = this.props;
    const { autoPlay, mediaEditMode, isDropdownOpened }                           = this.state;
    const { autoPlayAllowed }                                                     = this.context;

    const currentItem = items[selected];

    // hasNext, hasPrev are not trivial as checking the indexes due to fact
    // that in some languages there might be missing audio or video file.
    const hasNext = selected < items.length - 1 && items.slice(selected).some(f => !!f.src);
    const hasPrev = selected > 0 && items.slice(0, selected).some(f => !!f.src);

    const isAudio = currentItem.mediaType === MT_AUDIO;

    return (
      <div
        className={classNames('avbox__player', {
          'avbox__player--is-audio': isAudio,
          'avbox__player--is-audio--edit-mode': isAudio && mediaEditMode === 2,
          'avbox__player--is-audio--normal-mode': isAudio && mediaEditMode === 0,
          'avbox__player--is-audio--dropdown-opened': isAudio && isDropdownOpened && !mediaEditMode,
          'avbox__player--is-audio--dropdown-closed': isAudio && !isDropdownOpened && !mediaEditMode,
          'avbox__player--is-4x3': currentItem.unit.film_date < '2014',
          'mobile-device': !autoPlayAllowed,
        })}
      >
        <div className="avbox__media-wrapper">
          <Media>
            <AVMobileCheck
              autoPlay={autoPlay}
              item={currentItem}
              onSwitchAV={onSwitchAV}
              languages={currentItem.availableLanguages}
              uiLanguage={uiLanguage}
              selectedLanguage={currentItem.language}
              requestedLanguage={language}
              onLanguageChange={onLanguageChange}
              // Playlist props
              showNextPrev
              onFinish={this.onFinish}
              hasNext={hasNext}
              hasPrev={hasPrev}
              onPrev={this.onPrev}
              onNext={this.onNext}
              onPause={this.onPause}
              onPlay={this.onPlay}
              onMediaEditModeChange={this.handleMediaEditModeChange}
              onDropdownOpenedChange={this.handleDropdownOpenedChange}
              autoPlayAllowed={autoPlayAllowed}
            />
          </Media>
        </div>
      </div>
    );
  }
}

export default AVPlaylistPlayer;
