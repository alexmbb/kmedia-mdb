import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { translate } from 'react-i18next';

import Filters from '../Filters/Filters';
import filterComponents from '../Filters/filterComponents';
import FiltersHydrator from '../Filters/FiltersHydrator/FiltersHydrator';
import FilterTags from '../Filters/FilterTags/FilterTags';

const filters = [
  {
    name: 'date-filter',
    component: filterComponents.DateFilter
  },
  {
    name: 'topics-filter',
    component: filterComponents.MultiTopicsFilter
  }
];

class SearchResultsFilters extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    onSortByChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { t, sortBy, onSortByChange, onHydrated, onChange } = this.props;

    const options = ['relevance', 'newertoolder', 'oldertonewer'].map(o => ({
      text: t(`search.sorts.${o}`),
      value: o,
    }));

    return (
      <div>
        <FiltersHydrator namespace="search" onHydrated={onHydrated} />
        <Filters
          namespace="search"
          filters={filters}
          onFilterApplication={onChange}
          rightItems={[
            <span key="span" style={{ padding: '10px' }}>
              {t('search.sortby')}:
            </span>,
            <Dropdown
              key="dropdown"
              item
              compact
              options={options}
              value={sortBy}
              onChange={onSortByChange}
            />
          ]}
        />
        <FilterTags namespace="search" onClose={onChange} />
      </div>
    );
  }
}

export default translate()(SearchResultsFilters);
