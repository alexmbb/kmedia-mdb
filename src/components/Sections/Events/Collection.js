import React, { Component } from 'react';
import moment from 'moment/moment';
import { Header, Image, Menu, Ref } from 'semantic-ui-react';

import { DATE_FORMAT, NO_NAME } from '../../../helpers/consts';
import { fromToLocalized } from '../../../helpers/date';
import { formatDuration } from '../../../helpers/utils';
import PlaylistCollection from '../../Pages/PlaylistCollection/Container';
import PlaylistWidget from '../../Pages/PlaylistCollection/widgets/Playlist/Playlist';
import logo from '../../../images/event_logo.png';

class MyPlaylistWidget extends PlaylistWidget {

  handleSelectedRef = x => this.setState({ selectedRef: x });

  componentDidUpdate(prevProps, prevState) {
    // We want selected item to visible to the user.
    // So we scrollIntoView if it's not.
    if (this.state.selectedRef &&
      (!prevState || this.state.selectedRef !== prevState.selectedRef)) {

      const { top: pTop, bottom: pBottom } = this.playlistView.getBoundingClientRect();
      const { top, bottom }                = this.state.selectedRef.getBoundingClientRect();

      if ((bottom < pTop) || (top > pBottom)) {
        this.state.selectedRef.scrollIntoView();
      }
    }
  }

  renderHeader() {
    const { name, start_date, end_date } = this.props.playlist.collection;

    return (
      <Header inverted as="h2">
        <Image circular src={logo} floated="left" />{name}
        <Header.Subheader>
          {fromToLocalized(moment.utc(start_date, DATE_FORMAT), moment.utc(end_date, DATE_FORMAT))}
        </Header.Subheader>
      </Header>
    );
  }

  renderPlaylistSection(section, items, offset) {
    const { t, selected } = this.props;

    return (

      <Menu.Item key={section}>
        <Menu.Header>
          {t(`events.collection.playlist.${section}`)}
        </Menu.Header>
        {
          items.map((item, index) => {
              const { unit } = item;

              const mItem = (
                <Menu.Item
                  key={unit.id}
                  name={`${offset + index}`}
                  active={(offset + index) === selected}
                  onClick={this.handleItemClick}
                >
                  {
                    section === 'preparation' || section === 'appendices' ?
                      <strong>{t('values.date', { date: new Date(unit.film_date) })} &nbsp;</strong> :
                      null
                  }
                  {unit.name || NO_NAME} - {formatDuration(unit.duration)}
                </Menu.Item>
              );

              if ((offset + index) === selected) {
                return <Ref innerRef={this.handleSelectedRef} key={unit.id}>{mItem}</Ref>;
              }
              return mItem;
            }
          )
        }
      </Menu.Item>
    );
  }

  renderContents() {
    const { items, groups } = this.props.playlist;

    return (
      <div
        ref={c => this.playlistView = c}
        className="avbox__playlist-view"
      >
        <Menu vertical fluid size="small">
          {
            ['lessons', 'other_parts', 'preparation', 'appendices']
              .map(x => {
                const offsets = groups[x];
                if (!offsets) {
                  return null;
                }

                const [offset, len] = offsets;
                return this.renderPlaylistSection(x, items.slice(offset, offset + len), offset);
              })
          }
        </Menu>
      </div>
    );
  }
}

class EventCollection extends Component {
  render() {
    return <PlaylistCollection PlaylistComponent={MyPlaylistWidget} />;
  }
}

export default EventCollection;
