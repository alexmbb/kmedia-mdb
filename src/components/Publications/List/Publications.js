import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Divider } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import { ErrorSplash, LoadingSplash } from '../../shared/Splash';
import SectionHeader from '../../shared/SectionHeader';
import Pagination from '../../pagination/Pagination';
import ResultsPageHeader from '../../pagination/ResultsPageHeader';
import Filters from '../../Filters/Filters';
import filterComponents from '../../Filters/components';
import List from './List';

const filters = [
  {
    name: 'publishers-filter',
    component: filterComponents.PublishersFilter
  },
  {
    name: 'date-filter',
    component: filterComponents.DateFilter
  },
];

class PublicationsPage extends PureComponent {

  static propTypes = {
    items: PropTypes.arrayOf(shapes.Article),
    wip: shapes.WIP,
    err: shapes.Error,
    pageNo: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onFiltersChanged: PropTypes.func.isRequired,
    onFiltersHydrated: PropTypes.func.isRequired,
  };

  static defaultProps = {
    items: [],
    wip: false,
    err: null,
  };

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
        <SectionHeader section="publications" />
        <Divider fitted />
        <Filters
          namespace="publications"
          filters={filters}
          onChange={onFiltersChanged}
          onHydrated={onFiltersHydrated}
        />
        {content}
      </div>
    );
  }

}

export default translate()(PublicationsPage);