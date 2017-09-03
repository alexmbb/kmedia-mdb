import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withMediaProps } from 'react-media-player';

class AVDuration extends Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.number,
    style: PropTypes.object,
    className: PropTypes.any,
    media: PropTypes.object.isRequired,
  };

  static defaultProps = {
    name: undefined,
    value: undefined
  };

  static defaultProps = {
    style: undefined
  };

  formatTime = (current) => {
    const h      = Math.floor(current / 3600);
    const m      = Math.floor((current - (h * 3600)) / 60);
    const s      = Math.floor(current % 60);
    const result = [];

    if (h > 0) {
      result.push(h < 10 ? `0${h}` : `${h}`);
    }
    result.push(m < 10 ? `0${m}` : `${m}`);
    result.push(s < 10 ? `0${s}` : `${s}`);

    return result.join(':');
  };

  render() {
    const { style, name, value, className } = this.props;
    const time            = typeof value !== 'undefined' ? value : this.props.media[name];

    return (
      <time className={className} style={style}>
        {this.formatTime(time)}
      </time>
    );
  }
}

export default withMediaProps(AVDuration);
