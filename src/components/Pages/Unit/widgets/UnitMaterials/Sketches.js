import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import isEqual from 'react-fast-compare';
import ImageGallery from 'react-image-gallery';
import { Button, Container, Segment } from 'semantic-ui-react';

import { assetUrl, imaginaryUrl, Requests } from '../../../../../helpers/Api';
import { RTL_LANGUAGES } from '../../../../../helpers/consts';
import { selectSuitableLanguage } from '../../../../../helpers/language';
import { isEmpty, physicalFile, strCmp } from '../../../../../helpers/utils';
import { actions, selectors } from '../../../../../redux/modules/assets';
import { selectors as settings } from '../../../../../redux/modules/settings';
import * as shapes from '../../../../shapes';
import WipErr from '../../../../shared/WipErr/WipErr';
import ButtonsLanguageSelector from '../../../../Language/Selector/ButtonsLanguageSelector';

class Sketches extends React.Component {
  static propTypes = {
    unit: shapes.ContentUnit.isRequired,
    t: PropTypes.func.isRequired,
    zipIndexById: PropTypes.objectOf(shapes.DataWipErr).isRequired,
    unzip: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
    uiLanguage: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
    contentLanguage: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  };

  constructor(props) {
    super(props);
    const { unit, contentLanguage, uiLanguage } = props;

    const zipFiles = this.getUnitFiles(unit);
    this.state     = {
      zipFiles,
      zipFileId: null,
      imageFiles: null,
      languages: null,
      language: null,
    };

    if (zipFiles) {
      const { languages, language } = this.getLanguage(zipFiles, contentLanguage, uiLanguage);
      const files                   = this.filterFiles(zipFiles, language, unit.original_language);
      const itemState               = this.setCurrentItem(files);

      this.state = {
        ...this.state,
        languages,
        language,
        ...itemState,
      };
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.isPropsChanged(nextProps) || this.isStateChanged(nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    const { unit, contentLanguage, uiLanguage } = this.props;

    if (this.isPropsChanged(prevProps)) {
      // full reset
      const zipFiles = this.getUnitFiles(unit);
      if (zipFiles) {
        const { languages, language } = this.getLanguage(zipFiles, contentLanguage, uiLanguage);
        const files                   = this.filterFiles(zipFiles, language, unit.original_language);
        const itemState               = this.setCurrentItem(files);

        this.setState({
          languages,
          language,
          ...itemState,
        });
      }
    } else if (this.isStateChanged(prevState)) {
      const { zipFiles, language } = this.state; // eslint-disable-line react/prop-types

      if (prevState.language !== language) {
        if (zipFiles && Array.isArray(zipFiles)) {
          const files     = this.filterFiles(zipFiles, language, unit.original_language);
          const itemState = this.setCurrentItem(files);

          this.setState({
            language,
            ...itemState,
          });
        }
      }
    }
  }

  isPropsChanged = (prevProps) => {
    const { unit, zipIndexById, contentLanguage, uiLanguage } = this.props;

    return prevProps.contentLanguage !== contentLanguage
      || prevProps.uiLanguage !== uiLanguage
      || !isEqual(prevProps.zipIndexById, zipIndexById)
      || !isEqual(prevProps.unit, unit);
  };

  isStateChanged = (prevState) => {
    // eslint-disable-next-line react/prop-types
    const { zipFileId, language, imageFiles } = this.state;

    return prevState.zipFileId !== zipFileId
      || prevState.language !== language
      || prevState.imageFiles !== imageFiles;
  };

  // load data into state
  // get one zip file or array of image files or one image file
  setCurrentItem = (file) => {
    let state = {};
    if (file) {
      // not zip, image files only
      if (Array.isArray(file) || !file.name.endsWith('.zip')) {
        state = { imageFiles: file };
      } else {
        // zip file
        state = { zipFileId: file.id };

        // call redux
        this.unzipFiles(file);
      }
    } else {
      state = { zipFileId: null };
    }
    return state;
  };

  unzipFiles = (file) => {
    const { zipIndexById, unzip } = this.props;
    const { data, wip, err }      = zipIndexById[file.id] || {};

    if (!(wip || err) && isEmpty(data) && !Object.prototype.hasOwnProperty.call(zipIndexById, file.id)) {
      unzip(file.id);
    }
  };

  getUnitFiles = (unit) => {
    if (!Array.isArray(unit.files)) {
      return null;
    }

    // get the zip files
    const zipFiles = unit.files.filter(this.filterZipOrImageFiles);
    if (zipFiles.length === 0) {
      return null;
    }

    return zipFiles;
  };

  getLanguage = (zipFiles, contentLanguage, uiLanguage) => {
    const languages = zipFiles
      .map(file => file.language)
      .filter((v, i, a) => a.indexOf(v) === i);
    const language  = selectSuitableLanguage(contentLanguage, uiLanguage, languages);
    return { languages, language };
  };

  filterFiles = (zipFiles, language, originalLanguage) => {
    // try filter by language
    let files = zipFiles.filter(file => file.language === language);

    // if no files by language - return original language files
    if (files.length === 0) {
      files = zipFiles.filter(file => file.language === originalLanguage);
    }

    // if there are many zip files - use the first one
    if (files.length > 0) {
      const zipFileArr = files.filter(file => file.name.endsWith('.zip'));
      files            = zipFileArr.length > 0 ? zipFileArr[0] : files;
    }

    return files;
  };

  filterZipOrImageFiles = file => file.type === 'image';

  handleLanguageChanged = (e, language) => {
    this.setState({ language });
  };

  handleImageError = event => console.log('Image Gallery loading error ', event.target);

  // converts images from server format (path, size) to ImageGallery format
  imageGalleryItem = (item) => {
    let src;
    let alt;
    if (item.path) {
      // opened zip file
      src = assetUrl(item.path.substr(8));
      alt = item.path.substr(item.path.lastIndexOf('_') + 1);
    } else {
      // image file
      src = physicalFile(item);
      alt = item.name;
    }

    let thumbSrc = src;
    if (!thumbSrc.startsWith('http')) {
      thumbSrc = `http://localhost${src}`;
    }
    thumbSrc = `${imaginaryUrl('thumbnail')}?${Requests.makeParams({ url: thumbSrc, width: 100 })}`;

    return {
      original: src,
      thumbnail: thumbSrc,
      originalAlt: alt,
      thumbnailAlt: `${alt}-thumbnail`,
      thumbnailTitle: `${alt}`,
    };
  };

  renderLeftNav = (onClick, disabled) => (
    <Button
      color="black"
      size="tiny"
      className="image-gallery-left-nav"
      icon="chevron left"
      disabled={disabled}
      onClick={onClick}
    />
  );

  renderRightNav = (onClick, disabled) => (
    <Button
      color="black"
      size="tiny"
      className="image-gallery-right-nav"
      icon="chevron right"
      disabled={disabled}
      onClick={onClick}
    />
  );

  renderFullscreenButton = (onClick, isFullscreen) => (
    <Button
      color="black"
      size="tiny"
      className="image-gallery-fullscreen-button"
      icon={isFullscreen ? 'compress' : 'expand'}
      onClick={onClick}
    />
  );

  render() {
    const { t, zipIndexById }                            = this.props;
    const { zipFileId, languages, language, imageFiles } = this.state;
    const { wip, err, data }                             = zipIndexById[zipFileId] || {};

    const wipErr = WipErr({ wip, err, t });
    if (wipErr) {
      return wipErr;
    }

    const imageObjs = imageFiles || data;

    // if imageObjs is not an array - create it
    let imageObjsArr = [];
    if (imageObjs && !Array.isArray(imageObjs)) {
      imageObjsArr.push(imageObjs);
    } else {
      imageObjsArr = imageObjs;
    }

    const isRTL = RTL_LANGUAGES.includes(language);

    if (Array.isArray(imageObjsArr) && imageObjsArr.length > 0) {
      // prepare the image array for the gallery and sort it
      const items = imageObjsArr
        .map(this.imageGalleryItem)
        .sort((a, b) => strCmp(a.original, b.original));

      return (
        <div>
          {
            languages && languages.length > 1
              ? (
                <Container fluid textAlign="center">
                  <ButtonsLanguageSelector
                    languages={languages}
                    defaultValue={language}
                    onSelect={this.handleLanguageChanged}
                  />
                </Container>
              )
              : null
          }
          <ImageGallery
            lazyLoad
            showFullscreenButton
            isRTL={isRTL}
            items={items}
            thumbnailPosition="top"
            showPlayButton={false}
            showBullets={false}
            showIndex={items.length > 1}
            showThumbnails={items.length > 1}
            onImageError={this.handleImageError}
            renderLeftNav={this.renderLeftNav}
            renderRightNav={this.renderRightNav}
            renderFullscreenButton={this.renderFullscreenButton}
          />
        </div>
      );
    }

    return (
      <Segment basic>
        {t('messages.no-images')}
      </Segment>
    );
  }
}

const mapState = state => ({
  zipIndexById: selectors.getZipIndexById(state.assets),
  uiLanguage: settings.getLanguage(state.settings),
  contentLanguage: settings.getContentLanguage(state.settings),
});

const mapDispatch = dispatch => bindActionCreators({
  unzip: actions.unzip
}, dispatch);

export default connect(mapState, mapDispatch)(withNamespaces()(Sketches));
