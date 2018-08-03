import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown, Menu, Button, Icon } from 'semantic-ui-react';
import { translate } from 'react-i18next';
import { selectors as filterSelectors } from '../../redux/modules/filters';
import Filters from '../Filters/Filters';
import filterComponents from '../Filters/components';
import { bindActionCreators } from 'redux';
import { actions, selectors } from '../../redux/modules/filters';
import MenuItems from '../Layout/MenuItems';

const filters = [
  {
    name: 'date-filter',
    component: filterComponents.DateFilter,
  },
  {
    name: 'topics-filter',
    component: filterComponents.TopicsFilter,
  },
  {
    name: 'sources-filter',
    component: filterComponents.SourcesFilter,
  },
  {
    name: 'sections-filter',
    component: filterComponents.SectionsFilter,
  },
];

class SearchResultsFilters extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    onSortByChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    filtersValues: PropTypes.objectOf(PropTypes.object).isRequired,
  };

  state = { isShowFilters: false };

  showFilters = () => this.setState({ isShowFilters: !this.state.isShowFilters });

  onSelectionChange = (section) => {
    const sValue = `filters.sections-filter.${section}`;
    this.props.setFilterValue(this.props.namespace, 'sources-filter', sValue);
    this.setState({ sValue: `filters.sections-filter.${section}` });
  };

  renderTabs = () => {

    const { t, filtersValues, sortBy, onSortByChange, onHydrated, onChange } = this.props;
    const options                                                            = ['relevance', 'newertoolder', 'oldertonewer'].map(o => ({
      text: t(`search.sorts.${o}`),
      value: o,
    }));

    const sortingDisabled =
            (filtersValues.values || []).some(f =>
              f.name === 'sections-filter' &&
              f.values &&
              f.values.includes('filters.sections-filter.sources'));

    const filters = (
      <span key="span" style={{ padding: '10px' }}>
            {t('search.sortby')}:
        &nbsp;&nbsp;
        <Dropdown
          inline
          disabled={sortingDisabled}
          key="dropdown"
          options={options}
          value={sortBy}
          onChange={onSortByChange} />
          </span>
    );

    const tabs = ['lessons', 'programs', 'sources', 'events', 'publications'].map(x =>
      <Menu.Item
        name={x}
        textAlign="center"
        onClick={() => this.onSelectionChange(x)} />
    );

    const rightButtons = (
      <Menu.Menu position='right'>
        <Menu.Item>
          <Button basic compact onClick={this.showFilters}>
            <Icon name="filter" />
            {t('search.Filters')}
          </Button>
        </Menu.Item>
        <Menu.Item>{filters}</Menu.Item>
      </Menu.Menu>
    );
    return (<Menu>{tabs}{rightButtons}</Menu>);
  };

  render() {
    const { t, filtersValues, sortBy, onSortByChange, onHydrated, onChange } = this.props;

    return (
      <div>
        {this.renderTabs()}
        {
          this.state.isShowFilters ?
            <Filters
              namespace="search"
              filters={filters}
              onChange={onChange}
              onHydrated={onHydrated}
            /> : null
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    filtersValues: filterSelectors.getNSFilters(state.filters, 'search') || {},
  }),
  disptach => bindActionCreators({ setFilterValue: actions.setFilterValue, }, disptach)
)(translate()(SearchResultsFilters));
