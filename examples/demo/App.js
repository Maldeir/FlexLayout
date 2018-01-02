import React from "react";
import ReactDOM from "react-dom";
import FlexLayout from "../../src/index.js";

let layout = {
  global: {
    splitterSize: 10
  },
  layout: { 
    type: "row", 
    id: "#4", 
    children: [ 
      { 
        type: "tabset", 
        weight: 12.5, 
        active: true, 
        id: "#5", 
        children: [ 
          { 
            type: "tab", 
            name: "FX", 
            component: "grid", 
            id: "#6" 
          } 
        ] 
      }, 
      { 
        type: "tabset", 
        weight: 25, 
        id: "#7", 
        children: [ 
          { 
            type: "tab", 
            name: "FI", 
            component: "grid", 
            id: "#8" 
          } 
        ] 
      } 
    ] 
  },
  borders: [
    {
      type: "border",
      splitterSize: 3,
      location: "left",
      children: [
        {
          type: "tab",
          enableClose: false,
          name: "Navigation",
          component: "grid",
          id: "#24"
        }
      ]
    }
  ]
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.loadLayout = this.loadLayout.bind(this);
    this.onAction = this.onAction.bind(this);
    this.save = this.save.bind(this);

    this.state = {
      layout: layout,
      model: FlexLayout.Model.fromJson(layout)
    };
  }

  componentDidMount() {
    // this.loadLayout('default');
  }

  loadLayout(str) {
    let l = localStorage.getItem(str);
    if (l) {
      this.setState({
        layout: JSON.parse(l),
        model: FlexLayout.Model.fromJson(JSON.parse(l))
      });
    }
  }

  onAction(action) {
    this.state.model.doAction(action);
    if (
      action.type === "FlexLayout_SelectTab" ||
      action.type === "FlexLayout_MoveNode" ||
      action.type === "FlexLayout_DeleteTab" ||
      action.type === "FlexLayout_AdjustSplit" ||
      action.type === "FlexLayout_AddNode"
    ) {
      setTimeout(this.save(), 500);
    }
  }

  save() {
    var jsonStr = JSON.stringify(this.state.model.toJson(), null, "\t");
    localStorage.setItem("default", jsonStr);
  }

  factory(node) {
    return <div>node....{node._attributes.name}</div>;
  }

  render() {
    return (
      <div className="app">
        <div className="contents">
          <FlexLayout.Layout
            ref="layout"
            model={this.state.model}
            onAction={this.onAction}
            factory={this.factory.bind(this)}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("container"));
