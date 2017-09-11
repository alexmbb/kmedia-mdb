import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Media } from 'react-media-player';

import { MT_AUDIO, MT_VIDEO } from '../../helpers/consts';
import * as shapes from '../shapes';
import AVPlayerRMP from './AVPlayerRMP';

class AVPlaylistPlayerRMP extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    collection: shapes.GenericCollection,
    activePart: PropTypes.number,
    onActivePartChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activePart: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      autoPlay: true,
      language: undefined,
      isVideo: true,
      isAudio: false,
      files: this.buildFiles(props.collection.contentUnits),
    };
  }

  componentDidMount() {
    const { collection } = this.props;
    this.updateFilesFromContentUnits(collection.contentUnits);
  }

  componentWillReceiveProps(nextProps) {
    const { collection } = nextProps;
    this.updateFilesFromContentUnits(collection.contentUnits);
  }

  updateFilesFromContentUnits = (contentUnits) => {
    // Update files
    let { files }    = this.state;
    let stateUpdated = false;

    // Clear files if new full lesson was set.
    if (contentUnits.map(cu => cu.id).join() !==
        this.props.collection.contentUnits.map(cu => cu.id).join()) {
      files        = new Map();
      stateUpdated = true;
    }

    // Wait for lesson parts to load.
    const newFiles = this.buildFiles(contentUnits);
    if (newFiles.size) {
      files        = new Map([...files, ...newFiles]);
      stateUpdated = true;
    }

    if (stateUpdated) {
      this.setState({ files });
    }
  };

  /**
   * For one part, generates map of files by language, then by type.
   * @param {!Array<MDBFile>} files
   * @return {Map<string, Map<string, MDBFile>>} map of files by language,
   *     then type (audio/video).
   */
  getFilesByLanguageByAV = (files) => {
    const ret = new Map();

    (files || []).forEach((file) => {
      // TODO: What is the difference between mimetype and type?!
      if ((['audio/mpeg', 'video/mp4'].includes(file.mimetype)) &&
        ([MT_VIDEO, MT_AUDIO].includes(file.type))) {
        if (!ret.has(file.language)) {
          ret.set(file.language, new Map());
        }
        ret.get(file.language).set(file.type, file);
      }
    });

    return ret;
  };

  /**
   * Generates playlist from all parts, will leave undefined is some parts that
   * don't have appropriate language or type (video/audio).
   * @param {!Array<MDBBaseContentUnit>} lessonParts
   * @return {!Map<string, Map<string, !Array<Object>>}
   */
  buildFiles = (lessonParts) => {
    const files = new Map();
    lessonParts.forEach((p, i) => {
      if (p.files && p.files.length) {
        this.getFilesByLanguageByAV(p.files).forEach((filesByAV, language) => {
          if (!files.has(language)) {
            files.set(language, new Map());
          }
          filesByAV.forEach((file, audioOrVideo) => {
            if (!files.get(language).has(audioOrVideo)) {
              files.get(language).set(audioOrVideo, []);
            }
            files.get(language).get(audioOrVideo)[i] = file;
          });
        });
      }
    });
    return files;
  };

  handleChangeLanguage = (e, language) => {
    this.setState({ language });
  };

  handleLessonPartClick = (e, data) =>
    this.props.onActivePartChange(parseInt(data.name, 10));

  onFinish = () => {
    const { activePart, collection, onActivePartChange } = this.props;
    if (activePart < collection.contentUnits.length - 1) {
      onActivePartChange(activePart + 1);
    }
    this.setState({ autoPlay: true });
  };

  onNext = () => {
    const { activePart, collection, onActivePartChange } = this.props;
    if (activePart < collection.contentUnits.length - 1) {
      onActivePartChange(activePart + 1);
    }
  };

  onPrev = () => {
    const { activePart, onActivePartChange } = this.props;
    if (activePart > 0) {
      onActivePartChange(activePart - 1);
    }
  };

  onPlay = () => {
    this.setState({ autoPlay: true });
  };

  onPause = () => {
    this.setState({ autoPlay: false });
  };

  handleSwitchAV = () => {
    if (this.state.isAudio && this.state.isVideo !== undefined) {
      this.setState({ isAudio: false, isVideo: true });
    }
    if (this.state.isVideo && this.state.isAudio !== undefined) {
      this.setState({ isAudio: true, isVideo: false });
    }
  };

  render() {
    const { t, activePart, language: propsLanguage } = this.props;
    const { autoPlay, language = propsLanguage, files }          = this.state;
    let { isVideo, isAudio }                                     = this.state;

    const filesByAV = files.get(language) || new Map();
    let audioFileList = [];
    if (!filesByAV.has(MT_AUDIO)) {
      isAudio = undefined;
    } else if (isAudio) {
      audioFileList = filesByAV.get(MT_AUDIO) || [];
    }
    let videoFileList = [];
    if (!filesByAV.has(MT_VIDEO)) {
      isVideo = undefined;
    } else if (isVideo) {
      videoFileList = filesByAV.get(MT_VIDEO) || [];
    }

    // hasNext, hasPrev are not trivial as checking the indexes due to fact
    // that in some languages there might be missing audio or video file.
    const hasNext = () => {
      const fileList = isVideo ? videoFileList : audioFileList;
      return activePart < fileList.length - 1 &&
        fileList.slice(activePart).some(f => !!f);
    };

    const hasPrev = () => {
      const fileList = isVideo ? videoFileList : audioFileList;
      return activePart > 0 && fileList.slice(0, activePart).some(f => !!f);
    };

    return (
      <div className="video_player">
        <div className="video_position">
          <Media>
            <AVPlayerRMP
              autoPlay={autoPlay}
              active={isVideo ? videoFileList[activePart] : audioFileList[activePart]}
              video={videoFileList[activePart]}
              audio={audioFileList[activePart]}
              onSwitchAV={this.handleSwitchAV}
              languages={Array.from(files.keys())}
              defaultLanguage={language}
              onLanguageChange={this.handleChangeLanguage}
              t={t}
              // Playlist props
              showNextPrev
              onFinish={this.onFinish}
              hasNext={hasNext()}
              hasPrev={hasPrev()}
              onPrev={this.onPrev}
              onNext={this.onNext}
              onPause={this.onPause}
              onPlay={this.onPlay}
            />
          </Media>
        </div>
      </div>
    );
  }
}

export default AVPlaylistPlayerRMP;

