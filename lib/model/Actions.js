"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _DockLocation = require("../DockLocation.js");

var _DockLocation2 = _interopRequireDefault(_DockLocation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The Action creator class for FlexLayout model actions
 */
var Actions = function () {
    function Actions() {
        _classCallCheck(this, Actions);
    }

    _createClass(Actions, null, [{
        key: "addNode",


        /**
         * Adds a tab node to the given tabset node
         * @param json the json for the new tab node e.g {type:"tab", component:"table"}
         * @param toNodeId the new tab node will be added to the tabset with this node id
         * @param location the location where the new tab will be added, one of the DockLocation enum values.
         * @param index for docking to the center this value is the index of the tab, use -1 to add to the end.
         * @returns {{type: (string|string), json: *, toNode: *, location: (*|string), index: *}}
         */
        value: function addNode(json, toNodeId, location, index) {
            return { type: Actions.ADD_NODE, json: json, toNode: toNodeId, location: location.getName(), index: index };
        }

        /**
         * Moves a node (tab or tabset) from one location to another
         * @param fromNodeId the id of the node to move
         * @param toNodeId the id of the node to receive the moved node
         * @param location the location where the moved node will be added, one of the DockLocation enum values.
         * @param index for docking to the center this value is the index of the tab, use -1 to add to the end.
         * @returns {{type: (string|string), fromNode: *, toNode: *, location: (*|string), index: *}}
         */

    }, {
        key: "moveNode",
        value: function moveNode(fromNodeId, toNodeId, location, index) {
            return {
                type: Actions.MOVE_NODE,
                fromNode: fromNodeId,
                toNode: toNodeId,
                location: location.getName(),
                index: index
            };
        }

        /**
         * Deletes a tab node from the layout
         * @param tabNodeId the id of the node to delete
         * @returns {{type: (string|string), node: *}}
         */

    }, {
        key: "deleteTab",
        value: function deleteTab(tabNodeId) {
            return { type: Actions.DELETE_TAB, node: tabNodeId };
        }

        /**
         * Change the given nodes tab text
         * @param tabNodeId the id of the node to rename
         * @param text the test of the tab
         * @returns {{type: (string|string), node: *, text: *}}
         */

    }, {
        key: "renameTab",
        value: function renameTab(tabNodeId, text) {
            return { type: Actions.RENAME_TAB, node: tabNodeId, text: text };
        }

        /**
         * Selects the given tab in its parent tabset
         * @param tabNodeId the id of the node to set selected
         * @returns {{type: (string|string), tabNode: *}}
         */

    }, {
        key: "selectTab",
        value: function selectTab(tabNodeId) {
            return { type: Actions.SELECT_TAB, tabNode: tabNodeId };
        }

        /**
         * Set the given tabset node as the active tabset
         * @param tabsetNodeId the id of the tabset node to set as active
         * @returns {{type: (string|string), tabsetNode: *}}
         */

    }, {
        key: "setActiveTabset",
        value: function setActiveTabset(tabsetNodeId) {
            return { type: Actions.SET_ACTIVE_TABSET, tabsetNode: tabsetNodeId };
        }

        /**
         * Adjust the splitter between two tabsets
         * @example
         *  Actions.adjustSplit({node1: "1", weight1:30, pixelWidth1:300, node2: "2", weight2:70, pixelWidth2:700});
         *
         * @param splitSpec an object the defines the new split between two tabsets, see example below.
         * @returns {{type: (string|string), node1: *, weight1: *, pixelWidth1: *, node2: *, weight2: *, pixelWidth2: *}}
         */

    }, {
        key: "adjustSplit",
        value: function adjustSplit(splitSpec) {
            var node1 = splitSpec.node1;
            var node2 = splitSpec.node2;

            return {
                type: Actions.ADJUST_SPLIT,
                node1: node1, weight1: splitSpec.weight1, pixelWidth1: splitSpec.pixelWidth1,
                node2: node2, weight2: splitSpec.weight2, pixelWidth2: splitSpec.pixelWidth2
            };
        }
    }, {
        key: "adjustBorderSplit",
        value: function adjustBorderSplit(nodeId, pos) {
            return { type: Actions.ADJUST_BORDER_SPLIT, node: nodeId, pos: pos };
        }

        /**
         * Maximizes the given tabset
         * @param tabsetNodeId the id of the tabset to maximize
         * @returns {{type: (string|string), node: *}}
         */

    }, {
        key: "maximizeToggle",
        value: function maximizeToggle(tabsetNodeId) {
            return { type: Actions.MAXIMIZE_TOGGLE, node: tabsetNodeId };
        }

        /**
         * Updates the global model jsone attributes
         * @param attributes the json for the model attributes to update (merge into the existing attributes)
         * @returns {{type: (string|string), json: *}}
         */

    }, {
        key: "updateModelAttributes",
        value: function updateModelAttributes(attributes) {
            return { type: Actions.UPDATE_MODEL_ATTRIBUTES, json: attributes };
        }

        /**
         * Updates the given nodes json attributes
         * @param nodeId the id of the node to update
         * @param attributes the json attributes to update (merge with the existing attributes)
         * @returns {{type: (string|string), node: *, json: *}}
         */

    }, {
        key: "updateNodeAttributes",
        value: function updateNodeAttributes(nodeId, attributes) {
            return { type: Actions.UPDATE_NODE_ATTRIBUTES, node: nodeId, json: attributes };
        }
    }]);

    return Actions;
}();

Actions.ADD_NODE = "FlexLayout_AddNode";
Actions.MOVE_NODE = "FlexLayout_MoveNode";
Actions.DELETE_TAB = "FlexLayout_DeleteTab";
Actions.RENAME_TAB = "FlexLayout_RenameTab";
Actions.SELECT_TAB = "FlexLayout_SelectTab";
Actions.SET_ACTIVE_TABSET = "FlexLayout_SetActiveTabset";
Actions.ADJUST_SPLIT = "FlexLayout_AdjustSplit";
Actions.ADJUST_BORDER_SPLIT = "FlexLayout_AdjustBorderSplit";
Actions.MAXIMIZE_TOGGLE = "FlexLayout_MaximizeToggle";
Actions.UPDATE_MODEL_ATTRIBUTES = "FlexLayout_UpdateModelAttributes";
Actions.UPDATE_NODE_ATTRIBUTES = "FlexLayout_UpdateNodeAttributes";

exports.default = Actions;