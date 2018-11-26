import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { Container, Icon, Label, Menu, Popup } from 'semantic-ui-react';

import { getLanguageDirection } from '../../helpers/i18n-utils';
import { filtersTransformer } from '../../filters/index';
import { actions, selectors } from '../../redux/modules/filters';
import { selectors as mdb } from '../../redux/modules/mdb';
import { selectors as settings } from '../../redux/modules/settings';
import { selectors as device } from '../../redux/modules/device';
import * as shapes from '../shapes';
import FiltersHydrator from './FiltersHydrator';

class Filters extends Component {
  static propTypes = {
    namespace: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(shapes.filterPropShape).isRequired,
    rightItems: PropTypes.arrayOf(PropTypes.node),
    onChange: PropTypes.func.isRequired,
    onHydrated: PropTypes.func.isRequired,
    setFilterValue: PropTypes.func.isRequired,
    resetFilter: PropTypes.func.isRequired,
    filtersData: PropTypes.objectOf(PropTypes.object).isRequired,
    language: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    deviceInfo: shapes.UserAgentParserResults.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  static defaultProps = {
    rightItems: null,
  };

  state = {
    activeFilter: null,
  };

  handlePopupClose = () => {
    this.setState({ activeFilter: null });
    document.getElementsByTagName('body')[0].classList.remove('noscroll--smallmobile');
  };

  handlePopupOpen = (activeFilter) => {
    this.setState({ activeFilter });
    document.getElementsByTagName('body')[0].classList.add('noscroll--smallmobile');
  };

  handleApply = (name, value) => {
    this.handlePopupClose();
    this.props.setFilterValue(this.props.namespace, name, value);
    this.props.onChange();
  };

  handleResetFilter = (e, name) => {
    e.stopPropagation();
    this.props.resetFilter(this.props.namespace, name);
    this.props.onChange();
  };

  render() {
    const { filters, namespace, onHydrated, t, filtersData, rightItems, language, deviceInfo } = this.props;
    const { activeFilter }                                                                     = this.state;
    const { store }                                                                            = this.context;

    const langDir = getLanguageDirection(language);

    let popupStyle = {
      // padding: 0,
      direction: langDir,
    };
    if (deviceInfo.device && deviceInfo.device.type === 'mobile') {
      popupStyle = {
        ...popupStyle,
        // top: 0,
        // left: 0,
        // bottom: 0,
        // right: 0,
      };
    }

    return (
      <div className="filters">
        <FiltersHydrator namespace={namespace} onHydrated={onHydrated} />
        {/* <Menu secondary pointing stackable className="index-filters" size="large"> */}
        <Container className="padded">
          <Menu className="filters__menu" stackable>
            <Menu.Item
              header
              className="filters__header"
              content={t('filters.by')}
            />
            {
              filters.map((item) => {
                const { component: FilterComponent, name } = item;

                const isActive = name === activeFilter;
                const data     = filtersData[name] || {};
                const values   = data.values || [];
                const value    = Array.isArray(values) && values.length > 0 ? values[0] : null;
                const label    = value ?
                  filtersTransformer.valueToTagLabel(name, value, this.props, store, t) :
                  t('filters.all');

                const len = ((name === 'topics-filter' || name === 'sources-filter') && value) ? label.length : 0;

                return (
                  <Popup
                    className="filter-popup"
                    basic
                    flowing
                    key={name}
                    trigger={
                      <Menu.Item
                        style={{ flexShrink: len }}
                        className={classNames(`filter filter--${name}`,
                          { 'filter--is-empty': !value },
                          { 'filter--is-active': isActive })}
                        name={name}
                      >
                        <div className="filter__wrapper">
                          <small className="blue text filter__title">
                            {t(`filters.${name}.label`)}
                          </small>
                          <span className="filter__state">

                            <span className="filter__text" dangerouslySetInnerHTML={{ __html: label }} />
                            {
                              isActive ?
                                <Icon className="filter__fold-icon" name="dropdown" flipped="vertically" /> :
                                <Icon className="filter__fold-icon" name="dropdown" />
                            }
                          </span>
                        </div>

                        {
                          value ?
                            <div className="filter__clear">
                              <Label
                                basic
                                circular
                                size="tiny"
                                onClick={e => this.handleResetFilter(e, name)}
                              >
                                <Icon name="times" />
                              </Label>
                            </div>
                            :
                            null
                        }
                      </Menu.Item>
                    }
                    on="click"
                    position={`bottom ${langDir === 'ltr' ? 'left' : 'right'}`}
                    // verticalOffset={-12}
                    open={isActive}
                    onClose={this.handlePopupClose}
                    onOpen={() => this.handlePopupOpen(name)}
                    style={popupStyle}
                  >
                    <Popup.Content className={`filter-popup__content ${langDir}`}>
                      <FilterComponent
                        namespace={namespace}
                        value={value}
                        onCancel={this.handlePopupClose}
                        onApply={x => this.handleApply(name, x)}
                        language={language}
                        deviceInfo={deviceInfo}
                      />
                    </Popup.Content>
                  </Popup>
                );
              })
            }
            {
              rightItems
                ? <Menu.Menu position="right">{rightItems}</Menu.Menu>
                : null
            }
          </Menu>
        </Container>
      </div>
    );
  }
}

export default connect(
  (state, ownProps) => ({
    filtersData: selectors.getNSFilters(state.filters, ownProps.namespace),
    language: settings.getLanguage(state.settings),
    deviceInfo: device.getDeviceInfo(state.device),

    // DO NOT REMOVE, this triggers a necessary re-render for filter tags
    sqDataWipErr: mdb.getSQDataWipErr(state.mdb),
  }),
  dispatch => bindActionCreators({
    setFilterValue: actions.setFilterValue,
    resetFilter: actions.resetFilter,
  }, dispatch)
)(withNamespaces()(Filters));
