import React from "react";
import ReactDOM from "react-dom";
import TabSetNode from "../model/TabSetNode.js"
import Actions from "../model/Actions.js";

class Tab extends React.Component {

    constructor(props) {
        super(props);
        this.state = {renderComponent: props.selected};
    }

    componentDidMount() {
        //console.log("mount " + this.props.node.getName());
    }

    componentWillUnmount() {
        //console.log("unmount " + this.props.node.getName());
    }

    componentWillReceiveProps(newProps) {
        if (!this.state.renderComponent && newProps.selected) {
            // load on demand
            //console.log("load on demand: " + this.props.node.getName());
            this.setState({renderComponent: true});
        }
    }

    onMouseDown(event) {
        const parent = this.props.node.getParent();
        if (parent.getType() == TabSetNode.TYPE) {
            if (!parent.isActive()) {
                this.props.layout.doAction(Actions.setActiveTabset(parent.getId()));
            }
        }
    }

    render() {
        const node = this.props.node;
        const style = node._styleWithPosition({
            display: this.props.selected ? "block" : "none"
        });
        
        let externalborders;
        let flag = false;

        if (this.props.node.getParent().isMaximized()) {
            style.zIndex = 100;
        }

        let child = null;
        if (this.state.renderComponent) {
            child = this.props.factory(node);
        }
        if(node && node._parent && node._parent._attributes && node._parent._attributes.splitterSize){
            flag = true;
            let splitterSize = node._parent._attributes.splitterSize;
            let divHeight = parseFloat(style.height.split('px')[0]);
            divHeight = (divHeight)?`${divHeight}px`:'100%';
            externalborders = {
                borderStyle: 'solid',
                borderWidth: `${splitterSize}px 0 ${splitterSize}px 0`,
                height: divHeight
            }
        }
        child = (flag)?<div className="flexlayout__internal__border__boder" style={externalborders}>{child}</div>:child;

        return <div className="flexlayout__tab"
                    onMouseDown={this.onMouseDown.bind(this)}
                    onTouchStart={this.onMouseDown.bind(this)}
                    style={style}>
                    {child}
        </div>;
    }
}

export default Tab;