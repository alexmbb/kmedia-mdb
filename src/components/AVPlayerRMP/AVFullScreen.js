import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';
import { Icon } from 'semantic-ui-react';

class AVFullscreen extends Component {
  static propTypes = {
    media: PropTypes.shape({
      isFullscreen: PropTypes.bool.isRequired,
      fullscreen: PropTypes.func.isRequired
    }).isRequired,
  };

  shouldComponentUpdate({ media }) {
    return this.props.media.isFullscreen !== media.isFullscreen;
  }

  handleFullscreen = () => {
    this.props.media.fullscreen();
  };

  render() {
    const { media } = this.props;
    return (
      <button
        type="button"
        className="player-button player-control-fullscreen"
        onClick={this.handleFullscreen}
      >
        <Icon
          name={media.isFullscreen ? 'compress' : 'expand'}
          style={{ margin: 0, height: '100%' }}
        />
      </button>
    );
  }
}

export default withMediaProps(AVFullscreen);
