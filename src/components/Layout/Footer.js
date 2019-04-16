import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { Container, Grid, Header, Button } from 'semantic-ui-react';
import { getRSSLinkByLang } from '../../helpers/utils';
import { selectors as settings } from '../../redux/modules/settings';

const Footer = ({ t, language }) => {
  const year = new Date().getFullYear();

  return (
    <div className="layout__footer">
      <Container>
        <Grid padded inverted>
          <Grid.Row>
            <Grid.Column>
              <Header inverted as="h5" floated="left">
                {t('nav.top.header')}
                <br />
                <small className="text grey">
                  {t('nav.footer.copyright', { year })}
                  {' '}
                  {t('nav.footer.rights')}
                </small>
              </Header>
              <Button
                icon="rss square"
                floated="right"
                color="orange"
                href={getRSSLinkByLang(language)} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  );
};

Footer.propTypes = {
  t: PropTypes.func.isRequired,
};

export default connect(state => ({
  language: settings.getLanguage(state.settings)
}))(withNamespaces()(Footer));

