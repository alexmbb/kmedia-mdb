import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Container, Divider, Grid, Input } from 'semantic-ui-react';
import * as moment from 'moment/moment';

import * as shapes from '../../shapes';
import WipErr from '../../shared/WipErr/WipErr';
import SectionHeader from '../../shared/SectionHeader';
import { ALL_LANGUAGES, LANGUAGE_OPTIONS } from '../../../helpers/consts';
import { today } from '../../../helpers/date';
import SimpleModeList from './list';

class SimpleModeMobilePage extends PureComponent {
  static propTypes = {
    items: shapes.SimpleMode,
    selectedDate: PropTypes.objectOf(Date),
    wip: shapes.WIP,
    err: shapes.Error,
    uiLanguage: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    location: shapes.HistoryLocation.isRequired,
    renderUnit: PropTypes.func.isRequired,
    onDayClick: PropTypes.func.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
    deviceInfo: shapes.UserAgentParserResults.isRequired,
  };

  static defaultProps = {
    items: null,
    selectedDate: new Date(),
    wip: false,
    err: null,
  };

  componentWillReceiveProps(nextProps) {
    console.log('SimpleModeMobilePage.componentWillReceiveProps', nextProps);
  }

  getOptions(props) {
    const { languages, t } = props;

    return LANGUAGE_OPTIONS
      .filter(x => languages.includes(x.value))
      .map(x => ({ ...x, text: t(`constants.languages.${x.value}`) }));
  };

  changeDay(amount) {
    const newDate = moment(this.props.selectedDate).add(amount, 'd').toDate();
    this.props.onDayClick(newDate);
  }

  handleNativeDateInputRef = (ref) => {
    this.nativeDateInput = ref;
  };

  handleNativeDateInputChange = (event) => {
    if (!event) {
      return;
    }

    this.props.onDayClick(event.target.valueAsDate);
  };

  openNativeDatePicker = () => {
    if (this.props.deviceInfo.os.name === 'Android') {
      this.nativeDateInput.click();
      return;
    }

    this.nativeDateInput.focus();
  };

  render() {
    const
      { items, selectedDate, wip, err, language, t, renderUnit, onLanguageChange } = this.props;

    const selected               = selectedDate || today().toDate();
    const selectedToString       = moment(selected).format('YYYY-MM-DD');
    const localeDateFormat       = moment.localeData().longDateFormat('L');
    const selectedInLocaleFormat = moment(selected).format(localeDateFormat);

    const list = WipErr({ wip, err, t }) || (
      <div>
        {
          items ?
            <SimpleModeList items={items} language={language} t={t} renderUnit={renderUnit} /> :
            null
        }
      </div>
    );

    const languages = this.getOptions({ languages: ALL_LANGUAGES, t });

    return (
      <div>
        <SectionHeader section="simple-mode" />
        <Divider fitted />
        <Container className="padded">
          <Grid>
            <Grid.Row>
              <Grid.Column mobile={16}>
                <div className="summary-container">
                  <div className="controller">
                    <h4>{t('simple-mode.date')}</h4>
                    <div className="date-container">
                      <a onClick={() => this.changeDay(-1)}>{t('simple-mode.prev')}</a>
                      <div>
                        <div className="ui input">
                          <Input
                            icon="dropdown"
                            type="text"
                            readOnly
                            value={selectedInLocaleFormat}
                            onClick={this.openNativeDatePicker}
                          />
                        </div>
                        <input
                          className="hide-native-date-input"
                          type="date"
                          value={selectedToString}
                          max={today().format('YYYY-MM-DD')}
                          step="1"
                          pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                          onChange={this.handleNativeDateInputChange}
                          ref={this.handleNativeDateInputRef}
                        />
                      </div>
                      <a onClick={() => this.changeDay(1)}>{t('simple-mode.next')}</a>
                    </div>
                  </div>
                  <div className="controller">
                    <h4>{t('simple-mode.media-language')} </h4>
                    <div className="dropdown-container">
                      <select value={language} onChange={onLanguageChange}>
                        {
                          languages.map(x => (
                            <option key={`opt-${x.flag}`} value={x.value}>
                              {x.text}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                </div>
                {list}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default translate()(SimpleModeMobilePage);
