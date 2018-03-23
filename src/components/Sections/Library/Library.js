import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Container, Segment, Portal } from 'semantic-ui-react';

import { RTL_LANGUAGES } from '../../../helpers/consts';
import { formatError, isEmpty, shallowCompare } from '../../../helpers/utils';
import { assetUrl } from '../../../helpers/Api';
import * as shapes from '../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash/Splash';
import AnchorsLanguageSelector from '../../Language/Selector/AnchorsLanguageSelector';
import PDF from '../../shared/PDF/PDF';
import { getQuery, updateQuery } from '../../../helpers/url';

class Library extends Component {
  static propTypes = {
    content: PropTypes.shape({
      data: PropTypes.string, // actual content (HTML)
      wip: shapes.WIP,
      err: shapes.Error,
    }),
    isTaas: PropTypes.bool.isRequired,
    pdfFile: PropTypes.string,
    startsFrom: PropTypes.number,
    language: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    langSelectorMount: PropTypes.any,
    t: PropTypes.func.isRequired,
    handleLanguageChanged: PropTypes.func.isRequired,
    history: shapes.History.isRequired,
  };

  static defaultProps = {
    language: null,
    languages: [],
    langSelectorMount: null,
    content: {
      data: null,
      wip: false,
      err: null,
    },
    pdfFile: null,
    startsFrom: 1,
  };

  state = {};

  componentWillMount() {
    const { history } = this.props;
    const query       = getQuery(history.location);
    const p           = query.page ? Number.parseInt(query.page, 10) : 1;
    const pageNumber  = Number.isNaN(p) || p <= 0 ? 1 : p;

    this.setState({ pageNumber });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  pageNumberHandler = (pageNumber) => {
    const { history } = this.props;
    this.setState({ pageNumber },
      updateQuery(history, query => ({
        ...query,
        page: pageNumber,
      }))
    );
  };

  render() {
    const { content, language, languages, t, isTaas, langSelectorMount } = this.props;

    if (isEmpty(content)) {
      return <Segment basic>&nbsp;</Segment>;
    }

    const { wip: contentWip, err: contentErr, data: contentData } = content;

    let contents;

    if (contentErr) {
      if (contentErr.response && contentErr.response.status === 404) {
        contents = (
          <FrownSplash
            text={t('messages.source-content-not-found')}
          />
        );
      } else {
        contents = <ErrorSplash text={t('messages.server-error')} subtext={formatError(contentErr)} />;
      }
    } else if (contentWip) {
      contents = <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    } else if (!contentData) {
      return <Segment basic>{t('sources-library.no-source')}</Segment>;
    } else if (isTaas && this.props.pdfFile) {
      contents = (<PDF
        pdfFile={assetUrl(`sources/${this.props.pdfFile}`)}
        pageNumber={this.state.pageNumber || 1}
        startsFrom={this.props.startsFrom}
        pageNumberHandler={this.pageNumberHandler}
      />);
    } else {
      const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
      contents        = (<div
        style={{ direction, textAlign: (direction === 'ltr' ? 'left' : 'right') }}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: contentData }}
      />);
    }

    let languageBar = null;
    if (languages.length > 0) {
      languageBar = (
        <Container fluid textAlign="right">
          <AnchorsLanguageSelector
            languages={languages}
            defaultValue={language}
            t={t}
            onSelect={this.props.handleLanguageChanged}
          />
        </Container>
      );
    }

    return (
      <div>
        {
          langSelectorMount && languageBar ?
            <Portal open preprend mountNode={langSelectorMount}>
              {languageBar}
            </Portal>
            :
            languageBar
        }
        {contents}
      </div>
    );
  }
}

export default withRouter(Library);
