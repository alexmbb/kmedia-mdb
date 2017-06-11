import React, { Component } from 'react';
import { Grid, Header, Menu, Icon, Button, Dropdown, Divider } from 'semantic-ui-react';
import AVPlayer from '../Lesson/AVPlayer';
class Design extends Component {

  render() {
    return (
      <Grid.Column width={16}>
      	<Header size='large' color='pink' inverted>pagination (°ʖ°)</Header>
      	<Grid>
      		<Grid.Row>
      			<Grid.Column textAlign='center'>
      				<Menu pagination color='blue' size=''>                    
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
      	
      	<Header size='large' color='pink' inverted>video collection ☼.☼</Header>
        <Grid>
          <Grid.Row color='' className="video_box">
            <Grid.Column width='10'>
             	<div className="video_player">
		            <div id="video" />
		            
		         	</div>
            </Grid.Column>
            <Grid.Column className='player_panel' width='6' color=''>
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
              <Menu vertical fluid size="small">
                <Menu.Item>1 - Lesson preparation - 00:12:02</Menu.Item>
                <Menu.Item active>2 - Lesson on the topic of "Brit (Union)" - 01:29:00</Menu.Item>
                <Menu.Item>3 - Baal HaSulam, TES, part 8, item 20 - 00:31:54</Menu.Item>
                <Menu.Item>4 - Baal HaSulam, "The Giving of the Torah", item 6 - 00:43:41</Menu.Item>
              </Menu>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    );
  }
}

export default Design;