import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import classNames from 'classnames';

class AVCenteredPlay extends Component {
  static propTypes = {
    media: PropTypes.shape({
      isPlaying: PropTypes.bool.isRequired,
      isLoading: PropTypes.bool.isRequired,
      playPause: PropTypes.func.isRequired,
    }).isRequired,
  };

  shouldComponentUpdate({ media }) {
    return this.props.media.isPlaying !== media.isPlaying
      || this.props.media.isLoading !== media.isLoading;
  }

  handlePlayPause = () => {
    if (!this.props.media.isLoading) {
      this.props.media.playPause();
    }
  };

  render() {
    const { media } = this.props;
    const isHidden  = media.isPlaying || media.isLoading;

    return (
      <button
        type="button"
        tabIndex="-1"
        className={classNames('mediaplayer__onscreen-play', { transparent: isHidden })}
        onClick={this.handlePlayPause}
      >
        <Icon name="play" size="huge" />
      </button>
    );
  }
}

export default AVCenteredPlay;
