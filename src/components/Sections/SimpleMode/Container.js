import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';
import isEqual from 'react-fast-compare';

import { getQuery, updateQuery } from '../../../helpers/url';
import { isEmpty } from '../../../helpers/utils';
import { selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import { actions, selectors } from '../../../redux/modules/simpleMode';
import * as shapes from '../../shapes';
import Page from './Page';
import { groupOtherMediaByType, renderCollection } from './RenderListHelpers';
import { DeviceInfoContext } from '../../../helpers/app-contexts';

class SimpleModeContainer extends Component {
  static contextType = DeviceInfoContext;

  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    items: shapes.SimpleMode,
    wip: shapes.WIP,
    err: shapes.Error,
    uiLanguage: PropTypes.string.isRequired,
    contentLanguage: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    fetchForDate: PropTypes.func.isRequired,
    history: shapes.History.isRequired,
  };

  static defaultProps = {
    items: {},
    wip: false,
    err: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      filesLanguage: props.contentLanguage,
      blinkLangSelect: false,
    };
  }

  componentDidMount() {
    const { state, props } = this;
    const query            = getQuery(props.location);
    const date             = (query.date && moment(query.date).isValid()) ? moment(query.date, 'YYYY-MM-DD').toDate() : new Date();

    if (!state.date || !moment(date).isSame(state.date, 'day')) {
      this.handleDayClick(date);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { state, props } = this;

    if (state.filesLanguage !== nextProps.contentLanguage) {
      this.setState({ filesLanguage: nextProps.contentLanguage });
    }
    if (props.uiLanguage !== nextProps.uiLanguage) {
      this.handleDayClick(state.date, {}, nextProps);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { items, uiLanguage, contentLanguage, wip, err, } = nextProps;
    const { filesLanguage }                                 = nextState;
    const { props, state }                                  = this;

    return !(
      uiLanguage === props.uiLanguage
      && filesLanguage === state.filesLanguage
      && contentLanguage === state.filesLanguage
      && isEqual(wip, props.wip) && isEqual(err, props.err)
      && isEqual(items, props.items)
    );
  }

  handleLanguageChanged = (e, filesLanguage) => {
    const language = filesLanguage || e.currentTarget.value;

    this.setState({ filesLanguage: language, blinkLangSelect: false });
  };

  handleDayClick = (selectedDate, { disabled } = {}, nextProps = {}) => {
    const { props } = this;

    if (disabled) {
      return;
    }

    this.setState({ date: selectedDate });

    const date     = moment(selectedDate).format('YYYY-MM-DD');
    const language = nextProps.uiLanguage || props.uiLanguage;
    props.fetchForDate({ date, language });
    updateQuery(props.history, query => ({
      ...query,
      date
    }));
  };

  helpChooseLang = () => {
    this.setState({ blinkLangSelect: true });
    setTimeout(() => this.setState({ blinkLangSelect: false }), 7500);
    this.scrollToTop();
  };

  renderUnitOrCollection = (item, language, t) => (
    isEmpty(item.content_units)
      ? groupOtherMediaByType(item, language, t, this.helpChooseLang)
      : renderCollection(item, language, t, this.helpChooseLang)
  );

  scrollToTop = () => {
    const { deviceInfo: { browser: { name: browserName } } } = this.context;
    (browserName.toLowerCase() === 'chrome' || browserName.toLowerCase() === 'firefox')
      ? window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      : window.scrollTo(0, 0);
  };

  render() {
    const { filesLanguage: language, blinkLangSelect, date: selectedDate } = this.state;

    const pageProps = {
      ...this.props,
      selectedDate,
      language,
      renderUnit: this.renderUnitOrCollection,
      onDayClick: this.handleDayClick,
      onLanguageChange: this.handleLanguageChanged,
      blinkLangSelect
    };
    return <Page {...pageProps} />;
  }
}

export const mapState = (state) => {
  const items = { ...selectors.getItems(state.simpleMode) };

  return {
    items: {
      lessons: items.lessons.map(x => mdb.getDenormCollectionWUnits(state.mdb, x)).filter(x => !isEmpty(x)),
      others: items.others.map(x => mdb.getDenormContentUnit(state.mdb, x)).filter(x => !isEmpty(x)),
    },
    wip: selectors.getWip(state.simpleMode),
    err: selectors.getError(state.simpleMode),
    uiLanguage: settings.getLanguage(state.settings),
    contentLanguage: settings.getContentLanguage(state.settings),
  };
};

export const mapDispatch = dispatch => (
  bindActionCreators({
    fetchForDate: actions.fetchForDate,
  }, dispatch)
);

export default withRouter(connect(mapState, mapDispatch)(withNamespaces()(SimpleModeContainer)));
