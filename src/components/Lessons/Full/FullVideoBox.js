import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment-duration-format';
import { Button, Divider, Grid, Header, Menu } from 'semantic-ui-react';

import { MT_AUDIO, MT_VIDEO } from '../../../helpers/consts';
import { physicalFile } from '../../../helpers/utils';
import * as shapes from '../../shapes';
import LanguageSelector from '../../shared/LanguageSelector';
import AVPlayer from '../../shared/AVPlayer';

class FullVideoBox extends Component {

  static propTypes = {
    language: PropTypes.string.isRequired,
    fullLesson: shapes.LessonCollection,
    lessonParts: PropTypes.arrayOf(shapes.LessonPart),
    activePartIndex: PropTypes.number,
  };

  static defaultProps = {
    fullLesson: undefined,
    lessonParts: [],
  };

  state = {
    language: undefined,
    isVideo: true,
    isAudio: false,
    files: new Map(),
  };

  componentDidMount() {
    const { fullLesson, lessonParts } = this.props;

    // Wait for full lesson to load.
    if (fullLesson) {
      // Update files
      let { files }    = this.state;
      let stateUpdated = false;

      // Wait for lesson parts to load.
      if (lessonParts) {
        const newFiles = this.buildFiles(lessonParts);
        if (newFiles.size) {
          files        = new Map([...files, ...newFiles]);
          stateUpdated = true;
        }
      }

      if (stateUpdated) {
        this.setState({ files });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fullLesson, lessonParts } = nextProps;
    const props                       = this.props;

    // Wait for full lesson to load.
    if (fullLesson) {
      // Update files
      let { files }    = this.state;
      let stateUpdated = false;

      // Clear files if new full lesson was set.
      if (fullLesson !== props.fullLesson && fullLesson.id !== props.fullLesson.id) {
        files        = new Map();
        stateUpdated = true;
      }

      // Wait for lesson parts to load.
      if (lessonParts) {
        const newFiles = this.buildFiles(lessonParts);
        if (newFiles.size) {
          files        = new Map([...files, ...newFiles]);
          stateUpdated = true;
        }
      }

      if (stateUpdated) {
        this.setState({ files });
      }
    }
  }

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

  /**
   * @param {!Array<Object>} files
   * @return {Map<string, Map<string, file>>} map of files by language, then type (audio/video)
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

  handleChangeLanguage = (e, language) => {
    this.setState({ language });
  };

  beforeComplete = () => {
    if (this.props.activePartIndex < this.props.lessonParts.length - 1) {
      this.props.onActivePartIndexChange(this.props.activePartIndex + 1);
    }
  };

  handleOnVideo = () => {
    this.setState({ isVideo: true, isAudio: false });
  };

  handleOnAudio = () => {
    this.setState({ isAudio: true, isVideo: false });
  };

  render() {
    const { activePartIndex, fullLesson, lessonParts, language: propsLanguage } = this.props;
    let { isVideo, isAudio, language = propsLanguage, files }                   = this.state;

    const filesByAV = files.get(language) || new Map();
    let fileList    = [];
    if (!filesByAV.has(MT_AUDIO)) {
      isAudio = undefined;
    } else if (isAudio) {
      fileList = filesByAV.get(MT_AUDIO) || [];
    }
    if (!filesByAV.has(MT_VIDEO)) {
      isVideo = undefined;
    } else if (isVideo) {
      fileList = filesByAV.get(MT_VIDEO) || [];
    }

    if (!fileList[activePartIndex] && !lessonParts.every(p => p.files)) {
      return (<div>Loading...</div>);
    }

    const partTitle = (part) => [part.name_in_collection, part.name, moment.duration(part.duration, 'seconds').format('hh:mm:ss')].join(' - ');

    // Remove empty files, might be in case language or video/audio is missing.
    // Store idx in order to get feedback from the player to select the correct part.
    const playlist          = [];
    let playlistActiveIndex = null;
    fileList.forEach((file, idx) => {
      if (file) {
        // Set index in playlist to play.
        if (playlistActiveIndex === null || idx <= activePartIndex) {
          playlistActiveIndex = playlist.length;
        }
        playlist.push({
          mediaid: idx,
          file: physicalFile(file, true),
          title: partTitle(lessonParts[idx]),
        });
      }
    });

    const lessonMenuItems = lessonParts.map((part, index) => (
      <Menu.Item key={index}
                 name={index.toString()}
                 active={index === activePartIndex}
                 onClick={() => this.props.onActivePartIndexChange(index)}>
        {partTitle(part)}
      </Menu.Item>
    ));

    return (
      <Grid.Row className="video_box">
        <Grid.Column width={10}>
          <div className="video_player">
            <div id="video" />
            <AVPlayer
              playerId="lesson"
              onOneHundredPercent={this.beforeComplete}
              playlist={playlist}
              playItem={playlistActiveIndex}
            />
          </div>
        </Grid.Column>
        <Grid.Column className="player_panel" width={6}>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button.Group fluid>
                  { isVideo === true ? <Button active color="blue">Video</Button> : null }
                  { isVideo === false ? <Button onClick={this.handleOnVideo}>Video</Button> : null}
                  { isVideo === undefined ? <Button disabled>Video</Button> : null}
                  { isAudio === true ? <Button active color="blue">Audio</Button> : null }
                  { isAudio === false ? <Button onClick={this.handleOnAudio}>Audio</Button> : null }
                  { isAudio === undefined ? <Button disabled>Audio</Button> : null}
                </Button.Group>
              </Grid.Column>
              <Grid.Column>
                <LanguageSelector
                  languages={Array.from(files.keys())}
                  defaultValue={language}
                  onSelect={this.handleChangeLanguage}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider />
          <Header
            as="h3"
            subheader={fullLesson.film_date}
            content={fullLesson.content_type + ' - ' + (activePartIndex + 1) + '/' + lessonParts.length}
          />
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <Menu vertical fluid size="small">
                  { lessonMenuItems }
                </Menu>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

export default FullVideoBox;
