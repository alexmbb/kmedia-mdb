import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { Container } from 'semantic-ui-react';

const DidYouMean = ({suggestion, t}) => {
  if (!suggestion){
    return null;
  }

  const didYouMeanStr = t('search.didYouMean');
  const { origin, pathname } = window.location;

  const to = `${origin}${pathname}?q=${suggestion}`;  

  return (
    <Container className="search__didyoumean">
      {didYouMeanStr}
      <a href={to} className="search__link">{suggestion}</a>
    </Container>
  );
};

DidYouMean.propTypes = {
  suggestion: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};

export default withNamespaces()(DidYouMean);