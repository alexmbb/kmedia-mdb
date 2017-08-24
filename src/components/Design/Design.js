/* eslint-disable */

import React, { Component } from 'react';
import { Grid, Header, Menu, Icon, Button, Dropdown, Divider, List, Popup, Table, Card, Image, Input, Search, Label, Container, Embed } from 'semantic-ui-react';
const results ={
    "search": {
      "icon": "search",
      "name": "Search",
      "results": [
        {"title": "tod"}
      ]
    },
    "date": {
      "icon": "calendar",
      "name": "Date",
      "results": [
        {"title": "Today"}
      ]
    },
    "sources": {
      "icon": "book",
      "name": "Sources",
      "results": [
        {"title": "Rabash > Articles > You Stand Today, All of You"}
      ]
    },
    "topics": {
      "icon": "tag",
      "name": "Topics",
      "results": [
        {"title": "Kabbalah today"},
        {"title":"Today and Tomorrow"}
      ]
    }
  }
const categoryRenderer = ({ name, icon }) => <div><Icon name={icon}/>{name}</div>
const resultRenderer = ({ title }) => <div>{title}</div>
class Design extends Component {

  render() {
    return (
      <Grid.Column width={16}>

        <Header size='large' color='pink' inverted>Event Collection</Header>
        <Divider/>
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
               <Image fluid shape='rounded' src='https://i1.sndcdn.com/artworks-000205720468-8rbpnk-t500x500.jpg' />
            </Grid.Column>
            <Grid.Column width={8}>
              <Header as='h1'>
                <Header.Content>
                  <small className='text grey'>25-27 of August 2017</small>
                  <br/>
                  EUROPE 2.0<br/>THE FUTURE BEGINS NOW
                  <Header.Subheader>
                    Bonn Area, Germany
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <p>
                A series of conversations with Rabbi Dr. Michael Laitman, whose purpose is to create the infrastructure to promote every person, organization, society or country, to better understand the reality of our lives and to achieve a good life
              </p>
              
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Embed
                active={true}
                aspectRatio="21:9"
                iframe={{
                  allowFullScreen: false,
                  style: {
                    border: 0
                  },
                  frameborder: "0"
                }}
                placeholder='/assets/images/image-16by9.png'
                url='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d80860.06794871506!2d7.04726036282409!3d50.703664739362665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bee19f7ccbda49%3A0x86dbf8c6685c9617!2sBonn%2C+Germany!5e0!3m2!1sen!2sil!4v1503539041101'
              />

            </Grid.Column>
          </Grid.Row>
        </Grid>
        
        <Header size='large' color='pink' inverted>Programs Collection</Header>
        <Divider/>
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
               <Image fluid shape='rounded' src='http://www.kab.co.il/images/attachments/91/276191_medium.jpg' />
            </Grid.Column>
            <Grid.Column width={8}>
              <Header as='h1'>
                <Header.Content>
                  A New Life
                  <Header.Subheader>
                    920 Episodes
                  </Header.Subheader>
                </Header.Content>
              </Header>
              <p>
                A series of conversations with Rabbi Dr. Michael Laitman, whose purpose is to create the infrastructure to promote every person, organization, society or country, to better understand the reality of our lives and to achieve a good life
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        
        <Header size='large' color='pink' inverted>TV & Video Programs</Header>
        <Divider/>
      
        <div className='featured-unit'>
          <Header
            as="h2"
            content='Programs'
          />
          <Card.Group itemsPerRow='4' doubling>
            <Card href='#'>
              <Image fluid src='http://www.kab.co.il/images/attachments/91/276191_medium.jpg' />
              <Card.Content>
                <Card.Header>
                  A New Life
                </Card.Header>
                <Card.Meta>
                  <span className='date'>
                    Last updated: 30/7/2017
                  </span>
                </Card.Meta>
                <Card.Description>
                  Episode 852 - Jewish Culture: Purity & Impurity, the Spiritual Root
                </Card.Description>
              </Card.Content>
            </Card>
            <Card href='#'>
              <Image fluid src='http://www.kab.co.il/images/attachments/86/276186_medium.png' />
              <Card.Content>
                <Card.Header>
                  Matthew
                </Card.Header>
                <Card.Meta>
                  <span className='date'>
                    Joined in 2015
                  </span>
                </Card.Meta>
                <Card.Description>
                  Matthew is a musician living in Nashville.
                </Card.Description>
              </Card.Content>
            </Card>            
            <Card href='#'>
              <Image fluid src='http://www.kab.co.il/images/attachments/37/269137_medium.jpg' />
              <Card.Content>
                <Card.Header>
                  Matthew
                </Card.Header>
                <Card.Meta>
                  <span className='date'>
                    Joined in 2015
                  </span>
                </Card.Meta>
                <Card.Description>
                  Matthew is a musician living in Nashville.
                </Card.Description>
              </Card.Content>
            </Card>            
            <Card href='#'>
              <Image fluid src='http://www.kab.co.il/images/attachments/21/209721_medium.jpg' />
              <Card.Content>
                <Card.Header>
                  Matthew
                </Card.Header>
                <Card.Meta>
                  <span className='date'>
                    Joined in 2015
                  </span>
                </Card.Meta>
                <Card.Description>
                  Matthew is a musician living in Nashville.
                </Card.Description>
              </Card.Content>
            </Card>  
          </Card.Group>
        </div>
        <Menu secondary pointing color="blue" className="index-filters" size="large">
          <Menu.Item header>Filter Programs by:</Menu.Item>
          <Menu.Item active>Date</Menu.Item>
          <Menu.Item>Genre / Program</Menu.Item>
          <Menu.Item>Topic</Menu.Item>
          <Menu.Item className='index-filters__search'>

            <Search  category results={results} size='mini' placeholder='Search Programs...'categoryRenderer={categoryRenderer} resultRenderer={resultRenderer} />
          </Menu.Item>
        </Menu>
        {/*<Header size='large' color='pink' inverted>video collection collapsed (๏㉨๏)</Header>*/}

        {/*
        <div className='collapsed_video_container'>
        	<Grid >
            <Grid.Row>
              <Grid.Column width='4'>
                <div className='video_player'>
                  <div className='video_placeholder' />
                </div>
              </Grid.Column>
              <Grid.Column width='10'>

                <Header as="h5">
                  2016-10-26<br/>Lesson on the topic of “From Lo Lishma to Lishma” (not for Her Name for Her Name)
                </Header>
                <List size='mini'>
                  <List.Item><b>Topics:</b> <a href=''>From Lo Lishma to Lishma</a>, <a href=''>Work in group</a></List.Item>
                  <List.Item><b>Sources:</b> <a href=''> Shamati - There is None Else Beside Him</a>, <a href=''>Shamati - Divinity in Exile</a></List.Item>
                  <List.Item><b>Related to Event:</b> <a href=''>World Israel Congress 2016</a></List.Item>
                </List>

              </Grid.Column>
              <Grid.Column width='2'>
                <Popup
                  trigger={<Button size="mini" color="orange" compact fluid>Downloads</Button>}
                  flowing
                  position='bottom center'
                >
                  <Popup.Header>
                    Downloads
                  </Popup.Header>
                  <Popup.Content>
                  <Table basic="very" compact="very">
                    <Table.Body>
                      <Table.Row verticalAlign="top">
                        <Table.Cell>
                          Lesson Video
                        </Table.Cell>
                        <Table.Cell collapsing>
                          <Button as="a" target="_blank" size="mini" color="orange" compact fluid>
                            MP4
                          </Button>
                        </Table.Cell>
                        <Table.Cell collapsing>
                            <Button size="mini" color="orange" compact fluid>
                              Copy Link
                            </Button>
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row verticalAlign="top">
                        <Table.Cell>
                          Lesson Audio
                        </Table.Cell>
                        <Table.Cell collapsing>
                          <Button as="a" target="_blank" size="mini" color="orange" compact fluid>
                            MP3
                          </Button>
                        </Table.Cell>
                        <Table.Cell collapsing>
                            <Button size="mini" color="orange" compact fluid>
                              Copy Link
                            </Button>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                  </Popup.Content>
                </Popup>

              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        */}
        
      	<Header size='large' color='pink' inverted>video collection ☼.☼</Header>
        <Grid>
          <Grid.Row className='video_box'>
            <Grid.Column width='10'>
             	<div className='video_player'>
		            <div className='video_placeholder' />
		         	</div>
            </Grid.Column>
            <Grid.Column className='player_panel' width='6' >
              <Grid columns='equal'>
                <Grid.Row>
                  <Grid.Column>
                    <Button.Group fluid>
                      <Button active color='blue'>Video</Button>
                      <Button>Audio</Button>
                    </Button.Group>
                  </Grid.Column>
                  <Grid.Column>
                    <Dropdown fluid placeholder='Language' search selection options={[
                      { key: 'EN', value: 'EN', text: 'English' },
                      { key: 'HE', value: 'HE', text: 'Hebrew' },
                      { key: 'RU', value: 'RU', text: 'Russian' }
                      ]} />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Divider/>
                <Header as='h3'>
                  <Header.Content>
                    Morning Lesson - 2/4
                    <Header.Subheader>
                      2016-10-26
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              <Menu vertical fluid size='small' color='blue'>
                <Menu.Item as='a'>1 - Lesson preparation - 00:12:02</Menu.Item>
                <Menu.Item as='a' active>2 - Lesson on the topic of "Brit (Union)" - 01:29:00</Menu.Item>
                <Menu.Item as='a' disabled>
                  3 - Baal HaSulam, TES, part 8, item 20 - 00:31:54

                </Menu.Item>
                <Menu.Item as='a'>4 - Baal HaSulam, "The Giving of the Torah", item 6 - 00:43:41</Menu.Item>
              </Menu>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Header size='large' color='pink' inverted>tags -^+^-</Header>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <div className='filter-tags'>
                <Button.Group size='mini'>
                  <Button basic color='blue'>
                    <Icon name='book' />
                    Baal HaSulam - TES
                  </Button>
                  <Button color='blue' icon='close'></Button>
                </Button.Group>

                <Button.Group size='mini'>
                  <Button basic color='blue'>
                    <Icon name='tag' />
                    Arvut Between the Tens
                  </Button>
                  <Button color='blue' icon='close'></Button>
                </Button.Group>

                <Button.Group size='mini'>
                  <Button basic color='blue'>
                    <Icon name='calendar' />
                    3 Jul 2017 - 3 Jul 2017
                  </Button>
                  <Button color='blue' icon='close'></Button>
                </Button.Group>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Header size='large' color='pink' inverted>pagination (°ʖ°)</Header>
        <Grid>
          <Grid.Row>
            <Grid.Column textAlign='center'>
              <Menu pagination color='blue'>
                <Menu.Item icon><Icon name='angle double left' /></Menu.Item>
                <Menu.Item icon><Icon name='angle left' /></Menu.Item>
                <Menu.Item icon disabled><Icon name='ellipsis horizontal' /></Menu.Item>
                <Menu.Item name='2' />
                <Menu.Item name='3' />
                <Menu.Item name='4' />
                <Menu.Item name='5' />
                <Menu.Item active name='6' />
                <Menu.Item name='7' />
                <Menu.Item name='8' />
                <Menu.Item name='9' />
                <Menu.Item name='10' />
                <Menu.Item icon disabled><Icon name='ellipsis horizontal' /></Menu.Item>
                <Menu.Item icon><Icon name='angle right' /></Menu.Item>
                <Menu.Item icon><Icon name='angle double right' /></Menu.Item>
              </Menu>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    );
  }
}

export default Design;
