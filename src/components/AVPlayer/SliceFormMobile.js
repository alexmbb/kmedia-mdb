import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Form, Label } from 'semantic-ui-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { toHumanReadableTime, fromHumanReadableTime } from '../../helpers/time';
import { getQuery, stringify } from '../../helpers/url';

export default class SliceFormMobile extends Component {
  static propTypes = {
    currentTime: PropTypes.number.isRequired,
  };

  constructor() {
    super();
    this.state = { start: '', end: '', url: window.location.href };
  }

  setStart = (e, data) => {
    const start = data && data.value ? data.value : toHumanReadableTime(Math.round(this.props.currentTime, 10));

    let search = { ...getQuery(window.location), sstart: start || 0 };
    if (this.state.end) {
      search.send = fromHumanReadableTime(this.state.end) > fromHumanReadableTime(start) ? this.state.end : start;
    }
    const url = window.location.href.split('?')[0] + '?' + stringify(search);
    this.setState({ start, url });
  };

  setEnd = (e, data) => {
    const end    = data && data.value ? data.value : toHumanReadableTime(Math.round(this.props.currentTime, 10));
    const sstart = !this.state.start ? 0 : (fromHumanReadableTime(this.state.start) < fromHumanReadableTime(end) ) ? this.state.start : end;
    let search   = { ...getQuery(window.location), send: end, sstart };
    const url    = window.location.href.split('?')[0] + '?' + stringify(search);
    this.setState({ end, url, start: sstart });
  };

  render() {
    const { start, end, url } = this.state;

    return (
      <Form>
        <Form.Group inline>
          <Form.Field width={10}>
            <Label>{url}</Label>
          </Form.Field>
          <Form.Field width={2}>
            <CopyToClipboard text={this.state.url}>
              <Button
                circular
                type="button"
                primary
                icon="chain" />
            </CopyToClipboard>
          </Form.Field>
        </Form.Group>

        <Form.Group inline width={6}>
          <Form.Field width={3}>
            <Button
              content={'Start position'}
              onClick={this.setStart} />
          </Form.Field>
          <Form.Field width={3}>
            <Input
              fluid
              value={start}
              onChange={this.setStart} />
          </Form.Field>
        </Form.Group>

        <Form.Group inline width={6}>
          <Form.Field width={3}>
            <Button
              content={'End position'}
              onClick={this.setEnd} />
          </Form.Field>
          <Form.Field width={3}>
            <Input
              fluid
              value={end}
              onChange={this.setEnd} />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}
