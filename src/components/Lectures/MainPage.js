import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import {
  Container,
  Divider,
  Menu,
} from 'semantic-ui-react';


import { formatError } from '../../helpers/utils';
import * as shapes from '../shapes';
import { ErrorSplash, LoadingSplash } from '../shared/Splash';
import SectionHeader from '../shared/SectionHeader';
import Pagination from '../pagination/Pagination';
import ResultsPageHeader from '../pagination/ResultsPageHeader';
import Filters from '../Filters/Filters';
import filterComponents from '../Filters/components';
import List from './List/List';
import NavLink from '../Language/MultiLanguageNavLink';


const filters = [
  {
    name: 'topics-filter',
    component: filterComponents.TopicsFilter
  },
  {
    name: 'sources-filter',
    component: filterComponents.SourcesFilter
  },
  {
    name: 'date-filter',
    component: filterComponents.DateFilter
  },
];

export const tabs = [
  'virtual-lessons',
  'lectures',
  'women-lessons',
  'children-lessons'
];


class LecturesPage extends PureComponent {
  static propTypes = {
    items:             PropTypes.arrayOf(shapes.Lecture),
    wip:               shapes.WIP,
    err:               shapes.Error,
    pageNo:            PropTypes.number.isRequired,
    total:             PropTypes.number.isRequired,
    pageSize:          PropTypes.number.isRequired,
    language:          PropTypes.string.isRequired,
    t:                 PropTypes.func.isRequired,
    match:             shapes.RouterMatch.isRequired,
    onPageChange:      PropTypes.func.isRequired,
    onFiltersChanged:  PropTypes.func.isRequired,
    onFiltersHydrated: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
    wip: false,
    err: null,
  };


  getTabs() {
    const {
      t,
      match
    } = this.props;
    const active = match.params.tab || tabs[0];

    const submenuItems = tabs.map(x => (
      <Menu.Item
        key={x}
        name={x}
        as={NavLink}
        to={`/lectures/${x}`}
        active={active === x}
      >
        {t(`lectures.tabs.${x}`)}
      </Menu.Item>
    ));

    return submenuItems;
  }

  render() {
    const { items,
      wip,
      err,
      pageNo,
      total,
      pageSize,
      language,
      t,
      onPageChange,
      onFiltersChanged,
      onFiltersHydrated } = this.props;
    const tabName = this.props.match.params.tab  || tabs[0];
    let content;

    if (err) {
      content = <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
    } else if (wip) {
      content = <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    } else {
      content = (
        <div>
          <Container className="padded">
            <ResultsPageHeader pageNo={pageNo} total={total} pageSize={pageSize} t={t} />
            <List items={items} />
          </Container>
          <Divider fitted />
          <Container className="padded" textAlign="center">
            <Pagination
              pageNo={pageNo}
              pageSize={pageSize}
              total={total}
              language={language}
              onChange={onPageChange}
            />
          </Container>
        </div>
      );
    }

    return (
      <div>
        <SectionHeader section="lectures" submenuItems={this.getTabs()} />
        <Divider fitted />
        <Filters
          namespace={`lectures-${tabName}`}
          filters={filters}
          onChange={onFiltersChanged}
          onHydrated={onFiltersHydrated}
        />
        {content}
      </div>
    );
  }
}

export default translate()(LecturesPage);
