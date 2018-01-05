import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uniq from 'lodash/uniq';
import { Container, Divider, Segment } from 'semantic-ui-react';

import { RTL_LANGUAGES } from '../../../../helpers/consts';
import { formatError } from '../../../../helpers/utils';
import * as shapes from '../../../shapes';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../../shared/Splash';
import ButtonsLanguageSelector from '../../../Language/Selector/ButtonsLanguageSelector';

class Transcription extends Component {

  static propTypes = {
    unit: shapes.ContentUnit,
    doc2htmlById: PropTypes.objectOf(PropTypes.shape({
      data: PropTypes.string,     // actual content (HTML)
      wip: shapes.WIP,
      err: shapes.Error,
    })).isRequired,
    language: PropTypes.string.isRequired, // UI language
    t: PropTypes.func.isRequired,
    onContentChange: PropTypes.func.isRequired,
  };

  state = {
    selected: null,
    languages: [],
    language: null,
  };

  componentDidMount() {
    this.setCurrentItem(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.unit && !this.props.unit) ||
      (nextProps.unit.id !== this.props.unit.id) ||
      (nextProps.unit.files !== this.props.unit.files)
    ) {
      this.setCurrentItem(nextProps);
    }
  }

  getTextFiles = (props) => {
    const { unit } = props;
    if (!unit || !Array.isArray(unit.files)) {
      return [];
    }

    return unit.files.filter(x => x.type === 'text');
  };

  setCurrentItem = (nextProps) => {
    const textFiles = this.getTextFiles(nextProps);
    const languages = uniq(textFiles.map(x => x.language));
    let selected    = null;
    if (languages.length > 0) {

      // try to stay on the same language we have in state if possible
      if (this.state.language) {
        selected = textFiles.find(x => x.language === this.state.language);
      }

      // if not then choose by UI language or first
      if (!selected) {
        selected = textFiles.find(x => x.language === nextProps.language) || textFiles[0];
      }
    }

    const language = selected ? selected.language : null;

    this.setState({ selected, languages, language });

    if (selected && language) {
      this.props.onContentChange(selected.id);
    }
  };

  handleLanguageChanged = (e, language) => {
    if (language === this.state.language) {
      e.preventDefault();
      return;
    }

    const textFiles = this.getTextFiles(this.props);
    const selected  = textFiles.find(x => x.language === language);

    this.props.onContentChange(selected.id);
    this.setState({ selected, language });
  };

  render() {
    const { doc2htmlById, t }               = this.props;
    const { selected, languages, language } = this.state;

    if (!selected) {
      return <Segment basic>{t('materials.transcription.no-transcription')}</Segment>;
    }

    const { data, wip, err } = doc2htmlById[selected.id] || {};

    if (err) {
      if (err.response && err.response.status === 404) {
        return <FrownSplash text={t('messages.source-content-not-found')} />;
      } else {
        return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
      }
    }

    if (wip) {
      return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
    }

    if (data) {
      const direction = RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';

      // eslint-disable-next-line react/no-danger
      const content = <div
        className="doc2html"
        style={{ direction }}
        dangerouslySetInnerHTML={{ __html: data }}
      />;

      if (languages.length === 1) {
        return content;
      }

      return (
        <div>
          <Container fluid textAlign="center">
            <ButtonsLanguageSelector
              languages={languages}
              defaultValue={language}
              t={t}
              onSelect={this.handleLanguageChanged}
            />
          </Container>
          <Divider hidden />
          {content}
        </div>
      );
    }

    return null;
  }
}

export default Transcription;
