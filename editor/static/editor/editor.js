CMPAAS = {};

CMPAAS.editor = function() {
  var public = {};

  public.init = function() { 
    var $$ = go.GraphObject.make;  // for conciseness in defining templates
    var yellowgrad = $$(go.Brush, go.Brush.Linear, { 0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)" });
    var radgrad = $$(go.Brush, go.Brush.Radial, { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" });

    myDiagram =
      $$(go.Diagram, "myDiagram",  // must name or refer to the DIV HTML element
        { initialContentAlignment: go.Spot.Center,
          // have mouse wheel events zoom in and out instead of scroll up and down
          "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
          // enable Ctrl-Z to undo and Ctrl-Y to redo
          "undoManager.isEnabled": true,
          "clickCreatingTool.archetypeNodeData": { text: "new node" }
        });

    myDiagram.addDiagramListener("Modified", function(e) {
      var button = document.getElementById("SaveButton");
      if (button) button.disabled = !myDiagram.isModified;
      var idx = document.title.indexOf("*");
      if (myDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx); 
      }
    });

    // define the Node template
    myDiagram.nodeTemplate =
      $$(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        // define the node's outer shape, which will surround the TextBlock
        $$(go.Shape, "RoundedRectangle",
          // { fill: yellowgrad, stroke: "black",
          { fill: "lightgray", stroke: "black",
            portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer" }),
        $$(go.TextBlock,
          { font: "bold 10pt helvetica, bold arial, sans-serif",
      margin: 4,
            editable: true },
          new go.Binding("text", "text").makeTwoWay())
      );

    myDiagram.nodeTemplate.selectionAdornmentTemplate =
      $$(go.Adornment, "Spot",
        $$(go.Panel, "Auto",
          $$(go.Shape, { fill: null, stroke: "blue", strokeWidth: 2 }),
          $$(go.Placeholder)
        ),
        // the button to create a "next" node, at the top-right corner
        $$("Button",
          { alignment: go.Spot.TopRight,
            click: addNodeAndLink },  // this function is defined below
          $$(go.Shape, "PlusLine", { desiredSize: new go.Size(6, 6) })
        ) // end button
      ); // end Adornment

    // clicking the button inserts a new node to the right of the selected node,
    // and adds a link to that new node

    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
      $$(go.Link,  // the whole link panel
        { curve: go.Link.Bezier,
          adjusting: go.Link.Stretch,
          reshapable: true 
          //, routing: go.Link.AvoidsNodes
          //, corner: 1
         },
        //new go.Binding("points").makeTwoWay(),
        new go.Binding("curviness", "curviness"),
        $$(go.Shape,  // the link shape
          { isPanelMain: true,
            stroke: "black", strokeWidth: 1.5 }),
        $$(go.Shape,  // the arrowhead
          { toArrow: "standard",
            stroke: null }),
        $$(go.Panel, "Auto",
          $$(go.Shape,  // the link shape
            { fill: radgrad, stroke: null }),
          $$(go.TextBlock, "new relation",  // the label
            { textAlign: "center",
              editable: true,
              font: "10pt helvetica, arial, sans-serif",
              stroke: "black",
              margin: 4 },
            new go.Binding("text", "text").makeTwoWay())
        )
      );

  };

  //salva o mapa 
  public.save = function(){
    var map = serialize();
    console.log(map);
    $.post('/editor/save/', map, function(dados){
      console.log(dados);
    });
  };

  //carrega o mapa 
  public.load = function(){
    $.get('/editor/load/', function(dados){
      console.log(dados);
      myDiagram.model = go.Model.fromJson(dados);
    });
  };

  // ################## PRIVATE ##################

  // função que serializa o JSON: apenas retira a propriedade 'class' do objeto
  function serialize(){
    var obj = myDiagram.model.toJson();
    obj = obj.replace("\"class\": \"go.GraphLinksModel\",",""); //verificar se há necessidade de retirar essa parte
    return obj;
  }

  function addNodeAndLink(e, obj) {
    var adorn = obj.part;
    if (adorn === null) return;
    e.handled = true;
    var diagram = adorn.diagram;
    diagram.startTransaction("Add State");
    // get the node data for which the user clicked the button
    var fromNode = adorn.adornedPart;
    var fromData = fromNode.data;
    // create a new "State" data object, positioned off to the right of the adorned Node
    var toData = { text: "new node" };
    var p = fromNode.location;
    toData.loc = p.x + 200 + " " + p.y;  // the "loc" property is a string, not a Point object
    // add the new node data to the model
    var model = diagram.model;
    model.addNodeData(toData);
    // create a link data from the old node data to the new node data
    var linkdata = {};
    linkdata[model.linkFromKeyProperty] = model.getKeyForNodeData(fromData);
    linkdata[model.linkToKeyProperty] = model.getKeyForNodeData(toData);
    // and add the link data to the model
    model.addLinkData(linkdata);
    // select the new Node
    var newnode = diagram.findNodeForData(toData);
    diagram.select(newnode);
    diagram.commitTransaction("Add State");
  }

  return public;
};


(function() {
  var editor = CMPAAS.editor();
  editor.init();

  $('#saveButton').click(function(){
    editor.save();
  });

  $('#loadButton').click(function(){
    editor.load();
  });
    
})();

// var person = { name: 'Rodolfo', lastName: 'Spalenza', fullName: function() { return this.name + ' ' + this.lastName; } };

// var personClass = function() { 
//   var public = {}, 
//   firstName, lastName;

//   public.setFirstName = function(value) {
//     this.firstName = value; 
//   };

//   public.setLastName = function(value) {
//     this.lastName = value; 
//   };

//   public.fullName = function() {
//     return this.firstName + ' ' + this.lastName;
//   };

//   public.save = function() {
//     $.ajax(function() {
//       url: '/editor',
//       method: 'POST',
//       data: { fullName: fullName() }
//       // envia para o servidor para salvar; 
//     }).done(function(data) { 
//     }); 
//   }

//   function xpto() { 
//   };

//   return public;
// };

//var person = personClass();
//person.
