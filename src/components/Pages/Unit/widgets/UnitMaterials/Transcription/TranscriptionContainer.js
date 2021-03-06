import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../../../../../redux/modules/assets';
import { selectors as settings } from '../../../../../../redux/modules/settings';
import * as shapes from '../../../../../shapes';
import Transcription from './Transcription';

const TranscriptionContainer = (props) => {
  const { unit, type = null } = props;
  const doc2htmlById          = useSelector(state => selectors.getDoc2htmlById(state.assets));
  const language              = useSelector(state => settings.getLanguage(state.settings));
  const contentLanguage       = useSelector(state => settings.getContentLanguage(state.settings));
  const dispatch              = useDispatch();

  const handleContentChange = id => dispatch(actions.doc2html(id));

  return (
    <Transcription
      unit={unit}
      doc2htmlById={doc2htmlById}
      uiLanguage={language}
      contentLanguage={contentLanguage}
      type={type}
      onContentChange={handleContentChange}
    />
  );
};

TranscriptionContainer.propTypes = {
  unit: shapes.ContentUnit.isRequired,
  type: PropTypes.string,
};

export default TranscriptionContainer;
