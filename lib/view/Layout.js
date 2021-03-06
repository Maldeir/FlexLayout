"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _Splitter = require("./Splitter.js");

var _Splitter2 = _interopRequireDefault(_Splitter);

var _Tab = require("./Tab.js");

var _Tab2 = _interopRequireDefault(_Tab);

var _TabSet = require("./TabSet.js");

var _TabSet2 = _interopRequireDefault(_TabSet);

var _BorderTabSet = require("./BorderTabSet.js");

var _BorderTabSet2 = _interopRequireDefault(_BorderTabSet);

var _DragDrop = require("../DragDrop.js");

var _DragDrop2 = _interopRequireDefault(_DragDrop);

var _Rect = require("../Rect.js");

var _Rect2 = _interopRequireDefault(_Rect);

var _DockLocation = require("../DockLocation.js");

var _DockLocation2 = _interopRequireDefault(_DockLocation);

var _TabNode = require("../model/TabNode.js");

var _TabNode2 = _interopRequireDefault(_TabNode);

var _TabSetNode = require("../model/TabSetNode.js");

var _TabSetNode2 = _interopRequireDefault(_TabSetNode);

var _SplitterNode = require("../model/SplitterNode.js");

var _SplitterNode2 = _interopRequireDefault(_SplitterNode);

var _Actions = require("../model/Actions.js");

var _Actions2 = _interopRequireDefault(_Actions);

var _Model = require("../model/Model.js");

var _Model2 = _interopRequireDefault(_Model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A React component that hosts a multi-tabbed layout
 */
var Layout = function (_React$Component) {
    _inherits(Layout, _React$Component);

    /**
     * @private
     */
    function Layout(props) {
        _classCallCheck(this, Layout);

        var _this = _possibleConstructorReturn(this, (Layout.__proto__ || Object.getPrototypeOf(Layout)).call(this, props));

        _this.model = _this.props.model;
        _this.rect = new _Rect2.default(0, 0, 0, 0);
        _this.model.setListener(_this.onModelChange.bind(_this));
        _this.updateRect = _this.updateRect.bind(_this);
        _this.tabIds = [];
        return _this;
    }

    _createClass(Layout, [{
        key: "onModelChange",
        value: function onModelChange() {
            this.forceUpdate();
            if (this.props.onModelChange) {
                this.props.onModelChange(this.model);
            }
        }
    }, {
        key: "doAction",
        value: function doAction(action) {
            if (this.props.onAction !== undefined) {
                this.props.onAction(action);
            } else {
                this.model.doAction(action);
            }
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(newProps) {
            if (this.model !== newProps.model) {
                if (this.model != null) {
                    this.model.setListener(null); // stop listening to old model
                }
                this.model = newProps.model;
                this.model.setListener(this.onModelChange.bind(this));
                this.forceUpdate();
            }
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            this.updateRect();

            // need to re-render if size changes
            window.addEventListener("resize", this.updateRect);
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            this.updateRect();
            //console.log("Layout time: " + this.layoutTime + "ms Render time: " + (Date.now() - this.start) + "ms");
        }
    }, {
        key: "updateRect",
        value: function updateRect() {
            var domRect = this.refs.self.getBoundingClientRect();
            var rect = new _Rect2.default(0, 0, domRect.width, domRect.height);
            if (!rect.equals(this.rect)) {
                this.rect = rect;
                this.forceUpdate();
            }
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            window.removeEventListener("resize", this.updateRect);
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            this.start = Date.now();
            var borderComponents = [];
            var tabSetComponents = [];
            var tabComponents = {};
            var splitterComponents = [];

            this.centerRect = this.model._layout(this.rect);

            this.renderBorder(this.model.getBorderSet(), borderComponents, tabComponents, splitterComponents);
            this.renderChildren(this.model.getRoot(), tabSetComponents, tabComponents, splitterComponents);

            var nextTopIds = [];
            var nextTopIdsMap = {};

            // Keep any previous tabs in the same DOM order as before, removing any that have been deleted
            this.tabIds.forEach(function (t) {
                if (tabComponents[t]) {
                    nextTopIds.push(t);
                    nextTopIdsMap[t] = t;
                }
            });
            this.tabIds = nextTopIds;

            // Add tabs that have been added to the DOM
            Object.keys(tabComponents).forEach(function (t) {
                if (!nextTopIdsMap[t]) {
                    _this2.tabIds.push(t);
                }
            });

            this.layoutTime = Date.now() - this.start;

            return _react2.default.createElement(
                "div",
                { ref: "self", className: "flexlayout__layout" },
                tabSetComponents,
                this.tabIds.map(function (t) {
                    return tabComponents[t];
                }),
                borderComponents,
                splitterComponents
            );
        }
    }, {
        key: "renderBorder",
        value: function renderBorder(borderSet, borderComponents, tabComponents, splitterComponents) {
            for (var i = 0; i < borderSet.getBorders().length; i++) {
                var border = borderSet.getBorders()[i];
                if (border.isShowing()) {
                    borderComponents.push(_react2.default.createElement(_BorderTabSet2.default, { key: "border_" + border.getLocation().getName(), border: border,
                        layout: this }));
                    var drawChildren = border._getDrawChildren();
                    for (var _i = 0; _i < drawChildren.length; _i++) {
                        var child = drawChildren[_i];

                        if (child.getType() === _SplitterNode2.default.TYPE) {
                            splitterComponents.push(_react2.default.createElement(_Splitter2.default, { key: child.getId() + 'top', layout: this, node: child, isBorderTop: true }));
                            splitterComponents.push(_react2.default.createElement(_Splitter2.default, { key: child.getId() + 'bottom', layout: this, node: child, isBorderBottom: true }));
                            splitterComponents.push(_react2.default.createElement(_Splitter2.default, { key: child.getId(), layout: this, node: child }));
                        } else if (child.getType() === _TabNode2.default.TYPE) {
                            tabComponents[child.getId()] = _react2.default.createElement(_Tab2.default, {
                                key: child.getId(),
                                layout: this,
                                node: child,
                                selected: _i == border.getSelected(),
                                factory: this.props.factory });
                        }
                    }
                }
            }
        }
    }, {
        key: "renderChildren",
        value: function renderChildren(node, tabSetComponents, tabComponents, splitterComponents) {
            var drawChildren = node._getDrawChildren();

            for (var i = 0; i < drawChildren.length; i++) {
                var child = drawChildren[i];

                if (child.getType() === _SplitterNode2.default.TYPE) {
                    splitterComponents.push(_react2.default.createElement(_Splitter2.default, { key: child.getId(), layout: this, node: child }));
                } else if (child.getType() === _TabSetNode2.default.TYPE) {
                    tabSetComponents.push(_react2.default.createElement(_TabSet2.default, { key: child.getId(), layout: this, node: child }));
                    this.renderChildren(child, tabSetComponents, tabComponents, splitterComponents);
                } else if (child.getType() === _TabNode2.default.TYPE) {
                    var selectedTab = child.getParent().getChildren()[child.getParent().getSelected()];
                    if (selectedTab == null) {
                        debugger; // this should not happen!
                    }
                    tabComponents[child.getId()] = _react2.default.createElement(_Tab2.default, {
                        key: child.getId(),
                        layout: this,
                        node: child,
                        selected: child === selectedTab,
                        factory: this.props.factory });
                } else {
                    // is row
                    this.renderChildren(child, tabSetComponents, tabComponents, splitterComponents);
                }
            }
        }

        /**
         * Adds a new tab to the given tabset
         * @param tabsetId the id of the tabset where the new tab will be added
         * @param json the json for the new tab node
         */

    }, {
        key: "addTabToTabSet",
        value: function addTabToTabSet(tabsetId, json) {
            var tabsetNode = this.model.getNodeById(tabsetId);
            if (tabsetNode != null) {
                this.doAction(_Actions2.default.addNode(json, tabsetId, _DockLocation2.default.CENTER, -1));
            }
        }

        /**
         * Adds a new tab to the active tabset (if there is one)
         * @param json the json for the new tab node
         */

    }, {
        key: "addTabToActiveTabSet",
        value: function addTabToActiveTabSet(json) {
            var tabsetNode = this.model.getActiveTabset();
            if (tabsetNode != null) {
                this.doAction(_Actions2.default.addNode(json, tabsetNode.getId(), _DockLocation2.default.CENTER, -1));
            }
        }

        /**
         * Adds a new tab by dragging a labeled panel to the drop location, dragging starts immediatelly
         * @param dragText the text to show on the drag panel
         * @param json the json for the new tab node
         * @param onDrop a callback to call when the drag is complete
         */

    }, {
        key: "addTabWithDragAndDrop",
        value: function addTabWithDragAndDrop(dragText, json, onDrop) {
            this.fnNewNodeDropped = onDrop;
            this.newTabJson = json;
            this.dragStart(null, dragText, new _TabNode2.default(this.model, json), null, null);
        }

        /**
         * Adds a new tab by dragging a labeled panel to the drop location, dragging starts when you
         * mouse down on the panel
         *
         * @param dragText the text to show on the drag panel
         * @param json the json for the new tab node
         * @param onDrop a callback to call when the drag is complete
         */

    }, {
        key: "addTabWithDragAndDropIndirect",
        value: function addTabWithDragAndDropIndirect(dragText, json, onDrop) {
            this.fnNewNodeDropped = onDrop;
            this.newTabJson = json;

            _DragDrop2.default.instance.addGlass(this.onCancelAdd.bind(this));

            this.dragDivText = dragText;
            this.dragDiv = document.createElement("div");
            this.dragDiv.className = "flexlayout__drag_rect";
            this.dragDiv.innerHTML = this.dragDivText;
            this.dragDiv.addEventListener("mousedown", this.onDragDivMouseDown.bind(this));
            this.dragDiv.addEventListener("touchstart", this.onDragDivMouseDown.bind(this));

            var r = new _Rect2.default(10, 10, 150, 50);
            r.centerInRect(this.rect);
            this.dragDiv.style.left = r.x + "px";
            this.dragDiv.style.top = r.y + "px";

            var rootdiv = _reactDom2.default.findDOMNode(this);
            rootdiv.appendChild(this.dragDiv);
        }
    }, {
        key: "onCancelAdd",
        value: function onCancelAdd() {
            var rootdiv = _reactDom2.default.findDOMNode(this);
            rootdiv.removeChild(this.dragDiv);
            this.dragDiv = null;
            if (this.fnNewNodeDropped != null) {
                this.fnNewNodeDropped();
                this.fnNewNodeDropped = null;
            }
            _DragDrop2.default.instance.hideGlass();
            this.newTabJson = null;
        }
    }, {
        key: "onCancelDrag",
        value: function onCancelDrag() {
            var rootdiv = _reactDom2.default.findDOMNode(this);

            try {
                rootdiv.removeChild(this.outlineDiv);
            } catch (e) {}

            try {
                rootdiv.removeChild(this.dragDiv);
            } catch (e) {}

            this.dragDiv = null;
            this.hideEdges(rootdiv);
            if (this.fnNewNodeDropped != null) {
                this.fnNewNodeDropped();
                this.fnNewNodeDropped = null;
            }
            _DragDrop2.default.instance.hideGlass();
            this.newTabJson = null;
        }
    }, {
        key: "onDragDivMouseDown",
        value: function onDragDivMouseDown(event) {
            event.preventDefault();
            this.dragStart(event, this.dragDivText, new _TabNode2.default(this.model, this.newTabJson), true, null, null);
        }
    }, {
        key: "dragStart",
        value: function dragStart(event, dragDivText, node, allowDrag, onClick, onDoubleClick) {
            if (this.model.getMaximizedTabset() != null || !allowDrag) {
                _DragDrop2.default.instance.startDrag(event, null, null, null, null, onClick, onDoubleClick);
            } else {
                this.dragNode = node;
                this.dragDivText = dragDivText;
                _DragDrop2.default.instance.startDrag(event, this.onDragStart.bind(this), this.onDragMove.bind(this), this.onDragEnd.bind(this), this.onCancelDrag.bind(this), onClick, onDoubleClick);
            }
        }
    }, {
        key: "onDragStart",
        value: function onDragStart(event) {
            this.dropInfo = null;
            var rootdiv = _reactDom2.default.findDOMNode(this);
            this.outlineDiv = document.createElement("div");
            this.outlineDiv.className = "flexlayout__outline_rect";
            rootdiv.appendChild(this.outlineDiv);

            if (this.dragDiv == null) {
                this.dragDiv = document.createElement("div");
                this.dragDiv.className = "flexlayout__drag_rect";
                this.dragDiv.innerHTML = this.dragDivText;
                rootdiv.appendChild(this.dragDiv);
            }
            // add edge indicators
            this.showEdges(rootdiv);

            if (this.dragNode != null && this.dragNode.getType() === _TabNode2.default.TYPE && this.dragNode.getTabRect() != null) {
                this.dragNode.getTabRect().positionElement(this.outlineDiv);
            }
            this.firstMove = true;

            return true;
        }
    }, {
        key: "onDragMove",
        value: function onDragMove(event) {
            if (this.firstMove === false) {
                this.outlineDiv.style.transition = "top .3s, left .3s, width .3s, height .3s";
            }
            this.firstMove = false;
            var clientRect = this.refs.self.getBoundingClientRect();
            var pos = {
                x: event.clientX - clientRect.left,
                y: event.clientY - clientRect.top
            };

            this.dragDiv.style.left = pos.x - this.dragDiv.getBoundingClientRect().width / 2 + "px";
            this.dragDiv.style.top = pos.y + 5 + "px";

            var dropInfo = this.model._findDropTargetNode(this.dragNode, pos.x, pos.y);
            if (dropInfo) {
                this.dropInfo = dropInfo;
                this.outlineDiv.className = dropInfo.className;
                dropInfo.rect.positionElement(this.outlineDiv);
            }
        }
    }, {
        key: "onDragEnd",
        value: function onDragEnd(event) {
            var rootdiv = _reactDom2.default.findDOMNode(this);
            rootdiv.removeChild(this.outlineDiv);
            rootdiv.removeChild(this.dragDiv);
            this.dragDiv = null;
            this.hideEdges(rootdiv);
            _DragDrop2.default.instance.hideGlass();

            if (this.dropInfo) {
                if (this.newTabJson != null) {
                    this.doAction(_Actions2.default.addNode(this.newTabJson, this.dropInfo.node.getId(), this.dropInfo.location, this.dropInfo.index));

                    if (this.fnNewNodeDropped != null) {
                        this.fnNewNodeDropped();
                        this.fnNewNodeDropped = null;
                    }
                    this.newTabJson = null;
                } else if (this.dragNode != null) {
                    this.doAction(_Actions2.default.moveNode(this.dragNode.getId(), this.dropInfo.node.getId(), this.dropInfo.location, this.dropInfo.index));
                }
            }
        }
    }, {
        key: "showEdges",
        value: function showEdges(rootdiv) {
            if (this.model.isEnableEdgeDock()) {
                var domRect = rootdiv.getBoundingClientRect();
                var r = this.centerRect;
                var size = 100;
                var length = size + "px";
                var radius = "50px";
                var width = "10px";

                this.edgeTopDiv = document.createElement("div");
                this.edgeTopDiv.className = "flexlayout__edge_rect";
                this.edgeTopDiv.style.top = r.y + "px";
                this.edgeTopDiv.style.left = r.x + (r.width - size) / 2 + "px";
                this.edgeTopDiv.style.width = length;
                this.edgeTopDiv.style.height = width;
                this.edgeTopDiv.style.borderBottomLeftRadius = radius;
                this.edgeTopDiv.style.borderBottomRightRadius = radius;

                this.edgeLeftDiv = document.createElement("div");
                this.edgeLeftDiv.className = "flexlayout__edge_rect";
                this.edgeLeftDiv.style.top = r.y + (r.height - size) / 2 + "px";
                this.edgeLeftDiv.style.left = r.x + "px";
                this.edgeLeftDiv.style.width = width;
                this.edgeLeftDiv.style.height = length;
                this.edgeLeftDiv.style.borderTopRightRadius = radius;
                this.edgeLeftDiv.style.borderBottomRightRadius = radius;

                this.edgeBottomDiv = document.createElement("div");
                this.edgeBottomDiv.className = "flexlayout__edge_rect";
                this.edgeBottomDiv.style.bottom = domRect.height - r.getBottom() + "px";
                this.edgeBottomDiv.style.left = r.x + (r.width - size) / 2 + "px";
                this.edgeBottomDiv.style.width = length;
                this.edgeBottomDiv.style.height = width;
                this.edgeBottomDiv.style.borderTopLeftRadius = radius;
                this.edgeBottomDiv.style.borderTopRightRadius = radius;

                this.edgeRightDiv = document.createElement("div");
                this.edgeRightDiv.className = "flexlayout__edge_rect";
                this.edgeRightDiv.style.top = r.y + (r.height - size) / 2 + "px";
                this.edgeRightDiv.style.right = domRect.width - r.getRight() + "px";
                this.edgeRightDiv.style.width = width;
                this.edgeRightDiv.style.height = length;
                this.edgeRightDiv.style.borderTopLeftRadius = radius;
                this.edgeRightDiv.style.borderBottomLeftRadius = radius;

                rootdiv.appendChild(this.edgeTopDiv);
                rootdiv.appendChild(this.edgeLeftDiv);
                rootdiv.appendChild(this.edgeBottomDiv);
                rootdiv.appendChild(this.edgeRightDiv);
            }
        }
    }, {
        key: "hideEdges",
        value: function hideEdges(rootdiv) {
            if (this.model.isEnableEdgeDock()) {
                try {
                    rootdiv.removeChild(this.edgeTopDiv);
                    rootdiv.removeChild(this.edgeLeftDiv);
                    rootdiv.removeChild(this.edgeBottomDiv);
                    rootdiv.removeChild(this.edgeRightDiv);
                } catch (e) {}
            }
        }
    }, {
        key: "maximize",
        value: function maximize(tabsetNode) {
            this.doAction(_Actions2.default.maximizeToggle(tabsetNode.getId()));
        }
    }, {
        key: "customizeTab",
        value: function customizeTab(tabNode, renderValues) {
            if (this.props.onRenderTab) {
                this.props.onRenderTab(tabNode, renderValues);
            }
        }
    }, {
        key: "customizeTabSet",
        value: function customizeTabSet(tabSetNode, renderValues) {
            if (this.props.onRenderTabSet) {
                this.props.onRenderTabSet(tabSetNode, renderValues);
            }
        }
    }]);

    return Layout;
}(_react2.default.Component);

Layout.propTypes = {
    model: _propTypes2.default.instanceOf(_Model2.default).isRequired,
    factory: _propTypes2.default.func.isRequired,

    onAction: _propTypes2.default.func,

    onRenderTab: _propTypes2.default.func,
    onRenderTabSet: _propTypes2.default.func,

    onModelChange: _propTypes2.default.func
};

exports.default = Layout;