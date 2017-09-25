import React from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Grid } from 'semantic-ui-react';

import Link from '../../Language/MultiLanguageLink';

import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import RMPVideoBox from '../../shared/UnitPlayer/RMPVideoBox';
import Materials from '../../shared/UnitMaterials/Materials';
import MediaDownloads from '../../shared/MediaDownloads';
import * as shapes from '../../shapes';
import Info from './Info';

const ProgramChapter = (props) => {
  const { chapter, wip, err, language, t } = props;

  if (err) {
    return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
  }

  if (wip) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  }

  if (chapter) {
    return (
      <Grid.Column width={16}>
        <Grid>
          <RMPVideoBox unit={chapter} language={language} t={t} />
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <Info chapter={chapter} t={t} />
              <Materials unit={chapter} t={t} />
            </Grid.Column>
            <Grid.Column width={6}>
              <MediaDownloads unit={chapter} language={language} t={t} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    );
  }

  return (
    <FrownSplash
      text={t('messages.program-not-found')}
      subtext={
        <Trans i18nKey="messages.program-not-found-subtext">
          Try the <Link to="/programs">programs list</Link>...
        </Trans>
      }
    />
  );
};

ProgramChapter.propTypes = {
  chapter: shapes.ProgramChapter,
  language: PropTypes.string.isRequired,
  wip: shapes.WIP,
  err: shapes.Error,
  t: PropTypes.func.isRequired,
};

ProgramChapter.defaultProps = {
  chapter: null,
  wip: false,
  err: null,
};

export default translate()(ProgramChapter);
