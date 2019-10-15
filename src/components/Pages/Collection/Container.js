import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { actions, selectors as mdb } from '../../../redux/modules/mdb';
import { selectors as settings } from '../../../redux/modules/settings';
import { actions as statsActions } from '../../../redux/modules/stats';
import Page from './Page';


const CollectionContainer = (props) => {
  const { match, namespace, renderUnit } = props;
  const id = match.params.id;

  const collection = useSelector(state => mdb.getCollectionById(state.mdb, id));
  const wip = useSelector(state => mdb.getWip(state.mdb));
  const errors = useSelector(state => mdb.getErrors(state.mdb));
  const language = useSelector(state => settings.getLanguage(state.settings));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(statsActions.clearCUStats(namespace))
  },[namespace, dispatch]);

  useEffect(() => {
    dispatch(actions.fetchCollection(id));
  }, [id, language, wip, dispatch]);

  
  return (
    <Page
      namespace={namespace}
      collection={collection}
      wip={wip.collections[id]}
      err={errors.collections[id]}
      renderUnit={renderUnit}
    />
  );
}

export default withRouter(CollectionContainer);


// class CollectionContainer extends Component {
//   static propTypes = {
//     namespace: PropTypes.string.isRequired,
//     match: shapes.RouterMatch.isRequired,
//     collection: shapes.GenericCollection,
//     wip: shapes.WipMap.isRequired,
//     errors: shapes.ErrorsMap.isRequired,
//     fetchCollection: PropTypes.func.isRequired,
//     clearCUStats: PropTypes.func.isRequired,
//     renderUnit: PropTypes.func.isRequired,
//   };

//   static defaultProps = {
//     collection: null,
//   };

//   componentDidMount() {
//     this.props.clearCUStats(this.props.namespace);
//     this.askForDataIfNeeded(this.props);
//   }

//   UNSAFE_componentWillReceiveProps(nextProps) {
//     this.askForDataIfNeeded(nextProps);
//   }

//   askForDataIfNeeded = (props) => {
//     const { match, wip, fetchCollection } = props;

//     // TODO (edo): maybe fetch with total unit count instead of loading all units ?
//     // We fetch stuff if we don't have it already
//     // and a request for it is not in progress or ended with an error.
//     const { id } = match.params;
//     if (!Object.prototype.hasOwnProperty.call(wip.collections, id)) {
//       fetchCollection(id);
//     }
//   };

//   render() {
//     const { collection, match, wip, errors, namespace, renderUnit } = this.props;

//     const { id } = match.params;

//     return (
//       <Page
//         namespace={namespace}
//         collection={collection}
//         wip={wip.collections[id]}
//         err={errors.collections[id]}
//         renderUnit={renderUnit}
//       />
//     );
//   }
// }

// function mapState(state, ownProps) {
//   const { id } = ownProps.match.params;
//   return {
//     namespace: ownProps.namespace,
//     collection: mdb.getCollectionById(state.mdb, id),
//     wip: mdb.getWip(state.mdb),
//     errors: mdb.getErrors(state.mdb),
//     language: settings.getLanguage(state.settings),
//   };
// }

// function mapDispatch(dispatch) {
//   return bindActionCreators({
//     fetchCollection: actions.fetchCollection,
//     clearCUStats: statsActions.clearCUStats,
//   }, dispatch);
// }

// export default withRouter(connect(mapState, mapDispatch)(CollectionContainer));
