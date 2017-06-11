/* eslint-disable no-extra-boolean-cast */

import React  from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Divider, List, Segment } from 'semantic-ui-react';
import map from 'lodash/map';
import noop from 'lodash/noop';
import { selectors as filterSelectors, actions as filterActions } from '../../../redux/modules/filters';
import { selectors as sources } from '../../../redux/modules/sources';

const filterName = 'sources-filter';

class SourcesFilter extends React.Component {

  state = {
    selection: this.props.lastSelection
  };

  componentDidUpdate = () => {
    this.listContainer.scrollLeft = this.listContainer.scrollWidth;
  }

  onSelectionChange = (event, data) => {
    const { value } = data;
    const depth = data['data-depth'];

    const { selection: oldSelection } = this.state;
    const newSelection = [...oldSelection];
    newSelection.splice(depth, oldSelection.length - depth);
    newSelection.push(value);
    this.setState({ selection: newSelection });
  };

  onCancel = () => {
    this.props.onCancel();
  }

  apply = () => {
    this.props.addFilterValue(this.props.namespace, filterName, this.state.selection);
    this.props.onApply();
  };

  // Return all lists of selected sources.
  createLists = (depth, sources, selection) => {
    if (!sources || Object.keys(sources).length === 0) {
      return [];
    }
    if (selection.length > 0) {
      const selected = selection[0];
      return [this.createList(depth, sources, selected)].concat(
        this.createLists(depth + 1, sources[selected].children, selection.slice(1)));
    }

    return [this.createList(depth, sources, '')];
  }

  createList = (depth, sources, selected) => (
    <div
      key={selected}
      style={{
        width: '33%',
        paddingRight: '15px',
        height: '250px',
        display: 'inline-block',
        overflowY: 'scroll'
      }}
    >
      <List divided relaxed selection>
        {
          map(sources, (v, k) => (
            <List.Item
              active={selected === k}
              onClick={this.onSelectionChange}
              key={k}
              data-depth={depth}
              value={k}
            >
              {v.name}
            </List.Item>
          ))
        }
      </List>
    </div>
  );

  render() {
    return (
      <Segment basic attached="bottom" className="tab active" clearing>
        <div
          // eslint-disable-next-line no-return-assign
          ref={el => this.listContainer = el}
          style={{ overflowY: 'hidden', overflowX: 'scroll', width: '100%' }}
        >
          <div style={{ whiteSpace: 'nowrap', width: '100%' }}>
            {
              !!this.props.sources ?
              this.createLists(0, this.props.sources, this.state.selection).map(l => l) :
              'Loading...'
            }
          </div>
        </div>
        <Divider />
        <div>
          <Button floated="right" onClick={this.apply} primary>Apply</Button>
          <Button floated="right" onClick={this.onCancel}>Cancel</Button>
        </div>
      </Segment>
    );
  }
}

const SourceShape = {
  name: PropTypes.string.isRequired,
  children: PropTypes.objectOf(PropTypes.shape)
};
const SourcesType = PropTypes.objectOf(PropTypes.shape(SourceShape));
SourceShape.children = SourcesType;

SourcesFilter.propTypes = {
  namespace: PropTypes.string.isRequired,
  sources: SourcesType,
  onCancel: PropTypes.func,
  onApply: PropTypes.func,
  addFilterValue: PropTypes.func.isRequired,
  lastSelection: PropTypes.arrayOf(PropTypes.string)
};

SourcesFilter.defaultProps = {
  sources: null,
  onCancel: noop,
  onApply: noop,
  lastSelection: []
};

export default connect(
  (state, ownProps) => ({
    selection: filterSelectors.getLastFilterValue(state.filters, ownProps.namespace, filterName),
    sources: sources.getSources(state.sources),
  }),
  filterActions
)(SourcesFilter);