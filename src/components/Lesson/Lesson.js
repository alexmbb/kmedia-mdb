import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Container, Divider, Dropdown, Grid, Header, Item, List, Menu, Table } from 'semantic-ui-react';

import ReactJWPlayer from 'react-jw-player';

import { selectors as settingsSelectors } from '../../redux/modules/settings';
import { actions, selectors as lessonsSelectors } from '../../redux/modules/lessons';

import myimage from '../../images/image.png';

class LessonIndex extends React.Component {

  componentDidMount() {
    const { language, match } = this.props;
    this.askForData(match.params.id, language);
  }

  componentWillReceiveProps(nextProps) {
    const { language, match } = nextProps;
    const props               = this.props;

    if (language !== props.language || match.params.id !== props.match.params.id) {
      this.askForData(language, match.params.id);
    }
  }

  askForData(id, language) {
    this.props.fetchLesson({ id, language });
  }

  render() {
    return (
      <Lesson lesson={this.props.lesson} language={this.props.language} />
    );
  }
}

LessonIndex.propTypes = {
  match: PropTypes.shape({
    isExact: PropTypes.bool.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  language: PropTypes.string.isRequired,
  lesson: PropTypes.shape({
    id: PropTypes.string,
    film_date: PropTypes.string,
    content_type: PropTypes.string,
    content_units: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string,
      })
    ),
  }),
  fetchLesson: PropTypes.func.isRequired,
};

LessonIndex.defaultProps = {
  lesson: {}
};

function mapStateToProps(state /* , ownProps */) {
  return {
    lesson: lessonsSelectors.getLesson(state.lessons),
    language: settingsSelectors.getLanguage(state.settings),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LessonIndex);

function isEmpty(obj) {
  // null and undefined are "empty"
  if (obj === null) {
    return true;
  }

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) {
    return false;
  }
  if (obj.length === 0) {
    return true;
  }

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') {
    return true;
  }

  return Object.getOwnPropertyNames(obj).length <= 0;
}

const Video = ({ file }) => (
  <div id="video" style={{ width: '100%' }}>
    <ReactJWPlayer
      playerId="video"
      playerScript="http://content.jwplatform.com/libraries/rXTkmI8O.js"
      file={file.url}
      image=""
      customProps={{ skin: { name: 'seven' }, width: 500, height: 375 }}
    />
    {/* <video controls width="100%"> */}
    {/* <source src={files[1].url} type={files[1].mimetype} /> */}
    {/* <track kind="captions" /> */}
    {/* </video> */}
  </div>
);

Video.propTypes = {
  file: PropTypes.object.isRequired
};

class VideoBox extends React.Component {
  constructor(props) {
    super(props);
    const files  = props.files;
    const groups = new Map();

    files.forEach((file) => {
      if (file.mimetype === 'audio/mpeg' || file.mimetype === 'video/mp4') {
        if (groups.get(file.language) === undefined) {
          groups.set(file.language, []);
        }
        groups.get(file.language).push(file);
      }
    });

    let language = this.props.language;
    if (groups.get(language) === undefined) {
      language = groups.keys().next().value;
    }

    const set   = groups.get(language);
    const video = set.find(file => file.type === 'video');
    const audio = set.find(file => file.type === 'audio');

    this.state = {
      groups,
      language,
      video,
      audio,
      active: video || audio
    };
  }

  handleVideoAudio = () => {
    const state = this.state;

    if (state.active === state.video && state.audio) {
      this.setState({ active: state.audio });
    } else if (state.active === state.audio && state.video) {
      this.setState({ active: state.audio });
    }
  };

  render() {
    const state = this.state;

    if (state.video === undefined && state.audio === undefined) {
      return (<div>No video/audio file.</div>);
    }

    return (
      <Grid.Row className="video_box">
        <Grid.Column width="10">
          <div className="video_player">
            <Video file={state.active} />
          </div>
        </Grid.Column>
        <Grid.Column className="player_panel" width="6">
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Button.Group widths="3">
                  {state.video ? <Button active color="blue" onClick={this.handleVideoAudio}>Video</Button> :
                    <Button disabled>Video</Button> }
                  {state.audio && state.video ? <Button onClick={this.handleVideoAudio}>Audio</Button> : undefined }
                  { state.audio && !state.video ?
                    <Button active color="blue" onClick={this.handleVideoAudio}>Audio</Button> : undefined }
                  {!state.audio ? <Button disabled>Audio</Button> : undefined}
                </Button.Group>
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                  placeholder="Language"
                  search
                  selection
                  options={[
                    { key: 'EN', value: 'EN', text: 'English' },
                    { key: 'HE', value: 'HE', text: 'Hebrew' },
                    { key: 'RU', value: 'RU', text: 'Russian' }
                  ]}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider />
          <Header as="h3">
            <Header.Content>
              Morning Lesson - 2/4
              <Header.Subheader>
                2016-10-26
              </Header.Subheader>
            </Header.Content>
          </Header>
          <Menu vertical fluid size="small">
            <Menu.Item>1 - Lesson preparation - 00:12:02</Menu.Item>
            <Menu.Item active>2 - Lesson on the topic of &quot;Brit (Union)&quot; - 01:29:00</Menu.Item>
            <Menu.Item>3 - Baal HaSulam, TES, part 8, item 20 - 00:31:54</Menu.Item>
            <Menu.Item>4 - Baal HaSulam, &quot;The Giving of the Torah&quot;, item 6 - 00:43:41</Menu.Item>
          </Menu>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

VideoBox.propTypes = {
  files: PropTypes.array.isRequired,
  language: PropTypes.string.isRequired
};

const Lesson = ({ lesson, language }) => {
  console.log(lesson);
  if (isEmpty(lesson)) {
    return <div />;
  }

  return (
    <div>
      <Grid>
        <VideoBox files={lesson.files} language={language} />
      </Grid>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Header as="h3">
              <span className="text grey">{lesson.film_date}</span><br />
              {lesson.name}
            </Header>
            <List>
              <List.Item><b>Topics:</b> <a href="">From Lo Lishma to Lishma</a>, <a href="">Work in
                group</a></List.Item>
              <List.Item><b>Sources:</b> <a href=""> Shamati - There is None Else Beside Him</a>, <a href="">Shamati -
                Divinity in Exile</a></List.Item>
              <List.Item><b>Related to Event:</b> <a href="">World Israel Congress 2016</a></List.Item>
            </List>
            <Menu secondary pointing color="blue" className="index-filters">
              <Menu.Item name="item-summary">Summary</Menu.Item>
              <Menu.Item name="item-transcription">Transcription</Menu.Item>
              <Menu.Item name="item-sources">Sources</Menu.Item>
              <Menu.Item name="item-sketches">Sketches</Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column width={6}>
            <Grid columns="equal">
              <Grid.Row>
                <Grid.Column>
                  <Header as="h3">Media Downloads</Header>
                </Grid.Column>
                <Grid.Column>
                  <Dropdown
                    placeholder="Language"
                    search
                    selection
                    options={[
                      { key: 'EN', value: 'EN', text: 'English' },
                      { key: 'HE', value: 'HE', text: 'Hebrew' },
                      { key: 'RU', value: 'RU', text: 'Russian' }
                    ]}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Table basic="very" compact="very">
              <Table.Body>
                {
                  lesson.files.map(file => <FileDownload key={file.id} file={file} />)
                }
              </Table.Body>
            </Table><Header as="h3">Other parts from the same lesson</Header>
            <Item.Group divided link>
              <Item>
                <Item.Image src={myimage} size="tiny" />
                <Item.Content >
                  <Header as="h4">Part 0</Header>
                  <Item.Meta>
                    <small>00:12:37</small>
                  </Item.Meta>
                  <Item.Description>Lesson Preparation</Item.Description>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image src={myimage} size="tiny" />

                <Item.Content >
                  <Header as="h4">Part 1</Header>
                  <Item.Meta>
                    <small>36:10:35</small>
                  </Item.Meta>
                  <Item.Description>Lesson on the topic of &quot;Preparation for the Pesach&quot;, part&nbsp;
                    1</Item.Description>
                </Item.Content>
              </Item>
              <Item>
                <Item.Content>
                  <Container fluid textAlign="right" as="a">more &raquo;</Container>
                </Item.Content>
              </Item>
            </Item.Group>
            <Header as="h3">Other parts from the same lesson</Header>
            <Item.Group divided link>
              <Item>
                <Item.Image src={myimage} size="tiny" />
                <Item.Content >
                  <Header as="h4">Part 0</Header>
                  <Item.Meta>
                    <small>00:12:37</small>
                  </Item.Meta>
                  <Item.Description>Lesson Preparation</Item.Description>
                </Item.Content>
              </Item>
              <Item>
                <Item.Image src={myimage} size="tiny" />

                <Item.Content >
                  <Header as="h4">Part 1</Header>
                  <Item.Meta>
                    <small>36:10:35</small>
                  </Item.Meta>
                  <Item.Description>Lesson on the topic of &quot;Preparation for the Pesach&quot, part&nbsp;
                    1</Item.Description>
                </Item.Content>
              </Item>
              <Item>
                <Item.Content>
                  <Container fluid textAlign="right" as="a">more &raquo;</Container>
                </Item.Content>
              </Item>
            </Item.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

Lesson.propTypes = {
  lesson: PropTypes.shape({
    uid: PropTypes.string,
    description: PropTypes.string
  }),
  language: PropTypes.string.isRequired
};

Lesson.defaultProps = {
  lesson: null
};

const FileDownload = (props) => {
  const file = props.file;

  switch (file.type) {
  case 'audio':
    return (
      <Table.Row>
        <Table.Cell>Lesson Audio</Table.Cell>
        <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>{file.type.toUpperCase()}</Button></Table.Cell>
        <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>Copy Link</Button></Table.Cell>
      </Table.Row>
    );
  case 'video':
    return (
      <Table.Row>
        <Table.Cell>Lesson Video</Table.Cell>
        <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>{file.type.toUpperCase()}</Button></Table.Cell>
        <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>Copy Link</Button></Table.Cell>
      </Table.Row>
    );
  case 'source':
    return (
      <Table.Row>
        <Table.Cell>Source Materials</Table.Cell>
        <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>DOC</Button></Table.Cell>
        <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>Copy
          Link</Button></Table.Cell>
      </Table.Row>
    );
  case 'text':
    return (
      <Table.Row>
        <Table.Cell>Transcription Text</Table.Cell>
        <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>DOC</Button></Table.Cell>
        <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>Copy
          Link</Button></Table.Cell>
      </Table.Row>
    );
  case 'sketches':
    return (
      <Table.Row>
        <Table.Cell>Sketches</Table.Cell>
        <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>ZIP</Button></Table.Cell>
        <Table.Cell collapsing><Button size="mini" color="orange" compact fluid>Copy
          Link</Button></Table.Cell>
      </Table.Row>
    );
  default:
    return '';
  }
};
