import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { assetUrl } from '../../../helpers/Api';
import { isEmpty } from '../../../helpers/utils';
import { actions, selectors } from '../../../redux/modules/assets';
import * as shapes from '../../shapes';
import Library from './Library';
import PDF from '../../shared/PDF/PDF';

class LibraryContentContainer extends Component {
  static propTypes = {
    source: PropTypes.string,
    index: shapes.DataWipErr,
    content: shapes.DataWipErr.isRequired,
    t: PropTypes.func.isRequired,
    fetchAsset: PropTypes.func.isRequired,
    languageUI: PropTypes.string.isRequired,
    langSelectorMount: PropTypes.object,
  };

  static defaultProps = {
    source: null,
    index: {},
    langSelectorMount: null,
  };

  state = {
    languages: [],
    language: null,
  };

  componentDidMount() {
    this.myReplaceState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.index === this.props.index) {
      if (nextProps.languageUI !== this.props.languageUI) {
        // UI language changed
        const { language, languages } = this.state;
        if (nextProps.languageUI !== language) {
          // New UI language is not the currently displayed version
          if ((languages || []).indexOf(nextProps.languageUI) === -1) {
            // we don't have data for new UI language. Let's stay as we are.
            // TODO: use language fallback if we have them
          } else {
            // we have data for new UI language. Let's switch.
            const { index: { data }, source, languageUI } = nextProps;
            this.setState({ language: languageUI });
            this.fetchContent(source, data[languageUI]);
          }
        }
      }
    } else {
      this.myReplaceState(nextProps);
    }
  }

  getFullUrl = (pdf, data, language) => {
    if (pdf) {
      return assetUrl(`sources/${pdf}`);
    }

    if (isEmpty(data) || isEmpty(data[language])) {
      return null;
    }

    return assetUrl(`sources/${this.props.source}/${data[language].docx}`);
  };

  getLanguages = (data, preferred) => {
    if (!data) {
      return { languages: [], language: null };
    }

    let language    = null;
    const languages = Array.from(Object.keys(data));
    if (languages.length > 0) {
      language = languages.indexOf(preferred) === -1 ? languages[0] : preferred;
    }

    return { languages, language };
  };

  getTaasPdf = () => {
    const { index, source, } = this.props;
    const { language }       = this.state;

    const isTaas     = PDF.isTaas(source);
    const startsFrom = PDF.startsFrom(source);
    let pdfFile;

    if (isTaas && index && index.data) {
      const data = index.data[language];
      if (data && data.pdf) {
        pdfFile = `${source}/${data.pdf}`;
      }
    }

    return { isTaas, startsFrom, pdfFile };
  };

  handleLanguageChanged = (e, language) => {
    const { index: { data }, source } = this.props;
    this.setState({ language });
    this.fetchContent(source, data[language]);
  };

  fetchContent = (source, data) => {
    // In case of TAS we prefer PDF, otherwise HTML
    if (data.pdf && PDF.isTaas(source)) {
      // pdf.js fetch it on his own (smarter than us), we fetch it for nothing.
      return;
    }

    this.props.fetchAsset(`sources/${source}/${data.html}`);
  };

  myReplaceState = (nextProps) => {
    const data                    = nextProps.index && nextProps.index.data;
    const { languageUI }          = nextProps;
    const { languages, language } = this.getLanguages(data, languageUI);

    this.setState({ languages, language });

    if (language) {
      const { source } = nextProps;

      if (!isEmpty(source)) {
        this.fetchContent(source, data[language]);
      }
    }
  };

  render() {
    const { content, index, t, langSelectorMount } = this.props;
    const { languages, language }                  = this.state;
    const { isTaas, startsFrom, pdfFile }          = this.getTaasPdf();

    return (
      <Library
        isTaas={isTaas}
        pdfFile={pdfFile}
        fullUrlPath={this.getFullUrl(pdfFile, index.data, language)}
        startsFrom={startsFrom}
        content={index && index.data ? content : {}}
        language={language}
        languages={languages}
        t={t}
        handleLanguageChanged={this.handleLanguageChanged}
        langSelectorMount={langSelectorMount}
      />
    );
  }
}

export default connect(
  state => ({
    content: selectors.getAsset(state.assets),
  }),
  dispatch => bindActionCreators({
    fetchAsset: actions.fetchAsset,
  }, dispatch)
)(LibraryContentContainer);
