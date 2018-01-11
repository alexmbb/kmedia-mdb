import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';
import { Icon } from 'semantic-ui-react';

class AVJumpBack extends Component {
  static propTypes = {
    media: PropTypes.shape({
      currentTime: PropTypes.number.isRequired,
      duration: PropTypes.number.isRequired,
      seekTo: PropTypes.func.isRequired,
    }).isRequired,
    jumpSpan: PropTypes.number,
  };

  static defaultProps = {
    jumpSpan: 5,
  };


  onJumpBack = () => {
    let jumpTo = this.props.media.currentTime + this.props.jumpSpan;

    // Make sure we don't exceed the duration boundaries
    jumpTo = Math.max(0, Math.min(jumpTo, this.props.media.duration));

    this.props.media.seekTo(jumpTo);
  };

  isBack = () => this.props.jumpSpan < 0;

  render() {

    return (
        <button
          type="button"
          tabIndex="-1"
          onClick={this.onJumpBack}
        >
          <Icon name={this.isBack() ? 'step backward' : 'step forward'} />
        </button>
    );
  }
}

export default withMediaProps(AVJumpBack);