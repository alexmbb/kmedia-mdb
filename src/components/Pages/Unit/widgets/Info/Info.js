import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, List } from 'semantic-ui-react';

import {
  // CT_CHILDREN_LESSON,
  CT_DAILY_LESSON,
  CT_LECTURE,
  CT_LESSON_PART,
  CT_SPECIAL_LESSON,
  CT_VIRTUAL_LESSON,
  CT_WOMEN_LESSON
} from '../../../../../helpers/consts';
import { canonicalLink } from '../../../../../helpers/links';
import { intersperse, tracePath } from '../../../../../helpers/utils';
import { stringify as urlSearchStringify } from '../../../../../helpers/url';
import { selectors as sourcesSelectors } from '../../../../../redux/modules/sources';
import { selectors as tagsSelectors } from '../../../../../redux/modules/tags';
import { filtersTransformer } from '../../../../../filters/index';
import * as shapes from '../../../../shapes';
import Link from '../../../../Language/MultiLanguageLink';

class Info extends Component {
  static propTypes = {
    unit: shapes.ContentUnit,
    section: PropTypes.string,
    getSourceById: PropTypes.func.isRequired,
    getTagById: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    unit: undefined,
    section: '',
  };

  render() {
    const { unit = {}, section, getSourceById, getTagById, t }                        = this.props;
    const { name, film_date: filmDate, sources, tags, collections, content_type: ct } = unit;

    // take lessons section tabs into consideration
    let filteredListPath = section;
    if (filteredListPath === 'lessons') {
      switch (ct) {
      case CT_LESSON_PART:
        if (filmDate && filmDate > '1980-01-01') {
          filteredListPath += '/daily';
        } else {
          // dirty hack to determine if rabash lesson
          // a better way would use MDB data (require backend api support)
          filteredListPath += '/rabash';
        }
        break;
      case CT_VIRTUAL_LESSON:
        filteredListPath += '/virtual';
        break;
      case CT_LECTURE:
        filteredListPath += '/lectures';
        break;
      case CT_WOMEN_LESSON:
        filteredListPath += '/women';
        break;
        // case CT_CHILDREN_LESSON:
        //   filteredListPath += '/children';
        //   break;
      default:
        break;
      }
    }

    const tagLinks = Array.from(intersperse(
      (tags || []).map((x) => {
        const tag = getTagById(x);
        if (!tag) {
          return '';
        }

        const path    = tracePath(tag, getTagById);
        const display = path[path.length - 1].label;

        if (filteredListPath) {
          const query = filtersTransformer.toQueryParams([
            { name: 'topics-filter', values: [path.map(y => y.id)] }
          ]);

          return (
            <Link
              key={x}
              to={{
                pathname: `/${filteredListPath}`,
                search: urlSearchStringify(query)
              }}
            >
              {display}
            </Link>
          );
        }

        return <span key={x}>{display}</span>;
      }), ', '));

    const sourcesLinks = Array.from(intersperse(
      (sources || []).map((x) => {
        const source = getSourceById(x);
        if (!source) {
          return '';
        }

        const path    = tracePath(source, getSourceById);
        const display = path.map(y => y.name).join(' > ');

        if (filteredListPath) {
          const query = filtersTransformer.toQueryParams([
            { name: 'sources-filter', values: [path.map(y => y.id)] }
          ]);

          return (
            <Link
              key={x}
              to={{
                pathname: `/${filteredListPath}`,
                search: urlSearchStringify(query)
              }}
            >
              {display}
            </Link>
          );
        }

        return <span key={x}>{display}</span>;
      }), ', '));

    const collectionsLinks = Array.from(intersperse(
      (Object.values(collections || {}) || []).map((x) => {
        let display;
        switch (x.content_type) {
        case CT_DAILY_LESSON:
        case CT_SPECIAL_LESSON: {
          const ctLabel = t(`constants.content-types.${CT_DAILY_LESSON}`);
          const fd = t('values.date', { date: x.film_date });
          display  = `${ctLabel} ${fd}`;
          break;
        }
        default:
          display = x.name;
          break;
        }

        return <Link key={x.id} to={canonicalLink(x)}>{display}</Link>;
      }), ', '));

    return (
      <div className="unit-info">
        <Header as="h1">
          <small className="text grey unit-info__film-date">
            {t('values.date', { date: filmDate })}
          </small>
          <br />
          <span className="unit-info__name">{name}</span>
        </Header>
        <List>
          {
            tagLinks.length === 0 ?
              null :
              <List.Item className="unit-info__topics">
                <strong>{t('pages.unit.info.topics')}:</strong>
                &nbsp;{tagLinks}
              </List.Item>
          }
          {
            sourcesLinks.length === 0 ?
              null :
              <List.Item className="unit-info__sources">
                <strong>{t('pages.unit.info.sources')}:</strong>
                &nbsp;{sourcesLinks}
              </List.Item>
          }
          {
            collectionsLinks.length === 0 ?
              null :
              <List.Item className="unit-info__collections">
                <strong>{t('pages.unit.info.collections')}:</strong>
                &nbsp;{collectionsLinks}
              </List.Item>
          }
        </List>
      </div>
    );
  }
}

export default connect(
  state => ({
    getSourceById: sourcesSelectors.getSourceById(state.sources),
    getTagById: tagsSelectors.getTagById(state.tags),
  })
)(Info);
