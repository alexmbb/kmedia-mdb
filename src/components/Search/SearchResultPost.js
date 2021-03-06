import React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

import { CT_BLOG_POST } from '../../helpers/consts';
import { canonicalLink } from '../../helpers/links';
import Link from '../Language/MultiLanguageLink';
import SearchResultBase from './SearchResultBase';

class SearchResultPost extends SearchResultBase {
  render() {
    const { queryResult, hit, rank, filters, post, t } = this.props;

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

    const createdDate = post.created_at ? t('values.date', { date: post.created_at }) : '';

    return (
      <Segment className="bg_hover_grey search__block">
        <Header as="h3">
          <Link
            className="search__link content"
            onClick={() => this.logClick(mdbUid, index, resultType, rank, searchId)}
            to={canonicalLink({ id: mdbUid, content_type: 'POST' }, this.getMediaLanguage(filters))}
          >
            {this.titleFromHighlight(highlight, title)}
          </Link>
        </Header>

        <Container>
          {this.iconByContentType(resultType === 'posts' ? CT_BLOG_POST : resultType, true, t)}
          |
          {' '}
          <strong>{createdDate}</strong>
        </Container>
        <Container className="content">{this.snippetFromHighlight(highlight)}</Container>

        {this.renderDebug(title)}
      </Segment>
    );
  }
}

export default SearchResultPost;
