import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

import Link from '../Language/MultiLanguageLink';
import { landingPageSectionLink } from '../../helpers/links';

import SearchResultBase from './SearchResultBase';

import {
  SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_TEXT,
  SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_SUBTEXT,
} from '../../helpers/consts'
import { DeviceInfoContext } from "../../helpers/app-contexts";

class SearchResultLandingPage extends SearchResultBase {
  static contextType = DeviceInfoContext;
  static propTypes = {
    ...SearchResultBase.propTypes,
  };

  render() {
    const { hit, queryResult, rank, t }   = this.props;
    const { search_result: { searchId } } = queryResult;
    const { isMobileDevice }              = this.context;
    const {
      _index: index,
      _type: resultType,
      _source: {
        landing_page: landingPage,
        filter_values: filterValues,
      }
    } = hit;
    const valuesTitleSuffix = (filterValues && filterValues.filter((filterValue) => filterValue.name !== 'text').map((filterValue) => filterValue.origin || filterValue.value).join(' ')) || ''; 
    const linkTitle = SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_TEXT[landingPage] || 'home.sections';
    const subText = SEARCH_GRAMMAR_LANDING_PAGES_SECTIONS_SUBTEXT[landingPage];

    return (
      <Segment className="search__block">
        <Segment.Group horizontal={!isMobileDevice} className="no-padding no-margin-top no-border no-shadow">
          <Segment className="no-padding  no-border">
            <Header as="h3" color="blue">
              <Link
                className="search__link"
                onClick={() => this.logClick(landingPage, index, resultType, rank, searchId)}
                to={landingPageSectionLink(landingPage, filterValues)}
              >
                {t(linkTitle)} {valuesTitleSuffix}
              </Link>
            </Header>
            {!!subText && <Container className="content">
              {t(subText)}
            </Container>}
          </Segment>
        </Segment.Group>

        {this.renderDebug('')}
      </Segment>
    );
  }
}

export default SearchResultLandingPage;
