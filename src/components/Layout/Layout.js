import React, {Component} from 'react';
import LoadingBar from 'react-redux-loading-bar';
import { Grid, Sidebar } from 'semantic-ui-react';
import { Route } from 'react-router-dom';
import Routes from './Routes';
import TopFixedMenu from './TopFixedMenu';
import MenuItems from './MenuItems';
import Footer from './Footer';

class Layout extends Component {
  state = {
    visible: false
  };

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  render() {
    return (
      <Sidebar.Pushable>
        <MenuItems visible={this.state.visible} />
        <Sidebar.Pusher>
          <TopFixedMenu toggleVisibility={this.toggleVisibility} />
          <div className="wrapper">
            <Grid columns="equal" className="main-content container">
              <Grid.Row>
                <Grid.Column width={3} only="computer" className="main-menu">
                  <MenuItems simple />
                </Grid.Column>
                <Grid.Column>
                  <Grid padded>
                    <Grid.Row>
                      <Route component={Routes} />
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <LoadingBar />
            <Footer />
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

export default Layout;
