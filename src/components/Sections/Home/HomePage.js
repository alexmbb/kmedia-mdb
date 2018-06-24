import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Card, Container, Grid } from 'semantic-ui-react';

import { canonicalLink } from '../../../helpers/links';
import { strCmp } from '../../../helpers/utils';
import { sectionLogo } from '../../../helpers/images';
import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import SearchBar from './SearchBar';
import Promoted from './Promoted';
import Topic from './Topic';
import Section from './Section';
import LatestUpdate from './LatestUpdate';
import LatestDailyLesson from './LatestDailyLesson';
import Helmets from '../../shared/Helmets';

class HomePage extends Component {
  static propTypes = {
    location: shapes.HistoryLocation.isRequired,
    latestLesson: shapes.LessonCollection,
    latestUnits: PropTypes.arrayOf(shapes.ContentUnit),
    banner: shapes.Banner,
    wip: shapes.WIP,
    err: shapes.Error,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    latestLesson: null,
    latestUnits: [],
    banner: null,
    wip: false,
    err: null,
  };

  render() {
    const { latestLesson, latestUnits, banner, wip, err, t, location } = this.props;

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    if (!latestLesson) {
      return null;
    }

    // map units to sections
    const cuBySection = latestUnits.reduce((acc, val) => {
      const s = canonicalLink(val).split('/');
      if (s.length < 3) {
        return acc;
      }

      const section = s[1];
      const v       = acc[section];
      if (v) {
        if (v.film_date < val.film_date) {
          acc[section] = val;
        }
      } else {
        acc[section] = val;
      }

      return acc;
    }, {});

    // sort sections based on their units
    // we only have 4 slots and > 4 sections ...
    const sortedCUs = Object.entries(cuBySection).sort((a, b) => strCmp(b[1].film_date, a[1].film_date));

    return (
      <div className="homepage">
        <Helmets.Basic title={t('home.header.text')} description={t('nav.top.header')} />
        
        <div className="homepage__header homepage__section">
          <Container className="padded horizontally">
            <SearchBar t={t} location={location} />
          </Container>
        </div>

        <div className="homepage__featured homepage__section">
          <Container className="padded horizontally">
            <Grid centered>
              <Grid.Row>
                <Grid.Column computer={6} tablet={7} mobile={16}>
                  <LatestDailyLesson collection={latestLesson} t={t} />
                </Grid.Column>
                <Grid.Column computer={6} tablet={7} mobile={16}>
                  <Promoted banner={banner} t={t} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </div>

        <div className="homepage__website-sections homepage__section">
          <Container className="padded horizontally">
            <Section title={t('home.sections')}>
              <Grid width={15} centered className="homepage__iconsrow">
                <Grid.Row>
                  {
                    ['lessons', 'programs', 'sources', 'events', 'publications'].map(x =>
                      (
                        <Grid.Column mobile={5} tablet={3} computer={3} key={x} textAlign="center">
                          <Topic title={t(`nav.sidebar.${x}`)} img={sectionLogo[x]} href={`/${x}`} />
                        </Grid.Column>
                      )
                    )
                  }
                  <Grid.Column mobile={5} tablet={3} computer={3} only="mobile" />
                </Grid.Row>
              </Grid>
            </Section>
          </Container>
        </div>

        <div className="homepage__thumbnails homepage__section">
          <Container className="padded horizontally">
            <Section title={t('home.updates')}>
              <Card.Group itemsPerRow={4} doubling>
                {
                  sortedCUs.slice(0, 4).map((x) => {
                    const [section, unit] = x;
                    return <LatestUpdate key={section} unit={unit} label={t(`nav.sidebar.${section}`)} t={t} />;
                  })
                }
              </Card.Group>
            </Section>
          </Container>
        </div>
      </div>
    );
  }
}

export default translate()(HomePage);
