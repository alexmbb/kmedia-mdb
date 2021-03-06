import React from 'react';

import * as shapes from '../../shapes';
import Basic from './Basic';
import Article from './Article';

const ArticleUnit = ({ unit = undefined }) => {
  if (!unit) {
    return null;
  }

  return (
    <div>
      <Basic title={unit.name} description={unit.description} />
      <Article publishedTime={unit.film_date} />
    </div>
  );
};

ArticleUnit.propTypes = {
  unit: shapes.Article,
};

export default ArticleUnit;
