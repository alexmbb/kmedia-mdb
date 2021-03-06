import React from 'react';
import { connect } from 'react-redux';
import { Container, Header, Image, Segment } from 'semantic-ui-react';

import { canonicalLink } from '../../helpers/links';
import { SectionLogo } from '../../helpers/images';
import { selectors as sourcesSelectors } from '../../redux/modules/sources';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';

class SearchResultSource extends SearchResultBase {
  render() {
    const { t, queryResult, hit, filters, rank } = this.props;
    const { search_result: { searchId } } = queryResult;

    const
      {
        _index: index,
        _source: {
          mdb_uid: mdbUid,
          result_type: resultType,
          title
        },
        highlight
      } = hit;

    const name = this.titleFromHighlight(highlight, title);

    return (
      <Segment verticalalign="top" className="bg_hover_grey search__block">
        <Header as="h3">
          <Link
            className="search__link"
            onClick={() => this.logClick(mdbUid, index, resultType, rank, searchId)}
            to={canonicalLink({ id: mdbUid, content_type: 'SOURCE' })}
            language={this.getMediaLanguage(filters)}
          >
            {name}
          </Link>
        </Header>
        <Container>
          <Image size="mini" verticalAlign="middle">
            <SectionLogo name='sources' height='50' width='50' />
          </Image>

          &nbsp;&nbsp;
          <span>{t('filters.sections-filter.sources')}</span>
        </Container>
        <Container className="content">
          {this.snippetFromHighlight(highlight)}
        </Container>
        {this.renderDebug(title)}
      </Segment>
    );
  }
}

export default connect(state => ({
  getSourcePath: sourcesSelectors.getPathByID(state.sources),
}))(SearchResultSource);
