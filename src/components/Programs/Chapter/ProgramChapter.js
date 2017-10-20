import React from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Container, Grid } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import * as shapes from '../../shapes';
import RMPVideoBox from '../../shared/UnitPlayer/RMPVideoBox';
import Materials from '../../shared/UnitMaterials/Materials';
import MediaDownloads from '../../shared/MediaDownloads';
import Link from '../../Language/MultiLanguageLink';
import Info from './Info';
import RelevantPartsContainer from './RelevantParts/RelevantPartsContainer';

const ProgramChapter = (props) => {
  const { chapter, wip, err, language, t } = props;

  if (err) {
    if (err.response && err.response.status === 404) {
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
    }

    return <ErrorSplash text={t('messages.server-error')} subtext={formatError(err)} />;
  }

  if (wip) {
    return <LoadingSplash text={t('messages.loading')} subtext={t('messages.loading-subtext')} />;
  }

  if (!chapter) {
    return null;
  }

  return (
    <div>
      <div className="avbox">
        <Container>
          <Grid centered padded>
            <RMPVideoBox unit={chapter} language={language} t={t} isSliceable />
          </Grid>
        </Container>
      </div>
      <Container>
        <Grid padded>
          <Grid.Row>
            <Grid.Column width={10}>
              <Info unit={chapter} t={t} />
              <Materials unit={chapter} t={t} />
            </Grid.Column>
            <Grid.Column width={6}>
              <MediaDownloads unit={chapter} language={language} t={t} />
              <RelevantPartsContainer unit={chapter} t={t} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
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
