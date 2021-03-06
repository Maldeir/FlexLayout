"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RowNode = require("./RowNode.js");

var _RowNode2 = _interopRequireDefault(_RowNode);

var _Actions = require("./Actions.js");

var _Actions2 = _interopRequireDefault(_Actions);

var _TabNode = require("./TabNode.js");

var _TabNode2 = _interopRequireDefault(_TabNode);

var _TabSetNode = require("./TabSetNode.js");

var _TabSetNode2 = _interopRequireDefault(_TabSetNode);

var _BorderSet = require("./BorderSet.js");

var _BorderSet2 = _interopRequireDefault(_BorderSet);

var _BorderNode = require("./BorderNode.js");

var _BorderNode2 = _interopRequireDefault(_BorderNode);

var _DockLocation = require("../DockLocation.js");

var _DockLocation2 = _interopRequireDefault(_DockLocation);

var _AttributeDefinitions = require("../AttributeDefinitions.js");

var _AttributeDefinitions2 = _interopRequireDefault(_AttributeDefinitions);

var _Attribute = require("../Attribute");

var _Attribute2 = _interopRequireDefault(_Attribute);

var _Orientation = require("../Orientation.js");

var _Orientation2 = _interopRequireDefault(_Orientation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Class containing the Tree of Nodes used by the FlexLayout component
 */
var Model = function () {
    /**
     * 'private' constructor. Use the static method Model.fromJson(json) to create a model
     */
    function Model() {
        _classCallCheck(this, Model);

        this._attributes = {};
        this._idMap = {};
        this._nextId = 0;
        this._listener = null;
        this._root = null;
        this._borders = new _BorderSet2.default(this);
        this._onAllowDrop = null;
        this._maximizedTabSet = null;
        this._activeTabSet = null;
    }

    _createClass(Model, [{
        key: "setListener",
        value: function setListener(listener) {
            this._listener = listener;
        }

        /**
         * Sets a function to allow/deny dropping a node
         * @param onAllowDrop function that takes the drag node and DropInfo and returns true if the drop is allowed
         *
         * example function:
         *
         * allowDrop(dragNode, dropInfo) {
         *   let dropNode = dropInfo.node;
         *
         *   // prevent non-border tabs dropping into borders
         *   if (dropNode.getType() == "border" && (dragNode.getParent() == null || dragNode.getParent().getType() != "border"))
         *     return false;
         *
         *   // prevent border tabs dropping into main layout
         *   if (dropNode.getType() != "border" && (dragNode.getParent() != null && dragNode.getParent().getType() == "border"))
         *     return false;
         *
         *   return true;
         * }
         */

    }, {
        key: "setOnAllowDrop",
        value: function setOnAllowDrop(onAllowDrop) {
            this._onAllowDrop = onAllowDrop;
        }

        /**
         * Get the currently active tabset node
         * @returns {null|TabSetNode}
         */

    }, {
        key: "getActiveTabset",
        value: function getActiveTabset() {
            return this._activeTabSet;
        }
    }, {
        key: "_setActiveTabset",
        value: function _setActiveTabset(tabsetNode) {
            this._activeTabSet = tabsetNode;
        }

        /**
         * Get the currently maximized tabset node
         * @returns {null|TabSetNode}
         */

    }, {
        key: "getMaximizedTabset",
        value: function getMaximizedTabset() {
            return this._maximizedTabSet;
        }
    }, {
        key: "_setMaximizedTabset",
        value: function _setMaximizedTabset(tabsetNode) {
            this._maximizedTabSet = tabsetNode;
        }

        /**
         * Gets the root RowNode of the model
         * @returns {RowNode}
         */

    }, {
        key: "getRoot",
        value: function getRoot() {
            return this._root;
        }

        /**
         * Gets the
         * @returns {BorderSet|*}
         */

    }, {
        key: "getBorderSet",
        value: function getBorderSet() {
            return this._borders;
        }
    }, {
        key: "_getOuterInnerRects",
        value: function _getOuterInnerRects() {
            return this._borderRects;
        }

        /**
         * Visits all the nodes in the model and calls the given function for each
         * @param fn a function that takes visited node and a integer level as parameters
         */

    }, {
        key: "visitNodes",
        value: function visitNodes(fn) {
            this._borders._forEachNode(fn);
            this._root._forEachNode(fn, 0);
        }

        /**
         * Gets a node by its id
         * @param id the id to find
         * @returns {null|Node}
         */

    }, {
        key: "getNodeById",
        value: function getNodeById(id) {
            return this._idMap[id];
        }

        ///**
        // * Update the json by performing the given action,
        // * Actions should be generated via static methods on the Actions class
        // * @param json the json to update
        // * @param action the action to perform
        // * @returns {*} a new json object with the action applied
        // */
        //static apply(action, json) {
        //    console.log(json, action);
        //
        //    let model = Model.fromJson(json);
        //    model.doAction(action);
        //    return model.toJson();
        //}

        /**
         * Update the node tree by performing the given action,
         * Actions should be generated via static methods on the Actions class
         * @param action the action to perform
         */

    }, {
        key: "doAction",
        value: function doAction(action) {
            //console.log(action);
            switch (action.type) {
                case _Actions2.default.ADD_NODE:
                    {
                        var newNode = new _TabNode2.default(this, action.json);
                        var toNode = this._idMap[action.toNode];
                        toNode._drop(newNode, _DockLocation2.default.getByName(action.location), action.index);
                        break;
                    }
                case _Actions2.default.MOVE_NODE:
                    {
                        var fromNode = this._idMap[action.fromNode];
                        var _toNode = this._idMap[action.toNode];
                        _toNode._drop(fromNode, _DockLocation2.default.getByName(action.location), action.index);
                        break;
                    }
                case _Actions2.default.DELETE_TAB:
                    {
                        var node = this._idMap[action.node];
                        delete this._idMap[action.node];
                        node._delete();
                        break;
                    }
                case _Actions2.default.RENAME_TAB:
                    {
                        var _node = this._idMap[action.node];
                        _node._setName(action.text);
                        break;
                    }
                case _Actions2.default.SELECT_TAB:
                    {
                        var tabNode = this._idMap[action.tabNode];
                        var parent = tabNode.getParent();
                        var pos = parent.getChildren().indexOf(tabNode);

                        if (parent.getType() === _BorderNode2.default.TYPE) {
                            if (parent.getSelected() == pos && parent.getAttribute('custom') !== 'radio') {
                                parent._setSelected(-1);
                            } else {
                                parent._setSelected(pos);
                            }
                        } else {
                            if (parent.getSelected() !== pos) {
                                parent._setSelected(pos);
                            }
                            this._activeTabSet = parent;
                        }

                        break;
                    }
                case _Actions2.default.SET_ACTIVE_TABSET:
                    {
                        var tabsetNode = this._idMap[action.tabsetNode];
                        this._activeTabSet = tabsetNode;
                        break;
                    }
                case _Actions2.default.ADJUST_SPLIT:
                    {
                        var node1 = this._idMap[action.node1];
                        var node2 = this._idMap[action.node2];

                        this._adjustSplitSide(node1, action.weight1, action.pixelWidth1);
                        this._adjustSplitSide(node2, action.weight2, action.pixelWidth2);
                        break;
                    }
                case _Actions2.default.ADJUST_BORDER_SPLIT:
                    {
                        var _node2 = this._idMap[action.node];
                        _node2._setSize(action.pos);
                        break;
                    }
                case _Actions2.default.MAXIMIZE_TOGGLE:
                    {
                        var _node3 = this._idMap[action.node];
                        if (_node3 === this._maximizedTabSet) {
                            this._maximizedTabSet = null;
                        } else {
                            this._maximizedTabSet = _node3;
                            this._activeTabSet = _node3;
                        }

                        break;
                    }
                case _Actions2.default.UPDATE_MODEL_ATTRIBUTES:
                    {
                        this._updateAttrs(action.json);
                        break;
                    }
                case _Actions2.default.UPDATE_NODE_ATTRIBUTES:
                    {
                        var _node4 = this._idMap[action.node];
                        _node4._updateAttrs(action.json);
                        break;
                    }
            }

            this._updateIdMap();

            if (this._listener !== null) {
                this._listener();
            }
        }
    }, {
        key: "_updateIdMap",
        value: function _updateIdMap() {
            var _this = this;

            // regenerate idMap to stop it building up
            this._idMap = {};
            this.visitNodes(function (node) {
                return _this._idMap[node.getId()] = node;
            });
            //console.log(JSON.stringify(Object.keys(this._idMap)));
        }
    }, {
        key: "_adjustSplitSide",
        value: function _adjustSplitSide(node, weight, pixels) {
            node._setWeight(weight);
            if (node.getWidth() != null && node.getOrientation() === _Orientation2.default.VERT) {
                node._updateAttrs({ width: pixels });
            } else if (node.getHeight() != null && node.getOrientation() === _Orientation2.default.HORZ) {
                node._updateAttrs({ height: pixels });
            }
        }

        /**
         * Converts the model to a json object
         * @returns {*} json object that represents this model
         */

    }, {
        key: "toJson",
        value: function toJson() {
            var json = { global: {}, layout: {} };
            attributeDefinitions.toJson(json.global, this._attributes);

            // save state of nodes
            this.visitNodes(function (node) {
                node._fireEvent("save", null);
            });

            json.borders = this._borders._toJson();
            json.layout = this._root._toJson();
            return json;
        }

        /**
         * Loads the model from the given json object
         * @param json the json model to load
         * @returns {Model} a new Model object
         */

    }, {
        key: "getSplitterSize",
        value: function getSplitterSize() {
            return this._attributes["splitterSize"];
        }
    }, {
        key: "isEnableEdgeDock",
        value: function isEnableEdgeDock() {
            return this._attributes["enableEdgeDock"];
        }
    }, {
        key: "_addNode",
        value: function _addNode(node) {
            if (node.getId() == null) {
                node._setId(this._nextUniqueId());
            } else {
                if (this._idMap[node.getId()] !== undefined) {
                    throw "Error: each node must have a unique id, duplicate id: " + node.getId();
                }
            }

            if (node.getType() !== "splitter") {
                this._idMap[node.getId()] = node;
            }
        }
    }, {
        key: "_layout",
        value: function _layout(rect) {
            //let start = Date.now();
            this._borderRects = this._borders._layout({ outer: rect, inner: rect });
            this._root._layout(this._borderRects.inner);
            return this._borderRects.inner;
            //console.log("layout time: " + (Date.now() - start));
        }
    }, {
        key: "_findDropTargetNode",
        value: function _findDropTargetNode(dragNode, x, y) {
            var node = this._root._findDropTargetNode(dragNode, x, y);
            if (node == null) {
                node = this._borders._findDropTargetNode(dragNode, x, y);
            }
            return node;
        }
    }, {
        key: "_tidy",
        value: function _tidy() {
            //console.log("before _tidy", this.toString());
            this._root._tidy();
            //console.log("after _tidy", this.toString());
        }
    }, {
        key: "_updateAttrs",
        value: function _updateAttrs(json) {
            attributeDefinitions.update(json, this._attributes);
        }
    }, {
        key: "_nextUniqueId",
        value: function _nextUniqueId() {
            this._nextId++;
            while (this._idMap["#" + this._nextId] !== undefined) {
                this._nextId++;
            }

            return "#" + this._nextId;
        }
    }, {
        key: "toString",
        value: function toString() {
            return JSON.stringify(this.toJson());
        }
    }], [{
        key: "fromJson",
        value: function fromJson(json) {
            console.log("first call.");
            var model = new Model();
            attributeDefinitions.fromJson(json.global, model._attributes);

            if (json.borders) {
                model._borders = _BorderSet2.default._fromJson(json.borders, model);
            }
            model._root = _RowNode2.default._fromJson(json.layout, model);
            model._tidy(); // initial tidy of node tree
            return model;
        }
    }]);

    return Model;
}();

var attributeDefinitions = new _AttributeDefinitions2.default();

// splitter
attributeDefinitions.add("splitterSize", 8).setType(_Attribute2.default.INT).setFrom(1);
attributeDefinitions.add("enableEdgeDock", true).setType(_Attribute2.default.BOOLEAN);

// tab
attributeDefinitions.add("tabEnableClose", true).setType(_Attribute2.default.BOOLEAN);
attributeDefinitions.add("tabEnableDrag", true).setType(_Attribute2.default.BOOLEAN);
attributeDefinitions.add("tabEnableRename", true).setType(_Attribute2.default.BOOLEAN);
attributeDefinitions.add("tabClassName", null).setType(_Attribute2.default.STRING);
attributeDefinitions.add("tabIcon", null).setType(_Attribute2.default.STRING);

// tabset
attributeDefinitions.add("tabSetEnableDeleteWhenEmpty", true).setType(_Attribute2.default.BOOLEAN);
attributeDefinitions.add("tabSetEnableClose", true).setType(_Attribute2.default.BOOLEAN);
attributeDefinitions.add("tabSetEnableDrop", true).setType(_Attribute2.default.BOOLEAN);
attributeDefinitions.add("tabSetEnableDrag", true).setType(_Attribute2.default.BOOLEAN);
attributeDefinitions.add("tabSetEnableDivide", true).setType(_Attribute2.default.BOOLEAN);
attributeDefinitions.add("tabSetEnableMaximize", true).setType(_Attribute2.default.BOOLEAN);
attributeDefinitions.add("tabSetClassNameTabStrip", null).setType(_Attribute2.default.STRING);
attributeDefinitions.add("tabSetClassNameHeader", null).setType(_Attribute2.default.STRING);
attributeDefinitions.add("tabSetEnableTabStrip", true).setType(_Attribute2.default.BOOLEAN);
attributeDefinitions.add("tabSetHeaderHeight", 20).setType(_Attribute2.default.INT).setFrom(0);
attributeDefinitions.add("tabSetTabStripHeight", 20).setType(_Attribute2.default.INT).setFrom(0);

attributeDefinitions.add("borderBarSize", 25);
attributeDefinitions.add("borderEnableDrop", true).setType(_Attribute2.default.BOOLEAN);
attributeDefinitions.add("borderClassName", null).setType(_Attribute2.default.STRING);

exports.default = Model;