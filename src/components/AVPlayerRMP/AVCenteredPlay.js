import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withMediaProps } from 'react-media-player';
import { Icon } from 'semantic-ui-react';



class AVCenteredPlay extends Component {
  static propTypes = {
    media: PropTypes.shape({
      isPlaying: PropTypes.bool.isRequired,
      isLoading: PropTypes.bool.isRequired,
      playPause: PropTypes.func.isRequired
    }).isRequired,
  };

  shouldComponentUpdate({ media }) {
    return this.props.media.isPlaying !== media.isPlaying ||
      this.props.media.isLoading !== media.isLoading ;
  }

  handlePlayPause = () => {
    this.props.media.playPause();
  };

  render() {
    const { media } = this.props;

    if (media.isPlaying || media.isLoading) {
      return <div />;
    }

    return (
      <button
        type="button"
        tabIndex="-1"
        className={classNames('mediaplayer__onscreen-play')}
        onClick={this.handlePlayPause}
      >
        <Icon
          name={'play'}
          size="huge"
        />
      </button>
    );
  }
}

export default withMediaProps(AVCenteredPlay);
