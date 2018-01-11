import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import * as shapes from '../../shapes';
import FullLesson from './FullLesson';

class FullLessonContainer extends Component {
  static propTypes = {
    match: shapes.RouterMatch.isRequired,
    language: PropTypes.string.isRequired,
    collection: shapes.LessonCollection,
    wip: shapes.WipMap,
    errors: shapes.ErrorsMap,
    fetchCollection: PropTypes.func.isRequired,
    fetchUnit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    collection: null,
  };

  componentDidMount() {
    this.askForDataIfNeeded(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.askForDataIfNeeded(nextProps);
  }

  askForDataIfNeeded = (props) => {
    const { match, collection, wip, errors, fetchCollection, fetchUnit } = props;

    // We fetch stuff if we don't have it already
    // and a request for it is not in progress or ended with an error.
    const id = match.params.id;

    // TODO: this is rather disgusting.
    // we should somehow clean wip & err in redux (save memory)
    // once we do this we should implement this condition differently
    // see FullEventContainer for the same problem

    if (!wip.collections.hasOwnProperty(id)) {
      // never fetched as full so fetch now
      fetchCollection(id);
    }

    if (collection && collection.id === id && Array.isArray(collection.cuIDs)) {
      collection.cuIDs.forEach((cuID) => {
        const cu = collection.content_units.find(x => x.id === cuID);
        if (!cu || !cu.files) {
          if (!(wip.units[cuID] || errors.units[cuID])) {
            fetchUnit(cuID);
          }
        }
      });
    } else if (!(wip.collections[id] || errors.collections[id])) {
      fetchCollection(id);
    }
  };

  render() {
    const { match, language, collection, wip: wipMap, errors } = this.props;

    // We're wip / err if some request is wip / err
    const id = match.params.id;
    let wip  = wipMap.collections[id];
    let err  = errors.collections[id];
    if (collection) {
      wip = wip || (Array.isArray(collection.cuIDs) && collection.cuIDs.some(cuID => wipMap.units[cuID]));
      if (!err) {
        const cuIDwithError = Array.isArray(collection.cuIDs) && collection.cuIDs.find(cuID => errors.units[cuID]);
        err                 = cuIDwithError ? errors.units[cuIDwithError] : null;
      }
    }

    return <FullLesson collection={collection} wip={wip} err={err} language={language} />;
  }
}

function mapState(state, props) {
  const collection = selectors.getDenormCollectionWUnits(state.mdb, props.match.params.id);

  return {
    collection,
    wip: selectors.getWip(state.mdb),
    errors: selectors.getErrors(state.mdb),
    language: settings.getLanguage(state.settings),
  };
}

function mapDispatch(dispatch) {
  return bindActionCreators({
    fetchCollection: actions.fetchCollection,
    fetchUnit: actions.fetchUnit,
  }, dispatch);
}

export default connect(mapState, mapDispatch)(FullLessonContainer);
