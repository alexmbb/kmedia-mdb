import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Feed } from 'semantic-ui-react';

import { isEmpty } from '../../../helpers/utils';
import * as shapes from '../../shapes';

const screenNames = {
  Michael_Laitman: 'Михаэль Лайтман',
  laitman_co_il: 'מיכאל לייטמן',
  laitman: 'Michael Laitman',
  laitman_es: 'Michael Laitman',
};

class TwitterFeed extends Component {
  static propTypes = {
    tweets: PropTypes.arrayOf(shapes.Tweet),
  };

  static defaultProps = {
    tweets: [],
  };

  getBestVideoVariant = (x) => {
    const { video_info: { variants } } = x;
    if (isEmpty(variants)) {
      return null;
    }

    const playable = variants.filter(y => y.content_type.startsWith('video'));
    if (isEmpty(playable)) {
      return null;
    }

    let best = playable[0];
    for (let i = 1; i < playable.length; i++) {
      if (best.bitrate < playable[i].bitrate) {
        best = playable[i];
      }
    }

    return best;
  };

  prepare = (raw) => {
    const { full_text: fullText, entities, extended_entities: exEntities } = raw;

    const replacements = [
      ...(entities.hashtags || []).map(x => ({ ...x, entityType: 'hashtag' })),
      ...(entities.urls || []).map(x => ({ ...x, entityType: 'url' })),
      ...(entities.user_mentions || []).map(x => ({ ...x, entityType: 'user_mention' })),
      ...(exEntities.media || []).map(x => ({ ...x, entityType: 'media' })),
    ];

    if (replacements.length === 0) {
      return fullText;
    }

    replacements.sort((a, b) => {
      const { indices: [x] } = a;
      const { indices: [y] } = b;
      return x - y;
    });

    let html   = '';
    let offset = 0;
    replacements.forEach((x) => {
      const { indices: [s, e], entityType } = x;

      html += fullText.slice(offset, s);

      switch (entityType) {
      case 'hashtag':
        html += `<a href="https://twitter.com/hashtag/${x.text}" target="_blank" rel="noopener noreferrer">#${x.text}</a>`;
        break;
      case 'url':
        html += `<a href="${x.expanded_url}" target="_blank" rel="noopener noreferrer">${x.display_url}</a>`;
        break;
      case 'user_mention':
        html += `<a href="https://twitter.com/${x.screen_name}" target="_blank" title="${x.name}" rel="noopener noreferrer">@${x.screen_name}</a>`;
        break;
      case 'media':
        switch (x.type) {
        case 'photo':
          html += `<img class="tweet--media" src="${x.media_url_https}" alt="${x.ext_alt_text}" />`;
          break;
        case 'video': {
          const variant = this.getBestVideoVariant(x);
          if (variant) {
            html += `<video controls playsinline preload="none" poster="${x.media_url_https}" class="tweet--media" src="${variant.url}" />`;
          } else {
            html += fullText.slice(s, e);
          }
          break;
        }
        default:
          html += fullText.slice(s, e);
          break;
        }
        break;
      default:
        html += fullText.slice(s, e);
        break;
      }

      offset = e;
    });

    if (offset < fullText.length) {
      html += fullText.slice(offset);
    }

    html = html.replace(/\n/, '<br/>');

    return html;
  };

  renderTweet = (tweet) => {
    const {
            username, twitter_id: tID, created_at: ts, raw
          }   = tweet;
    const mts = moment(ts);

    const screenName = screenNames[username];

    return (
      <Feed.Event key={tID} className="tweet">
        <Feed.Content>
          <Feed.Summary>
            <a href={`https://twitter.com/${username}`} target="_blank" rel="noopener noreferrer">
              {screenName}
              &nbsp;&nbsp;
              <span className="tweet--username">
                @{username}
              </span>
            </a>
            <Feed.Date>
              <a
                href={`https://twitter.com/${username}/status/${tID}`}
                title={mts.format('lll')}
                target="_blank"
                rel="noopener noreferrer"
              >
                {mts.format('lll')}
              </a>
            </Feed.Date>
          </Feed.Summary>
          <Feed.Extra text>
            <div dangerouslySetInnerHTML={{ __html: this.prepare(raw) }} />
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
    );
  };

  render() {
    const { tweets } = this.props;

    return (
      <Feed>
        {tweets.map(this.renderTweet)}
      </Feed>
    );
  }
}

export default TwitterFeed;