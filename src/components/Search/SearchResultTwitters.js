import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Button, Card, Header, Icon, Segment, Feed } from 'semantic-ui-react';
import { Swipeable } from 'react-swipeable';

import { isLanguageRtl } from '../../helpers/i18n-utils';
import { actions, selectors } from '../../redux/modules/publications';
import TwitterFeed from '../Sections/Publications/tabs/Twitter/Feed';

import SearchResultBase from './SearchResultBase';
import { DeviceInfoContext } from "../../helpers/app-contexts";

class SearchResultTwitters extends SearchResultBase {
  static contextType = DeviceInfoContext;
  static propTypes = {
    ...SearchResultBase.propTypes,
    fetchTweets: PropTypes.func.isRequired
  };

  state = {
    pageNo: 0,
    pageSize: 3,
  };

  componentDidMount() {
    const pageSize = this.context.isMobileDevice ? 1 : 3;

    this.askForData(0, pageSize);
    this.setState({ pageSize });
  }

  askForData = (pageNo = this.state.pageNo, page_size = this.state.pageSize) => {
    const { fetchTweets, tweetIds } = this.props;

    const id = tweetIds.slice(pageNo * page_size, (pageNo + 1) * page_size);
    fetchTweets('tweets_many', 1, { id });
  };

  onScrollRight = () => this.onScrollChange(this.state.pageNo + 1);

  onScrollLeft = () => this.onScrollChange(this.state.pageNo - 1);

  onScrollChange = (pageNo) => {
    if (pageNo < 0 || this.state.pageSize * pageNo >= this.props.tweetIds.length) {
      return;
    }
    this.setState({ pageNo });
    this.askForData(pageNo);
  };

  getSwipeProps = () => {
    const isRTL = isLanguageRtl(this.props.language);
    return {
      onSwipedLeft: isRTL ? this.onScrollRight : this.onScrollLeft,
      onSwipedRight: isRTL ? this.onScrollLeft : this.onScrollRight
    };
  };

  renderItem = ({ twitter, highlight }) => {
    return (
      <Card key={twitter.twitter_id} className="search__card bg_hover_grey home-twitter" raised>
        <Card.Content>
          <Feed className="min-height-200">
            <TwitterFeed snippetVersion withDivider={false} twitter={twitter} highlight={highlight && highlight[0]} />
          </Feed>
        </Card.Content>
      </Card>
    );
  };

  renderScrollPagination = () => {
    const { pageNo, pageSize } = this.state;
    const numberOfPages        = Math.round(this.props.tweetIds.length / pageSize);

    const pages   = new Array(numberOfPages).fill('a');
    const content = pages.map((p, i) => (
      <Button onClick={() => this.onScrollChange(i)} key={i} icon className="bg_transparent">
        <Icon name={pageNo === i ? 'circle thin' : 'circle outline'} color="blue" size="small" />
      </Button>
    ));

    return <Segment basic textAlign="center" className="no-padding">{content}</Segment>;
  };

  renderScrollRight = () => {
    const dir = isLanguageRtl(this.props.language) ? 'right' : 'left';
    return this.state.pageNo === 0 ? null : (
      <Button
        icon={`chevron ${dir}`}
        circular
        basic
        size="large"
        onClick={this.onScrollLeft}
        className="scroll_intents"
        style={{ [dir]: '-15px' }}
      />
    );
  };

  renderScrollLeft = () => {
    const { pageNo, pageSize } = this.state;
    const numberOfPages        = Math.round(this.props.tweetIds.length / pageSize);
    const dir                  = isLanguageRtl(this.props.language) ? 'left' : 'right';

    return (pageNo >= numberOfPages - 1) ? null : (
      <Button
        icon={`chevron ${dir}`}
        circular
        basic
        size="large"
        onClick={this.onScrollRight}
        className="scroll_intents"
        style={{ [dir]: '-15px' }}
      />
    );
  };

  render() {
    const { t, items, tweetIds, language } = this.props;
    const { pageNo, pageSize }             = this.state;
    const { isMobileDevice }               = this.context;

    return (
      <Segment className="search__block no-border">
        <Segment.Group horizontal={!isMobileDevice} className="no-padding no-margin-top no-border no-shadow">
          <Segment className="no-padding  no-border">
            <Header as="h3" color="blue">{t('home.twitter-title')}</Header>
          </Segment>
          <Segment textAlign={isMobileDevice ? 'left' : 'right'} className="no-padding  no-border">
            <a href={`/${language}/publications/twitter`}>{t('home.all-tweets')}</a>
          </Segment>
        </Segment.Group>
        <div className="clear" />
        <Swipeable {...this.getSwipeProps()} >
          <Card.Group className={`${isMobileDevice ? 'margin-top-8' : null} search__cards`} itemsPerRow={3} stackable>
            {items.slice(pageNo * pageSize, (pageNo + 1) * pageSize).filter(x => x && x.twitter).map(this.renderItem)}
            {pageSize < tweetIds.length ? this.renderScrollLeft() : null}
            {pageSize < tweetIds.length ? this.renderScrollRight() : null}
          </Card.Group>
        </Swipeable>
        {pageSize < tweetIds.length ? this.renderScrollPagination() : null}
      </Segment>
    );
  }
}

const twitterMapFromState = (state, tweets) => {
  return tweets.map(tweet => {
    const content = tweet && tweet.highlight && tweet.highlight.content;
    const mdb_uid = tweet && tweet._source && tweet._source.mdb_uid;
    //const { highlight: { content }, _source: { mdb_uid } } = tweet;
    const twitter = selectors.getTwitter(state.publications, mdb_uid);
    return { twitter, highlight: content };
  });
};

const mapState = (state, ownProps) => {
  const { hit: { _source } } = ownProps;

  return {
    tweetIds: _source.map(x => x._source.mdb_uid) || [],
    items: twitterMapFromState(state, _source),
    wip: selectors.getBlogWip(state.publications),
    err: selectors.getBlogError(state.publications)
  };
};

const mapDispatch = dispatch => bindActionCreators({ fetchTweets: actions.fetchTweets }, dispatch);

export default connect(mapState, mapDispatch)(SearchResultTwitters);
