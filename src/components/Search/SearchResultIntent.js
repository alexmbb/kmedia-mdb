import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Button, Card, Container, Header, Icon, Image, Segment } from 'semantic-ui-react';

import { sectionLogo } from '../../helpers/images';
import { selectors } from '../../redux/modules/mdb';
import { tracePath } from '../../helpers/utils';
import { canonicalLink, sectionLink } from '../../helpers/links';
import { actions as listsActions, selectors as lists } from '../../redux/modules/lists';
import { assetUrl, imaginaryUrl, Requests } from '../../helpers/Api';
import Link from '../Language/MultiLanguageLink';
import {
  RTL_LANGUAGES,
  SEARCH_INTENT_FILTER_NAMES,
  SEARCH_INTENT_HIT_TYPE_LESSONS,
  SEARCH_INTENT_HIT_TYPE_PROGRAMS,
  SEARCH_INTENT_INDEX_SOURCE,
  SEARCH_INTENT_INDEX_TOPIC,
  SEARCH_INTENT_NAMES,
  SEARCH_INTENT_SECTIONS,
} from '../../helpers/consts';

import FallbackImage from '../shared/FallbackImage';
import SearchResultBase from './SearchResultBase';

let NUMBER_OF_FETCHED_UNITS = 3 * 4;

class SearchResultIntent extends SearchResultBase {
  static propTypes = {
    ...SearchResultBase.propTypes,
    isMobileDevice: PropTypes.func.isRequired,
    fetchList: PropTypes.func.isRequired
  };

  state = {
    pageNo: 0,
    pageSize: 3,
  };

  // TODO: revisit the NUMBER_OF_FETCHED_UNITS implementation
  // initialize on componentWillMount or constructor
  // note that it is used also in redux connect (mapState)
  componentDidMount() {
    const pageSize          = this.props.isMobileDevice() ? 1 : 3;
    NUMBER_OF_FETCHED_UNITS = pageSize * 4;

    this.askForData(this.props, 0);
    this.setState({ pageSize });
  }

  askForData = () => {
    const { fetchList, hit: { _index, _source: { content_type: contentType, mdb_uid: mdbUid, } } } = this.props;

    if (!['topics-filter', 'sources-filter'].includes(SEARCH_INTENT_FILTER_NAMES[_index])) {
      return;
    }

    const namespace = `intents_${mdbUid}_${contentType}`;
    const params    = {
      content_type: contentType,
      page_size: NUMBER_OF_FETCHED_UNITS,
      [this.parentTypeByIndex(_index)]: mdbUid
    };
    fetchList(namespace, 1, params);
  };

  parentTypeByIndex = (index) => {
    switch (index) {
    case SEARCH_INTENT_INDEX_SOURCE:
      return 'source';
    case SEARCH_INTENT_INDEX_TOPIC:
      return 'tag';
    default:
      return 'tag';
    }
  };

  onScrollRight = () => this.onScrollChange(this.state.pageNo + 1);

  onScrollLeft = () => this.onScrollChange(this.state.pageNo - 1);

  onScrollChange = (pageNo) => {
    if (pageNo < 0 || this.state.pageSize * pageNo >= this.props.unitCounter) {
      return;
    }
    this.setState({ pageNo });
  };

  renderItem = (cu) => {
    let thumbUrl = assetUrl(`api/thumbnail/${cu.id}`);
    if (!thumbUrl.startsWith('http')) {
      thumbUrl = `http://localhost${thumbUrl}`;
    }

    const imgParams = Requests.makeParams({ url: thumbUrl, width: 250 });
    const src       = `${imaginaryUrl('thumbnail')}?${imgParams}`;
    const filmDate  = cu.film_date ? this.props.t('values.date', { date: cu.film_date }) : '';

    return (
      <Card key={cu.id} className="search__card bg_hover_grey" raised>
        <Container className="intent_image">
          <div className="card_header_label">
            {SearchResultBase.mlsToStrColon(cu.duration)}
          </div>
          <div>
            <FallbackImage fluid src={src} />
          </div>
        </Container>
        <Card.Content>
          <Card.Header as="h3">
            <Link
              className="search__link"
              to={canonicalLink(cu, this.getMediaLanguage(this.props.filters))}
            >
              {cu.name}
            </Link>
          </Card.Header>
          <Card.Meta>
            {this.iconByContentType(cu.content_type, true)}
            |&nbsp;
            <strong>{filmDate}</strong>
          </Card.Meta>
          <Card.Description>
            {this.renderFiles(cu)}
            <div className="clear" />
          </Card.Description>
        </Card.Content>
      </Card>
    );
  };

  renderScrollPagination = () => {
    const { pageNo, pageSize } = this.state;
    const numberOfPages        = Math.round(this.props.unitCounter / pageSize);

    const pages   = new Array(numberOfPages).fill('a');
    const content = pages.map((p, i) => (
      <Button onClick={() => this.onScrollChange(i)} key={i} icon className="bg_transparent">
        <Icon name={pageNo === i ? 'circle thin' : 'circle outline'} color="blue" size="small" />
      </Button>
    ));

    return <Segment basic textAlign="center" className="no-padding">{content}</Segment>;
  };

  renderScrollRight = () => {
    const dir = RTL_LANGUAGES.includes(this.props.language) ? 'right' : 'left';
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
    const numberOfPages        = Math.round(this.props.unitCounter / pageSize);
    const dir                  = RTL_LANGUAGES.includes(this.props.language) ? 'left' : 'right';

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
    const { t, queryResult, hit, rank, items, unitCounter, isMobileDevice }             = this.props;
    const { _index: index, _type: type, _source: { mdb_uid: mdbUid, name }, highlight } = hit;

    const { pageNo, pageSize }            = this.state;
    const { search_result: { searchId } } = queryResult;
    const section                         = SEARCH_INTENT_SECTIONS[type];
    const intentType                      = SEARCH_INTENT_NAMES[index];
    const filterName                      = SEARCH_INTENT_FILTER_NAMES[index];
    const getFilterById                   = this.getFilterById(index);

    let resultsType = '';
    const path      = tracePath(getFilterById(mdbUid), getFilterById);
    let display     = '';
    switch (index) {
    case SEARCH_INTENT_INDEX_TOPIC:
      display     = path[path.length - 1].label;
      resultsType = SEARCH_INTENT_HIT_TYPE_PROGRAMS;
      break;
    case SEARCH_INTENT_INDEX_SOURCE:
      display     = path.map(y => y.name).join(' > ');
      resultsType = SEARCH_INTENT_HIT_TYPE_LESSONS;
      break;
    default:
      display = name;
    }

    return (
      <Segment className="search__block">
        <Header as="h2">
          <Image size="small" src={sectionLogo[type]} verticalAlign="bottom" />
          &nbsp;
          <span>{t(`search.intent-prefix.${section}-${intentType.toLowerCase()}`)}</span>
        </Header>
        <Segment.Group horizontal={!isMobileDevice()} className="no-padding no-margin-top no-border no-shadow">
          <Segment className="no-padding  no-border">
            <Header as="h3" color="blue">
              <Link
                className="search__link"
                onClick={() => this.click(mdbUid, index, type, rank, searchId)}
                to={sectionLink(section, [{ name: filterName, value: mdbUid, getFilterById }])}
              >
                {this.titleFromHighlight(highlight, display)}
              </Link>
            </Header>
          </Segment>
          <Segment textAlign={isMobileDevice() ? 'left' : 'right'} className="no-padding  no-border">
            <Icon name="tasks" size="small" />
            <Link
              onClick={() => this.click(mdbUid, index, type, rank, searchId)}
              to={sectionLink(section, [{ name: filterName, value: mdbUid, getFilterById }])}
            >
              <span>{`${t('search.showAll')} ${this.props.total} ${t(`search.${resultsType}`)}`}</span>
            </Link>
          </Segment>
        </Segment.Group>
        <div className="clear" />
        <Card.Group className={`${isMobileDevice() ? 'margin-top-8' : null} search__cards`} itemsPerRow={3} stackable>
          {items.slice(pageNo * pageSize, (pageNo + 1) * pageSize).map(this.renderItem)}
          {pageSize < unitCounter ? this.renderScrollLeft() : null}
          {pageSize < unitCounter ? this.renderScrollRight() : null}
        </Card.Group>
        {pageSize < unitCounter ? this.renderScrollPagination() : null}

        {this.renderDebug(display)}
      </Segment>
    );
  }
}

const mapState = (state, ownProps) => {
  const { hit: { _source: { content_type: contentType, mdb_uid: mdbUid, } } } = ownProps;

  const namespace   = `intents_${mdbUid}_${contentType}`;
  const nsState     = lists.getNamespaceState(state.lists, namespace);
  const unitCounter = (nsState.total > 0 && nsState.total < NUMBER_OF_FETCHED_UNITS) ? nsState.total : NUMBER_OF_FETCHED_UNITS;

  return {
    namespace,
    unitCounter,
    items: (nsState.items || []).map(x => selectors.getDenormContentUnit(state.mdb, x)),
    wip: nsState.wip,
    err: nsState.err,
    total: nsState.total,
  };
};

const mapDispatch = dispatch => bindActionCreators({ fetchList: listsActions.fetchList }, dispatch);

export default connect(mapState, mapDispatch)(SearchResultIntent);
