import React  from 'react';
import PropTypes from 'prop-types';

import { Segment, Menu as Rmenu, Header, Grid, Container } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';

import MenuRoutes from './router';
import MenuItems from './menu';
import { FetchCollections, LESSONS } from './fetch';

class LessonsIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page_no     : 1,
      page_size   : 10,
      language    : 'ru',
      lessons     : [],
      total       : '...',
      loading     : false,
      activeFilter: null
    };
  }

  componentDidMount() {
    this.loadPage(this.getPageNo(this.props.location.search));
  }

  componentWillReceiveProps(props) {
    this.loadPage(this.getPageNo(props.location.search));
  }

  getPageNo = (search) => {
    let page = 0;
    if (search) {
      page = parseInt(search.match(/page=(\d+)/)[1], 10);
    }

    return (isNaN(page) || page <= 0) ? 1 : page;
  }

  handleDataFetch = (params, { total, collections }) => {
    this.setState({
      total,
      lessons: collections,
      page_no: params.page_no,
      loading: false
    });
  }

  handleFilterClick = ({ name }) => this.setState({ activeFilter: name });

  loadPage = (pageNo) => {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true },
      () => FetchCollections({
        content_type: LESSONS,
        language    : this.state.language,
        page_no     : pageNo,
        page_size   : this.state.page_size
      }, this.handleDataFetch)
    );
  }

  render() {
    const state = this.state;

    return (
      <Grid columns="equal" className="main-content container">
        <Grid.Row>
          <Grid.Column width={3} only="computer" className="main-menu">
            <MenuItems simple routes={MenuRoutes} />
          </Grid.Column>
          <Grid.Column>
            <Grid padded>
              <Grid.Row stretched>
                <Grid.Column width={16}>
                  <Header as="h3">
                    Results {((state.page_no - 1) * state.page_size) + 1} - {(state.page_no * state.page_size) + 1}
                    &nbsp;of {state.total}</Header>
                  <FilterMenu active={state.activeFilter} handler={this.handleFilterClick} />
                  <ActiveFilter filter={state.activeFilter} />
                  <Pagination totalPages={state.total} />
                  <Lessons loading={state.loading} lessons={state.lessons} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

LessonsIndex.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired
};

// FILTERS

const ActiveFilter = ({ filter }) => {
  switch (filter) {
  case 'date-filter':
    return <DateFilter />;
  case 'sources-filter':
    return <Segment basic attached="bottom" className="tab active">Second</Segment>;
  case 'topic-filter':
    return <Segment basic attached="bottom" className="tab active">Third</Segment>;
  default:
    return <span />;
  }
};

ActiveFilter.propTypes = {
  filter: PropTypes.string
};

ActiveFilter.defaultProps = {
  filter: ''
};

const DateFilter = () => <Segment basic attached="bottom" className="tab active">First</Segment>;

const FilterMenu = props =>
  <Rmenu secondary pointing color="violet" className="index-filters">
    <Rmenu.Header className="item">Filter by:</Rmenu.Header>
    <FilterMenuDate name="date" title="Date" {...props} />
    <FilterMenuSources name="sources" title="Sources" {...props} />
    <FilterMenuTopics name="topic" title="Topics" {...props} />
  </Rmenu>;

const FilterMenuDate = ({ name, title, active, handler }) => {
  const fullName = `${name}-filter`;
  return (
    <Rmenu.Item name={fullName} active={active === fullName} onClick={() => handler({ name: fullName })}>{title}</Rmenu.Item>
  );
};

FilterMenuDate.propTypes = {
  name   : PropTypes.string.isRequired,
  title  : PropTypes.string.isRequired,
  active : PropTypes.string,
  handler: PropTypes.func,
};

const FilterMenuSources = ({ name, title, active, handler }) => {
  const fullName = `${name}-filter`;
  return (
    <Rmenu.Item name={fullName} active={active === fullName} onClick={() => handler({ name: fullName })}>{title}</Rmenu.Item>
  );
};

FilterMenuSources.propTypes = {
  name   : PropTypes.string.isRequired,
  title  : PropTypes.string.isRequired,
  active : PropTypes.string,
  handler: PropTypes.func,
};

const FilterMenuTopics = ({ name, title, active, handler }) => {
  const fullName = `${name}-filter`;
  return (
    <Rmenu.Item name={fullName} active={active === fullName} onClick={() => handler({ name: fullName })}>{title}</Rmenu.Item>
  );
};

FilterMenuTopics.propTypes = {
  name   : PropTypes.string.isRequired,
  title  : PropTypes.string.isRequired,
  active : PropTypes.string,
  handler: PropTypes.func,
};

// LESSONS

const Lessons = (props) => {
  if (props.loading) {
    return <Segment>Loading...</Segment>;
  }

  const lessons = props.lessons.map((lesson) => {
    const units = lesson.content_units.map(unit => (
      <Container as="div" key={`u-${unit.id}`}><Link to={`/lessons/${unit.id}`}>{unit.name}<br />{unit.description}
      </Link></Container>
    ));

    return (
      <Grid.Row key={`l-${lesson.id}`} stretched verticalAlign="top">
        <Grid.Column width={2}><a><strong>{lesson.film_date}</strong></a></Grid.Column>
        <Grid.Column width={14}>
          <Grid.Column>
            <a><strong>{lesson.content_type}</strong></a>
            {units}
          </Grid.Column>
        </Grid.Column>
      </Grid.Row>
    );
  });

  return (<Segment><Grid columns={2} divided="vertically">{lessons}</Grid></Segment>);
};

Lessons.propTypes = {
  loading: PropTypes.bool.isRequired,
  lessons: PropTypes.arrayOf(
    PropTypes.shape({
      id           : PropTypes.string.isRequired,
      film_date    : PropTypes.string.isRequired,
      content_type : PropTypes.string.isRequired,
      content_units: PropTypes.arrayOf(
        PropTypes.shape({
          id         : PropTypes.string.isRequired,
          name       : PropTypes.string.isRequired,
          description: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired
};

// PAGINATION
const Pagination = ({ totalPages }) => {
  if (totalPages === '...') {
    return <Segment />;
  }

  const total = totalPages > 10 ? 10 : totalPages;
  const menu  = [...new Array(total).keys()].map(id =>
    <Rmenu.Item
      as={NavLink}
      activeClassName="active violet"
      key={`page-${id + 1}`}
      to={{
        pathname: '/lessons',
        search  : `?page=${id + 1}`
      }}
    >&nbsp;{id + 1}</Rmenu.Item>
  );

  return (
    <Segment> Pages: {menu} </Segment>
  );
};

Pagination.propTypes = {
  totalPages: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])
};

export default LessonsIndex;
