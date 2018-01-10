import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Trans, translate } from 'react-i18next';
import { Container, Grid } from 'semantic-ui-react';

import { formatError } from '../../../helpers/utils';
import { ErrorSplash, FrownSplash, LoadingSplash } from '../../shared/Splash';
import Link from '../../Language/MultiLanguageLink';
import * as shapes from '../../shapes';
import FullVideoBox from '../../shared/UnitPlayer/FullVideoBox';
import Materials from '../../shared/UnitMaterials/Materials';
import MediaDownloads from '../../shared/MediaDownloads';
import Info from '../../pages/Unit/widgets/Info/Info';
// import Info from '../Part/Info';
import Playlist from './Playlist';

class FullLesson extends Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    fullLesson: shapes.LessonCollection,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    fullLesson: null,
    wip: false,
    err: null,
  };

  state = {
    activePart: 0,
  };

  handleActivePartChange = activePart =>
    this.setState({ activePart });

  render() {
    const { fullLesson, wip, err, language, t } = this.props;

    if (err) {
      if (err.response && err.response.status === 404) {
        return (
          <FrownSplash
            text={t('messages.lesson-not-found')}
            subtext={
              <Trans i18nKey="messages.lesson-not-found-subtext">
                Try the <Link to="/lessons">lessons list</Link>...
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

    if (!fullLesson) {
      return null;
    }

    const { activePart } = this.state;
    const lesson         = fullLesson.content_units[activePart];
    return (
      <div>
        <div className="avbox">
          <Container>
            <Grid padded>
              <FullVideoBox
                collection={fullLesson}
                activePart={activePart}
                language={language}
                t={t}
                onActivePartChange={this.handleActivePartChange}
                PlayListComponent={Playlist}
              />
            </Grid>
          </Container>
        </div>
        <Container>
          <Grid padded reversed="tablet">
            <Grid.Row reversed="computer">
              <Grid.Column computer={6} tablet={8} mobile={16}  className='content__aside'>
                <MediaDownloads unit={lesson} language={language} t={t} />
              </Grid.Column>
              <Grid.Column computer={10} tablet={8} mobile={16} className='content__main'>
                <Info unit={lesson} section="lessons" t={t} />
                <Materials unit={lesson} t={t} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default translate()(FullLesson);
