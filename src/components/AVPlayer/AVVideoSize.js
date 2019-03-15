import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { Dropdown } from 'semantic-ui-react';
import { VS_DEFAULT, VS_FHD, VS_HD, VS_NAMES, VS_NHD } from '../../helpers/consts';

const sortedVS = [VS_FHD, VS_HD, VS_NHD];

export default class AVVideoSize extends Component {
  static propTypes = {
    value: PropTypes.string,
    qualities: PropTypes.arrayOf(PropTypes.string),
    onSelect: PropTypes.func,
  };

  static defaultProps = {
    value: VS_DEFAULT,
    qualities: [],
    onSelect: noop,
  };

  handleChange = (e, data) => this.props.onSelect(e, data.value);

  render() {
    const { value, qualities } = this.props;
    if (qualities.length < 2 && qualities[0] === VS_DEFAULT) {
      return null;
    }

    const options = sortedVS
      .filter(x => qualities.includes(x))
      .map(x => ({ value: x, text: VS_NAMES[x] }));

    return (
      <div className="mediaplayer__video-size">
        <Dropdown
          floating
          scrolling
          upward
          disabled={qualities.length === 1}
          icon={null}
          selectOnBlur={false}
          options={options}
          value={value}
          onChange={this.handleChange}
          trigger={<button type="button">{VS_NAMES[value]}</button>}
        />
      </div>
    );
  }
}
