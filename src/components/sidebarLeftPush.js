import React from 'react';
import { Sidebar, Segment, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import TopFixedMenu from './topFixedMenu';
import MenuItems from './menu';

class SidebarLeftPush extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  render() {
    return (
      <Sidebar.Pushable as={Segment}>
        <MenuItems active="daily_lessons" visible={this.state.visible} />
        <Sidebar.Pusher>
          <TopFixedMenu title="Daily Lessons" toggleVisibility={this.toggleVisibility}/>
          <div className="pusher">
            {this.props.children}
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default SidebarLeftPush;
