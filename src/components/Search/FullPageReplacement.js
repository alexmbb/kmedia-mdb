import React from 'react';
import PropTypes from 'prop-types';
import {withNamespaces} from 'react-i18next';
import {Container} from 'semantic-ui-react';

const FullPageReplacement = ({source_term, term, t}) => {
  if (!source_term || !term) {
    return null;
  }

  return (
    <Container className="search__didyoumean">
      <div>
        {t('search.showingFPR ')}
        <a href={`?q=${term}`} className="search__link">{term}</a>
      </div>
      <small>
        {t('search.searchInsteadFPR')}
        <a href={`?q=${source_term}&checkTypo=false`} className="search__link">{source_term}</a>
      </small>
    </Container>
  );
};

FullPageReplacement.propTypes = {
  source_term: PropTypes.string.isRequired,
  term: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(FullPageReplacement);
