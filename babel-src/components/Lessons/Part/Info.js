'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _semanticUiReact = require('semantic-ui-react');

var _utils = require('../../../helpers/utils');

var _url = require('../../../helpers/url');

var _mdb = require('../../../helpers/mdb');

var _sources = require('../../../redux/modules/sources');

var _tags = require('../../../redux/modules/tags');

var _filters = require('../../../filters');

var _shapes = require('../../shapes');

var shapes = _interopRequireWildcard(_shapes);

var _MultiLanguageLink = require('../../Language/MultiLanguageLink');

var _MultiLanguageLink2 = _interopRequireDefault(_MultiLanguageLink);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Info = function (_Component) {
  _inherits(Info, _Component);

  function Info() {
    _classCallCheck(this, Info);

    return _possibleConstructorReturn(this, (Info.__proto__ || Object.getPrototypeOf(Info)).apply(this, arguments));
  }

  _createClass(Info, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          _props$lesson = _props.lesson,
          lesson = _props$lesson === undefined ? {} : _props$lesson,
          getSourceById = _props.getSourceById,
          getTagById = _props.getTagById,
          t = _props.t;
      var name = lesson.name,
          filmDate = lesson.film_date,
          sources = lesson.sources,
          tags = lesson.tags,
          collections = lesson.collections;


      var tagLinks = Array.from((0, _utils.intersperse)((tags || []).map(function (x) {
        var tag = getTagById(x);
        if (!tag) {
          return '';
        }

        var path = (0, _utils.tracePath)(tag, getTagById);
        var display = path.map(function (y) {
          return y.label;
        }).join(' > ');
        var query = _filters.filtersTransformer.toQueryParams([{ name: 'topics-filter', values: [x] }]);

        return _react2.default.createElement(
          _MultiLanguageLink2.default,
          { key: x, to: { pathname: '/lessons', search: (0, _url.stringify)(query) } },
          display
        );
      }), ', '));

      var sourcesLinks = Array.from((0, _utils.intersperse)((sources || []).map(function (x) {
        var source = getSourceById(x);
        if (!source) {
          return '';
        }

        var path = (0, _utils.tracePath)(source, getSourceById);
        var display = path.map(function (y) {
          return y.name;
        }).join(' > ');
        var query = _filters.filtersTransformer.toQueryParams([{ name: 'sources-filter', values: [path.map(function (y) {
            return y.id;
          })] }]);

        return _react2.default.createElement(
          _MultiLanguageLink2.default,
          { key: x, to: { pathname: '/lessons', search: (0, _url.stringify)(query) } },
          display
        );
      }), ', '));

      var breakdown = new _mdb.CollectionsBreakdown(Object.values(collections || {}));
      var eventsLinks = Array.from((0, _utils.intersperse)(breakdown.getEvents().map(function (x) {
        return _react2.default.createElement(
          _MultiLanguageLink2.default,
          { key: x.id, to: (0, _utils.canonicalLink)(x) },
          x.name
        );
      }), ', '));

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _semanticUiReact.Header,
          { as: 'h1' },
          _react2.default.createElement(
            'small',
            { className: 'text grey' },
            t('values.date', { date: new Date(filmDate) })
          ),
          _react2.default.createElement('br', null),
          name
        ),
        _react2.default.createElement(
          _semanticUiReact.List,
          null,
          tagLinks.length === 0 ? null : _react2.default.createElement(
            _semanticUiReact.List.Item,
            null,
            _react2.default.createElement(
              'strong',
              null,
              t('lessons.part.info.tags'),
              ':'
            ),
            '\xA0',
            tagLinks
          ),
          sourcesLinks.length === 0 ? null : _react2.default.createElement(
            _semanticUiReact.List.Item,
            null,
            _react2.default.createElement(
              'strong',
              null,
              t('lessons.part.info.sources'),
              ':'
            ),
            '\xA0',
            sourcesLinks
          ),
          eventsLinks.length === 0 ? null : _react2.default.createElement(
            _semanticUiReact.List.Item,
            null,
            _react2.default.createElement(
              'strong',
              null,
              t('lessons.part.info.related-event'),
              ':'
            ),
            '\xA0',
            eventsLinks
          )
        )
      );
    }
  }]);

  return Info;
}(_react.Component);

Info.propTypes = {
  lesson: shapes.LessonPart,
  getSourceById: _propTypes2.default.func.isRequired,
  getTagById: _propTypes2.default.func.isRequired,
  t: _propTypes2.default.func.isRequired
};
Info.defaultProps = {
  lesson: undefined
};
exports.default = (0, _reactRedux.connect)(function (state) {
  return {
    // NOTE (yaniv -> ido): using selectors this way will always make the component rerender
    // since sources.getSourcesById(state) !== sources.getSourcesById(state) for every state
    getSourceById: _sources.selectors.getSourceById(state.sources),
    getTagById: _tags.selectors.getTagById(state.tags)
  };
})(Info);